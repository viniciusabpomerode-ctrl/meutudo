# -*- coding: utf-8 -*-
"""Adiciona (merge) strings que a auditoria deixou passar, à translations.json."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
f = ROOT/'reports/deepseek-interface-translations.json'
payload = json.loads(f.read_text(encoding='utf-8'))
T = payload['translations']

SUP = {
 "Um diálogo": {"id":"Sebuah dialog","ru":"Диалог"},
 "Um verbo em foco": {"id":"Satu kata kerja utama","ru":"Глагол в фокусе"},
 "Pratique alemão em contexto": {"id":"Latih bahasa Jerman dalam konteks","ru":"Практикуйте немецкий в контексте"},
 "Veja exemplos e conjugação": {"id":"Lihat contoh dan konjugasi","ru":"Смотрите примеры и спряжение"},
 "Teste o que ficou na memória": {"id":"Uji apa yang tersimpan di ingatan","ru":"Проверьте, что осталось в памяти"},
 "teste seus reflexos": {"id":"uji refleks Anda","ru":"проверьте свою реакцию"},
 "prova oficial": {"id":"ujian resmi","ru":"официальный экзамен"},
 "Clique para ouvir": {"id":"Klik untuk mendengarkan","ru":"Нажмите, чтобы слушать"},
 "Clique no player para ajustar volume": {"id":"Klik pemutar untuk menyesuaikan volume","ru":"Нажмите на плеер, чтобы настроить громкость"},
 "📚 Foco": {"id":"📚 Fokus","ru":"📚 Фокус"},
 "Meta desta semana": {"id":"Target minggu ini","ru":"Цель на эту неделю"},
 "0% da sua meta pessoal — sem comparar com toda a biblioteca.": {"id":"0% dari target pribadi Anda — tanpa membandingkan dengan seluruh perpustakaan.","ru":"0% вашей личной цели — без сравнения со всей библиотекой."},
 "Um diálogo por dia": {"id":"Satu dialog per hari","ru":"Один диалог в день"},
}

added = {"id":0,"ru":0}
for src, tr in SUP.items():
    for loc, val in tr.items():
        if src not in T.get(loc, {}):
            T.setdefault(loc, {})[src] = val
            added[loc]+=1

f.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding='utf-8')
print("adicionadas id/ru:", added, "| total id:", len(T['id']), "ru:", len(T['ru']))
