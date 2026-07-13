"""Gera os 3 audios em alemao de cada palavra do vocabulario (Edge TTS):
  000.mp3 = a palavra com artigo (ex: "das Haus")
  001.mp3 = o plural (ex: "Hauser")
  002.mp3 = a frase de exemplo completa

Uso:
    python scripts/generate_vocabulario_audio.py data/vocabulario.json --workers 20

Pula automaticamente o que ja existe no R2 (a nao ser que passe --regenerate).
Depois de rodar, suba a pasta gerada (padrao: r2-audios) com:
    python scripts/upload_profession_audio.py --source r2-audios
(o script de upload ja existente e generico, nao precisa de um novo)
"""
import argparse
import asyncio
import json
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

import edge_tts


def r2_exists(url):
    try:
        with urlopen(Request(url, method="HEAD", headers={"User-Agent": "Mozilla/5.0"}), timeout=20) as response:
            return 200 <= response.status < 300
    except Exception:
        return False


def relative_audio_path(url):
    return urlparse(url).path.lstrip("/")


async def main():
    parser = argparse.ArgumentParser(description="Gera os audios alemaes do vocabulario com Edge TTS.")
    parser.add_argument("json_file", help="Caminho de vocabulario.json")
    parser.add_argument("--output", default="r2-audios", help="Pasta de saida")
    parser.add_argument("--workers", type=int, default=20, help="Tarefas simultaneas")
    parser.add_argument("--voice", default="de-DE-KatjaNeural", help="Voz do Edge TTS")
    parser.add_argument("--regenerate", action="store_true", help="Gera mesmo quando o audio ja existe no R2")
    args = parser.parse_args()

    data = json.loads(Path(args.json_file).read_text(encoding="utf-8"))
    jobs = []
    for w in data["words"]:
        jobs.append((w["german"], w["audio_word_url"]))
        jobs.append((w["plural"], w["audio_plural_url"]))
        jobs.append((w["example"]["de"], w["audio_example_url"]))

    output = Path(args.output)
    semaphore = asyncio.Semaphore(max(1, args.workers))
    lock = asyncio.Lock()
    stats = {"generated": 0, "remote": 0, "local": 0, "failed": 0}

    async def run(text, url):
        path = output / relative_audio_path(url)
        if path.exists() and path.stat().st_size:
            async with lock:
                stats["local"] += 1
            return
        if not args.regenerate and await asyncio.to_thread(r2_exists, url):
            async with lock:
                stats["remote"] += 1
            return
        async with semaphore:
            try:
                path.parent.mkdir(parents=True, exist_ok=True)
                await edge_tts.Communicate(text, args.voice).save(str(path))
                async with lock:
                    stats["generated"] += 1
                    done = sum(stats.values())
                    if done % 100 == 0:
                        print(f"processados={done}/{len(jobs)} {stats}")
            except Exception as exc:
                async with lock:
                    stats["failed"] += 1
                print(f"ERRO {path}: {exc}")

    print(f"Total de audios a processar: {len(jobs)} ({len(data['words'])} palavras x 3)")
    await asyncio.gather(*(run(text, url) for text, url in jobs))
    print(stats)


if __name__ == "__main__":
    asyncio.run(main())
