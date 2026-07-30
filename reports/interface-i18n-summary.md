# Relatório de auditoria da interface e idiomas

Data: 30/07/2026

## Escopo verificado

- 28 páginas compartilhadas da interface principal e da área logada.
- Página inicial, perfil, login, planos, profissões, vocabulário, expressões, músicas, podcasts, caderno, criatividade, pronúncia, quiz, simulado, sessão rápida e suporte.
- 11 páginas iniciais do Curso Guiado A1.
- 330 páginas de aula localizadas, 30 para cada idioma.
- 341 URLs localizadas presentes no sitemap.
- Referências dos 1.815 áudios localizados no R2.
- Sintaxe dos scripts principais de tradução, navegação, autenticação e curso.

## Resultado do Curso Guiado A1

- As 330 aulas e os 11 índices possuem idioma, direção de texto, canonical e hreflang.
- Árabe e hebraico usam direção RTL.
- Os rótulos visíveis do curso não apresentam restos evidentes de português.
- Os casos `aula` encontrados em espanhol e italiano são palavras válidas nesses idiomas.
- Foi corrigida uma mistura de inglês nas descrições SEO dos idiomas não ingleses.
- Todos os arquivos de narração esperados estão referenciados pelas páginas.

## Resultado da interface compartilhada

Foram identificados 298 textos de interface em português.

Pendências encontradas:

- Inglês: 26
- Espanhol: 26
- Francês: 26
- Italiano: 26
- Turco: 26
- Árabe: 26
- Hebraico: 26
- Hindi: 27
- Polonês: 26
- Indonésio: 246
- Russo: 242

Os nove idiomas antigos já possuem um dicionário grande com aproximadamente 88.700 entradas por idioma. As poucas lacunas restantes são principalmente rótulos novos, como Curso Guiado A1, alguns contadores, títulos de página e textos adicionados recentemente.

Indonésio e russo são a prioridade. Os arquivos públicos `/data/id.json` e `/data/ru.json` não estão disponíveis no R2, por isso essas interfaces dependem apenas de reparos locais menores e ainda exibem vários textos em português.

## Páginas prioritárias

As páginas com mais textos afetados, quase todos concentrados em indonésio e russo, são:

1. `index.html`
2. `app/planos.html`
3. `app/caderno.html`
4. `app/criatividade.html`
5. `app/simulado.html`
6. `app/pronuncia.html`
7. `app/suporte.html`
8. `app/expressoes.html`
9. `app/profissoes.html`
10. `app/login.html` e `app/perfil.html`

## Pacote preparado para o DeepSeek

- Entrada consolidada: `reports/deepseek-interface-translation-input.json`
- Tradutor: `scripts/translate_interface_gaps_deepseek.py`
- Aplicador: `scripts/apply_interface_translations.py`
- Iniciador seguro: `scripts/run_deepseek_interface_translation.ps1`

O pacote envia somente as traduções ausentes. Ele preserva alemão, marca DeutschBloom, números, valores, URLs, emojis e marcadores da interface. A chave é solicitada de forma oculta e removida do ambiente ao terminar.

## Observação do teste visual

O servidor local respondeu normalmente, mas o controle automatizado do navegador interno não iniciou por uma restrição de permissões do ambiente Codex. A auditoria foi feita diretamente sobre o HTML servido, os mapas de tradução, os scripts, as rotas e as referências de áudio.
