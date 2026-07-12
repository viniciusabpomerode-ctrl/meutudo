import json
import hashlib
import re
import sys
import unicodedata
import urllib.request
import zipfile
from collections import OrderedDict
from pathlib import Path
from xml.etree import ElementTree as ET

R2_BASE = "https://pub-d856fe7eb96043c3a93a4d72cd8317cc.r2.dev"
CURRENT_URL = f"{R2_BASE}/data/profissoes.json"
NS = {"x": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def slug(value):
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^a-zA-Z0-9]+", "_", value.lower()).strip("_")
    return value or "sem_nome"


def read_xlsx(path):
    with zipfile.ZipFile(path) as zf:
        root = ET.fromstring(zf.read("xl/worksheets/sheet1.xml"))
    rows = []
    for row in root.findall(".//x:sheetData/x:row", NS)[1:]:
        values = []
        for cell in row.findall("x:c", NS):
            node = cell.find("x:is/x:t", NS)
            if node is None:
                node = cell.find("x:v", NS)
            values.append(node.text.strip() if node is not None and node.text else "")
        if len(values) >= 5 and all(values[:5]):
            rows.append(tuple(values[:5]))
    return rows


def load_current():
    request = urllib.request.Request(CURRENT_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.load(response)


def build(rows, current):
    old_by_prof = {item["profession"]: item for item in current.get("expressions", [])}
    old_audio = {
        (item["profession"], phrase["de"]): phrase.get("audio_url")
        for item in current.get("expressions", [])
        for phrase in item.get("phrases", [])
        if phrase.get("audio_url")
    }
    grouped = OrderedDict()
    for category, profession, level, german, portuguese in rows:
        grouped.setdefault(profession, []).append((category, level, german, portuguese))

    expressions = []
    preserved = 0
    created = 0
    for item_id, (profession, phrases) in enumerate(grouped.items(), 1):
        category = phrases[0][0]
        old = old_by_prof.get(profession, {})
        category_slug = old.get("category_slug") or slug(category)
        profession_slug = old.get("profession_slug") or slug(profession)
        out_phrases = []
        for index, (_, level, german, portuguese) in enumerate(phrases):
            audio_url = old_audio.get((profession, german))
            if audio_url:
                preserved += 1
            else:
                filename = f"new_{hashlib.sha1(german.encode('utf-8')).hexdigest()[:12]}.mp3" if old else f"{index:03d}.mp3"
                audio_url = f"{R2_BASE}/audios/profissoes/{category_slug}/{profession_slug}/{filename}"
                created += 1
            out_phrases.append({"de": german, "pt": portuguese, "level": level, "audio_url": audio_url})
        expressions.append({
            "id": item_id,
            "german": phrases[0][2],
            "portuguese": phrases[0][3],
            "profession": profession,
            "category": category,
            "category_slug": category_slug,
            "profession_slug": profession_slug,
            "level": phrases[0][1],
            "levels": list(dict.fromkeys(p[1] for p in phrases)),
            "tags": [category, profession],
            "phrases": out_phrases,
            "audio_url": old.get("audio_url") or f"audios/profissoes/{category_slug}/{profession_slug}_main.mp3",
        })
    return {"expressions": expressions}, preserved, created


def main():
    if len(sys.argv) != 3:
        raise SystemExit("uso: build_profissoes.py PLANILHA.xlsx SAIDA.json")
    rows = read_xlsx(Path(sys.argv[1]))
    current = load_current()
    output, preserved, created = build(rows, current)
    target = Path(sys.argv[2])
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    total = sum(len(x["phrases"]) for x in output["expressions"])
    print(f"profissoes={len(output['expressions'])} frases={total} preservados={preserved} novos={created}")


if __name__ == "__main__":
    main()
