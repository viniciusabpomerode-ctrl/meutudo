"""Gera data/vocabulario.json a partir da planilha de vocabulario (XLS/XLSX).

Uso:
    python scripts/build_vocabulario_json.py "C:\\caminho\\VOCABU_1 (2).XLS" data/vocabulario.json

Cada palavra vira um item com 3 audios separados (todos em alemao):
  000.mp3 -> a palavra com artigo (ex: "das Haus")
  001.mp3 -> o plural (ex: "Hauser")
  002.mp3 -> a frase de exemplo completa
URL segue o mesmo padrao ja usado em profissoes/girias:
  audios/vocabulario/{categoria_slug}/{palavra_slug}/000.mp3
"""
import argparse
import json
import re
import unicodedata
from pathlib import Path

import pandas as pd

R2_PUBLIC_BASE = "https://pub-d856fe7eb96043c3a93a4d72cd8317cc.r2.dev/"
ARTICLE_RE = re.compile(r"^(der|die|das)\s+", re.IGNORECASE)


def slugify(text):
    text = ARTICLE_RE.sub("", text.strip())
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-zA-Z0-9]+", "_", text).strip("_").lower()
    return text or "item"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("xls_file")
    parser.add_argument("output", nargs="?", default="data/vocabulario.json")
    parser.add_argument("--sheet", default=1, help="Indice ou nome da aba com os dados (padrao: segunda aba)")
    args = parser.parse_args()

    df = pd.read_excel(args.xls_file, sheet_name=args.sheet)
    df.columns = [c.strip() for c in df.columns]

    words = []
    seen_slugs = {}
    for i, row in df.iterrows():
        categoria = str(row["Categoria"]).strip()
        categoria_slug = slugify(categoria)
        alemao = str(row["Alemão"]).strip()
        palavra_slug = slugify(alemao)
        # Garante slug unico dentro da categoria (duas palavras podem gerar o mesmo slug)
        dedup_key = (categoria_slug, palavra_slug)
        seen_slugs[dedup_key] = seen_slugs.get(dedup_key, 0) + 1
        if seen_slugs[dedup_key] > 1:
            palavra_slug = f"{palavra_slug}_{seen_slugs[dedup_key]}"

        base_path = f"audios/vocabulario/{categoria_slug}/{palavra_slug}"
        words.append({
            "id": int(i) + 1,
            "category": categoria,
            "category_slug": categoria_slug,
            "german": alemao,
            "word_slug": palavra_slug,
            "plural": str(row["Plural"]).strip(),
            "portuguese": str(row["Tradução (PT)"]).strip(),
            "level": str(row["Nível"]).strip(),
            "example": {
                "de": str(row["Frase de Exemplo (Alemão)"]).strip(),
                "pt": str(row["Tradução da Frase (PT)"]).strip(),
            },
            "audio_word_url": f"{R2_PUBLIC_BASE}{base_path}/000.mp3",
            "audio_plural_url": f"{R2_PUBLIC_BASE}{base_path}/001.mp3",
            "audio_example_url": f"{R2_PUBLIC_BASE}{base_path}/002.mp3",
        })

    payload = {"words": words}
    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    cats = sorted(set(w["category"] for w in words))
    print(f"OK: {len(words)} palavras em {len(cats)} categorias -> {out_path}")
    for c in cats:
        n = sum(1 for w in words if w["category"] == c)
        print(f"  {c}: {n}")


if __name__ == "__main__":
    main()
