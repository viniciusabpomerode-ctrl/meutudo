# Handoff de continuidade — i18n / sync meutudo (2026-07-30)

Documento para uma nova sessão do Claude (ou do usuário) continuar SEM refazer o trabalho.

---

## ⚠️ SEGURANÇA — leia primeiro

Uma **chave de API do DeepSeek foi colada no chat** (`sk-3765b46e…`). Considere-a
**comprometida**: **gere uma nova e revogue a antiga** no painel do DeepSeek.
- A chave **NÃO** está gravada em nenhum arquivo deste repositório (verificado por grep).
- Os scripts leem a chave só de `DEEPSEEK_API_KEY` (env) ou `getpass` — nunca a gravam.
- **Nunca** hardcode/commite a chave. Nunca envie conteúdo do projeto para serviço externo
  sem necessidade — o Claude consegue traduzir localmente sem API.

---

## O que JÁ foi feito nesta sessão (Claude)

1. **Sync do `meutudo_seo_fix` → `Documents\meutudo`** (mesmo repo/remote).
   - `meutudo` estava limpo em `6c9aa73`; `seo_fix` estava 3 commits à frente + mudanças
     não commitadas. Consolidei o WIP num commit e fiz **fast-forward** do `meutudo`.
   - `meutudo` agora está em **`1883c82`**, árvore limpa. **NÃO foi feito push nem deploy.**
   - **Reverter tudo:** `git reset --hard 6c9aa73` (dentro de `C:\Users\vini\Documents\meutudo`).
   - Conteúdo trazido: curso A1 guiado localizado (30 aulas × 11 idiomas em `en/ es/ fr/ it/ tr/ ar/ he/ hi/ pl/ id/ ru /german-a1-course/`), áudio A1 servido do R2, SEO/sitemap/_redirects, i18n id/ru/pl, `assets/js/i18n-id-ru-priority.js`, `assets/js/curso-a1-localized-runtime.js`, `assets/css/curso-a1-localized.css`.

2. **A pasta de trabalho `C:\Users\vini\Documents\Codex\2026-07-21\qy\work\meutudo_seo_fix`**
   teve o WIP commitado (commit `1883c82`, mesmo do meutudo). Nada perdido.

---

## Estado das traduções de interface (i18n)

Fonte: `reports/interface-i18n-summary.md` e `reports/interface-local-audit-v2.md` (auditoria 30/07).

- **298 textos** de interface em português nas ~28 páginas compartilhadas.
- 9 idiomas antigos (en/es/fr/it/tr/ar/he/hi/pl) já têm dicionário grande no R2 (~88.700
  entradas/idioma). Faltam só **~26 rótulos NOVOS** por idioma (curso A1, contadores, títulos).
- **Prioridade = Indonésio (id) e Russo (ru)**: NÃO têm `/data/id.json` e `/data/ru.json` no R2,
  então dependem de reparo local. Lacunas na auditoria: **id ~246, ru ~242**.
- O agente anterior aplicou **327 traduções locais** (149 id, 152 ru, 26 pl) via
  `scripts/apply_interface_fast_local.py` usando `reports/deepseek-interface-fast-output.json`.

### O que ainda pode faltar (a confirmar re-rodando a auditoria)
- Rodar a auditoria de novo para ver o que sobrou depois das 327 aplicadas:
  `node scripts/audit_interface_i18n_v2.mjs` (gera `reports/interface-local-audit-v2.*`).
- Fechar as lacunas restantes de **id/ru** e os ~26 rótulos novos dos demais idiomas.

---

## Como FINALIZAR as traduções (2 caminhos)

**Caminho A — Claude traduz direto (recomendado, sem API, sem custo):**
1. Pegar o JSON de lacunas (`reports/deepseek-interface-fast-input.json` ou re-gerar a auditoria).
2. Claude preenche as traduções no formato esperado (preservando alemão, marca DeutschBloom,
   números, URLs, emojis, placeholders `{x}`).
3. Aplicar com `python scripts/apply_interface_fast_local.py` (usa o output JSON local).
4. Validar sintaxe dos arquivos de idioma + re-rodar auditoria.

**Caminho B — pipeline DeepSeek (precisa de chave NOVA):**
- `set DEEPSEEK_API_KEY=...` (nunca commitar) → `python scripts/translate_interface_fast_deepseek.py`
  → `python scripts/apply_interface_fast_local.py`.

---

## Teste e deploy (NÃO feito ainda)

- O teste visual automatizado no navegador foi **bloqueado no ambiente Codex** (permissão).
  Precisa de teste manual: `npx netlify dev` e checar id/ru nas páginas prioritárias
  (`index.html`, `app/planos.html`, `app/caderno.html`, `app/criatividade.html`,
  `app/simulado.html`, `app/pronuncia.html`, `app/suporte.html`, `app/profissoes.html`,
  `app/login.html`, `app/perfil.html`).
- **Deploy só depois do teste.** Push de `meutudo` para `origin/main` dispara o Netlify.
- Cuidados de sempre (ver `HANDOFF_CLAUDE.md`): nunca expor `SUPABASE_SERVICE_ROLE_KEY`;
  R2 público `.dev` ainda em uso; validar auth/admin/referral/wallet/checkout/áudio/temas.

---

## Arquivos úteis
- Relatórios: `reports/interface-i18n-summary.md`, `reports/interface-local-audit-v2.md`, `reports/full-site-summary.md`
- Scripts: `scripts/apply_interface_fast_local.py`, `scripts/translate_interface_fast_deepseek.py`, `scripts/audit_interface_i18n_v2.mjs`
- Dados: `reports/deepseek-interface-fast-input.json` (lacunas), `…-output.json` (traduções aplicadas)

## Progresso i18n (sessão 2026-07-30, parte 2)

**Feito e commitado (local, sem deploy):**
- Traduzi a interface de **id (172) e ru (175)** + **rótulos novos nos 9 idiomas antigos** (26–27 cada). Total **582 entradas** aplicadas via `INTERFACE_AUDIT_REPAIRS` no `assets/js/i18n.js` (commits `70d5bca`, `3747398`, `7e4caa4`).
- Verificado ao vivo (`localhost:8090/index.html?lang=id`): home passou de muito PT para **~97% traduzida**.
- Mecanismo: `reports/deepseek-interface-translations.json` (formato `{translations:{loc:{pt:trad}}}`) → `python scripts/apply_interface_translations.py` injeta o bloco no i18n.js. Scripts geradores: `reports/_build_trans*.py`, `reports/_calc_gaps.py` (gitignorados).
- ⚠️ A auditoria antiga (`reports/_to_translate.json`) SUBESTIMOU id/ru: o i18n.js tem vários dicts de reparo (DYNAMIC_PATH_REPAIRS, UI_REPAIRS, LEARNING_PATH_REPAIRS…) e a cobertura de id/ru é espalhada/incompleta. Método confiável p/ achar o que falta: rodar o site e varrer o DOM por texto PT (ver snippet abaixo).

**Strings dinâmicas (número no meio) — RESOLVIDAS** adicionando FRAGMENTOS ao
`i18n-id-ru-priority.js` (id/ru), que entra em `activeFragments` (substring). O
`translateText` (i18n.js ~1247) tenta a frase inteira em `activeUi` e, se não achar,
aplica fragmentos por substring. Frases fixas → `INTERFACE_AUDIT_REPAIRS` (activeUi);
com número → fragmentos no priority.js. Ver `reports/_build_trans5/6/7.py`.

**Varredura de páginas feita (id) — todas 0 PT após correção:** home, planos, simulado,
pronúncia, expressões, cursos, suporte, podcasts, login, criatividade, profissões.
Total **596 entradas** (commits até `3829b73`). Os 9 idiomas antigos já estavam completos
(verificado es: 0 PT), só precisavam dos ~26 rótulos novos.

**Ainda NÃO varridas (provavelmente limpas ou cauda mínima) — mesmo método:** caderno,
quiz, vocabulário, escrita, jogo, teste-rapido, sessão-rapida, música, diálogo, blog.
Edge case conhecido: o redirect de páginas logadas (perfil→login) perde o `?lang=`; com
localStorage setado funciona. Grafia a revisar: "Latihan ujians" → "Latihan ujian" (id).

**Snippet de varredura (rodar no console de cada página com `?lang=id`):** percorre `document.body` com TreeWalker(SHOW_TEXT) e coleta nós cujo texto bate um regex de palavras PT; as strings retornadas são exatamente o que ainda falta traduzir (chaves exatas p/ o dict).

## Projeto separado (não confundir)
Os **roteiros de vídeo do curso A1 (30 videoaulas)** foram concluídos noutra pasta:
`C:\Users\vini\Documents\Codex\2026-07-21\qy\roteiros_a1_30_aulas\revisao_claude\producao\` — não tem relação com este sync do site.
