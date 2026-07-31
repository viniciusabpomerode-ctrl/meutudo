# -*- coding: utf-8 -*-
"""Adiciona a id/ru as strings do DYNAMIC_PATH_REPAIRS que só existiam nos 9
idiomas antigos (ex.: 'Libera os 59.000 itens...'). Merge em translations.json."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
f = ROOT/'reports/deepseek-interface-translations.json'
payload = json.loads(f.read_text(encoding='utf-8'))
T = payload['translations']

SUP = {
 "Talvez você goste de começar pelo": {"id":"Mungkin Anda ingin mulai dari","ru":"Возможно, вам стоит начать с"},
 "Libera os 59.000 itens quando quiser.": {"id":"Buka semua 59.000 item kapan pun Anda mau.","ru":"Откройте все 59.000 материалов, когда захотите."},
 "Nova conquista": {"id":"Pencapaian baru","ru":"Новое достижение"},
 "Primeira missão concluída": {"id":"Misi pertama selesai","ru":"Первая миссия выполнена"},
 "10 missões concluídas": {"id":"10 misi selesai","ru":"10 миссий выполнено"},
 "Primeira hora de estudo": {"id":"Jam belajar pertama","ru":"Первый час учёбы"},
 "5 horas de alemão": {"id":"5 jam bahasa Jerman","ru":"5 часов немецкого"},
 "Seu progresso vem das pequenas práticas que você mantém.": {"id":"Kemajuan Anda datang dari latihan-latihan kecil yang Anda jaga.","ru":"Ваш прогресс складывается из небольших практик, которые вы поддерживаете."},
 # também as versões com número no formato que o DOM mostra (id usa vírgula em milhar via runtime)
 "Libera os 59,000 itens quando quiser.": {"id":"Buka semua 59.000 item kapan pun Anda mau.","ru":"Откройте все 59.000 материалов, когда захотите."},
}
added={"id":0,"ru":0}
for src,tr in SUP.items():
    for loc,val in tr.items():
        if src not in T.get(loc,{}):
            T.setdefault(loc,{})[src]=val; added[loc]+=1
f.write_text(json.dumps(payload,ensure_ascii=False,indent=1),encoding='utf-8')
print("add:",added,"| id:",len(T['id']),"ru:",len(T['ru']))
