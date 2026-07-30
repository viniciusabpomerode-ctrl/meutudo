# Auditoria completa do DeutschBloom

Data: 30/07/2026

## Cobertura

- 1.192 páginas HTML verificadas.
- 1.033 páginas localizadas.
- 736 páginas de blog.
- 341 páginas do Curso Guiado A1: 11 índices e 330 aulas.
- 58 páginas da área principal e logada.
- 33 páginas de podcasts.
- 12 páginas de simulado.
- 11 páginas do teste de nível.

## Resultado técnico

- Nenhuma referência local quebrada.
- Nenhum problema estrutural nas páginas localizadas.
- Nenhum resto evidente de português nas páginas estáticas localizadas existentes.
- Todas as 330 aulas localizadas possuem os áudios esperados.
- `canonical`, `hreflang`, idioma e direção RTL estão corretos no Curso Guiado A1.

## Pendências reais de tradução

O problema principal está na interface dinâmica compartilhada:

- Inglês, espanhol, francês, italiano, turco, árabe, hebraico e polonês: 26 textos novos por idioma.
- Hindi: 27 textos novos.
- Indonésio: 246 textos.
- Russo: 242 textos.

Indonésio e russo ainda não possuem os grandes dicionários `data/id.json` e
`data/ru.json`. Por isso páginas como cadastro, perfil, profissões, vocabulário,
planos, caderno, criatividade, simulado, pronúncia e suporte ainda podem mostrar
português nesses dois idiomas.

O pacote consolidado para tradução está em:

- `reports/deepseek-interface-translation-input.json`
- `scripts/run_deepseek_interface_translation.ps1`

## Cobertura de páginas que ainda falta

Quatro artigos portugueses ainda não possuem versão nos 11 idiomas, totalizando
44 páginas localizadas ausentes:

1. `alemao-para-profissionais-de-saude-medicos-enfermeiros.html`
2. `alemao-tecnico-para-engenheiros.html`
3. `ausbildung-na-alemanha-alemao-que-voce-precisa.html`
4. `chancenkarte-quanto-o-alemao-vale-em-pontos.html`

Também falta a versão russa do teste de nível:

- `teste/ru/index.html`

## SEO

Vinte e três páginas da pasta `app` não têm descrição SEO; dez delas também não
têm canonical. Parte dessas páginas é interna ou depende de login, então isso
não é automaticamente um defeito de indexação. A decisão deve considerar quais
páginas devem aparecer no Google.

## Limitação do teste visual

O servidor local respondeu normalmente, mas o controle automatizado do navegador
interno não iniciou por uma restrição de permissões do ambiente. A auditoria
global foi feita diretamente sobre todas as páginas HTML, rotas, traduções,
metadados, links, scripts e referências de áudio. Portanto, esta auditoria cobre
todo o site em conteúdo e estrutura, mas não equivale a clicar visualmente em
cada página logada.
