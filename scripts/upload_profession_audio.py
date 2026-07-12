import argparse
import os
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import boto3
from boto3.s3.transfer import TransferConfig

PUBLIC_BASE = "https://pub-d856fe7eb96043c3a93a4d72cd8317cc.r2.dev/"


def remote_status(key):
    url = PUBLIC_BASE + key.replace("\\", "/")
    for attempt in range(4):
        try:
            request = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(request, timeout=30) as response:
                return "exists" if 200 <= response.status < 300 else "error"
        except urllib.error.HTTPError as exc:
            if exc.code == 404:
                return "missing"
            if exc.code not in (429, 500, 502, 503, 504):
                return "error"
        except Exception:
            pass
        time.sleep(1.5 * (attempt + 1))
    return "error"


def main():
    parser = argparse.ArgumentParser(description="Envia somente áudios ausentes para o Cloudflare R2.")
    parser.add_argument("--source", default="r2-audios", help="Pasta criada pelo gerador de áudio")
    parser.add_argument("--bucket", default="edicao")
    parser.add_argument("--workers", type=int, default=20)
    args = parser.parse_args()

    account = os.environ.get("R2_ACCOUNT_ID")
    access = os.environ.get("R2_ACCESS_KEY_ID")
    secret = os.environ.get("R2_SECRET_ACCESS_KEY")
    if not all((account, access, secret)):
        raise SystemExit("Defina R2_ACCOUNT_ID, R2_ACCESS_KEY_ID e R2_SECRET_ACCESS_KEY.")

    root = Path(args.source).resolve()
    files = [p for p in root.rglob("*.mp3") if p.stat().st_size > 0]
    if not files:
        raise SystemExit(f"Nenhum MP3 válido encontrado em {root}")

    s3 = boto3.client(
        "s3",
        endpoint_url=f"https://{account}.r2.cloudflarestorage.com",
        aws_access_key_id=access,
        aws_secret_access_key=secret,
        region_name="auto",
    )
    transfer = TransferConfig(use_threads=False)
    stats = {"uploaded": 0, "existing": 0, "error": 0}

    def handle(path):
        key = path.relative_to(root).as_posix()
        status = remote_status(key)
        if status == "exists":
            return "existing", key
        if status != "missing":
            return "error", key
        s3.upload_file(
            str(path), args.bucket, key,
            ExtraArgs={"ContentType": "audio/mpeg", "CacheControl": "public, max-age=31536000, immutable"},
            Config=transfer,
        )
        return "uploaded", key

    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        futures = [pool.submit(handle, path) for path in files]
        for index, future in enumerate(as_completed(futures), 1):
            try:
                status, key = future.result()
            except Exception as exc:
                status, key = "error", str(exc)
            stats[status] += 1
            if status == "error":
                print(f"ERRO: {key}")
            if index % 50 == 0:
                print(f"processados={index}/{len(files)} {stats}")
    print(f"FINAL {stats}")
    if stats["error"]:
        raise SystemExit(2)


if __name__ == "__main__":
    main()
