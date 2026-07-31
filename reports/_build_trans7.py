# -*- coding: utf-8 -*-
"""Últimos gaps id/ru da varredura: erro (criatividade) e promo dinâmico (profissões)."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
f = ROOT/'reports/deepseek-interface-translations.json'
payload = json.loads(f.read_text(encoding='utf-8')); T = payload['translations']
WHOLE = {
 "Não foi possível carregar as perguntas.": {"id":"Tidak dapat memuat pertanyaan.","ru":"Не удалось загрузить вопросы."},
}
for src, tr in WHOLE.items():
    for loc, val in tr.items(): T.setdefault(loc, {})[src] = val
f.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding='utf-8')

pjs = ROOT/'assets/js/i18n-id-ru-priority.js'
js = pjs.read_text(encoding='utf-8')
FRAG = {
 "id": {"profissões, com frases prontas pro seu trabalho te esperando aqui dentro":
        "profesi dengan kalimat siap pakai untuk pekerjaan Anda, menanti di sini"},
 "ru": {"profissões, com frases prontas pro seu trabalho te esperando aqui dentro":
        "профессий с готовыми фразами для вашей работы ждут вас здесь"},
}
def frag_str(d):
    return "".join(f'    {json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)},\n' for k, v in d.items())
for loc in ("id", "ru"):
    anchor = f"  {loc}: {{\n"
    js = js.replace(anchor, anchor + frag_str(FRAG[loc]), 1)
pjs.write_text(js, encoding='utf-8')
print("ok")
