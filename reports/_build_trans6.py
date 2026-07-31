# -*- coding: utf-8 -*-
"""Gaps id/ru coletados varrendo páginas (planos, simulado, pronúncia, expressões).
Fragmentos -> priority.js (activeFragments); frases fixas -> translations.json (activeUi)."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]

# frases fixas
f = ROOT/'reports/deepseek-interface-translations.json'
payload = json.loads(f.read_text(encoding='utf-8')); T = payload['translations']
WHOLE = {
 "cancele quando quiser": {"id":"batalkan kapan saja","ru":"отменить в любой момент"},
 "🎤 Gravar minha pronuncia": {"id":"🎤 Rekam pelafalan saya","ru":"🎤 Записать моё произношение"},
}
for src, tr in WHOLE.items():
    for loc, val in tr.items(): T.setdefault(loc, {})[src] = val
f.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding='utf-8')

# fragmentos (substring) -> priority.js
pjs = ROOT/'assets/js/i18n-id-ru-priority.js'
js = pjs.read_text(encoding='utf-8')
FRAG = {
 "id": {"itens de estudo":"item studi","itens":"item","/ano":"/tahun","questões":"soal",
        "Finalizar Prova":"Selesaikan Ujian","gírias e expressões":"slang dan ungkapan"},
 "ru": {"itens de estudo":"материалов для изучения","itens":"материалов","/ano":"/год","questões":"вопросов",
        "Finalizar Prova":"Завершить тест","gírias e expressões":"сленг и выражения"},
}
def frag_str(d):
    return "".join(f'    {json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)},\n' for k, v in d.items())
for loc in ("id", "ru"):
    anchor = f"  {loc}: {{\n"
    assert anchor in js, loc
    js = js.replace(anchor, anchor + frag_str(FRAG[loc]), 1)
pjs.write_text(js, encoding='utf-8')
print("fixas:", len(WHOLE), "fragmentos:", len(FRAG['id']))
