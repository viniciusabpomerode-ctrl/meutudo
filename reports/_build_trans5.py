# -*- coding: utf-8 -*-
"""Fase final id/ru: strings dinâmicas geradas por JS.
- Strings FIXAS -> INTERFACE_AUDIT_REPAIRS (casa a frase inteira, tem prioridade).
- Strings com NÚMERO no meio -> fragmentos no i18n-id-ru-priority.js (activeFragments)."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]

# 1) frases fixas -> translations.json (activeUi)
f = ROOT/'reports/deepseek-interface-translations.json'
payload = json.loads(f.read_text(encoding='utf-8')); T = payload['translations']
WHOLE = {
 "Criar conta pra não perder seu progresso": {"id":"Buat akun agar tidak kehilangan progres Anda","ru":"Создайте аккаунт, чтобы не потерять прогресс"},
 "🎵 Música ambiente para focar": {"id":"🎵 Musik latar untuk fokus","ru":"🎵 Фоновая музыка для концентрации"},
 "10 frases, quizzes e verbos": {"id":"10 kalimat, kuis, dan kata kerja","ru":"10 фраз, викторины и глаголы"},
}
for src, tr in WHOLE.items():
    for loc, val in tr.items():
        T.setdefault(loc, {})[src] = val
f.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding='utf-8')

# 2) fragmentos (substring) -> priority.js
pjs = ROOT/'assets/js/i18n-id-ru-priority.js'
js = pjs.read_text(encoding='utf-8')
FRAG = {
 "id": {"min por dia":"min per hari","dias por semana":"hari per minggu","nível ":"level ",
        "da sua meta pessoal — sem comparar com toda a biblioteca.":"dari target pribadi Anda — tanpa membandingkan dengan seluruh perpustakaan."},
 "ru": {"min por dia":"мин в день","dias por semana":"дней в неделю","nível ":"уровень ",
        "da sua meta pessoal — sem comparar com toda a biblioteca.":"вашей личной цели — без сравнения со всей библиотекой."},
}
def frag_str(d):
    return "".join(f'    {json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)},\n' for k, v in d.items())
for loc in ("id", "ru"):
    anchor = f"  {loc}: {{\n"
    assert anchor in js, f"ancora {loc} nao encontrada"
    js = js.replace(anchor, anchor + frag_str(FRAG[loc]), 1)
pjs.write_text(js, encoding='utf-8')
print("frases fixas add:", len(WHOLE), "| fragmentos id/ru:", len(FRAG['id']))
