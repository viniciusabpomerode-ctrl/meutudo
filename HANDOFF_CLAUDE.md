# Continuidade para Claude Cowork — DeutschBloom

Trabalhe sempre sobre a branch `main` mais recente de:

```text
https://github.com/viniciusabpomerode-ctrl/meutudo
```

Antes de editar:

```bash
git pull --ff-only origin main
git status
```

## O que já foi implementado

- correção de áudio de Profissões, com R2 imediato e Supabase em paralelo;
- Perfil aguardando sessão do Supabase e salvando nome;
- checkout, portal e consulta Premium autenticados por JWT;
- fallback de transcrição no Worker usando Whisper;
- painel `/app/admin.html`;
- administradores, auditoria e concessão manual de planos;
- indicações e carteira de créditos;
- recompensa de 20% criada pelo webhook, com carência de sete dias;
- controle de uma sessão ativa por conta;
- players da Home e bandeja usando o mesmo estado;
- reforço de contraste e tamanho de textos nos temas.

## 1. Supabase

No painel Supabase, abra **SQL Editor**, copie todo o arquivo abaixo e execute:

```text
supabase/production_security.sql
```

Depois confirme que `viniciusabpomerode@gmail.com` existe em Authentication > Users.
O SQL o registra como `super_admin`. Se o usuário for criado depois, execute novamente o
bloco `insert into public.app_admins...` do arquivo.

Não exponha `SUPABASE_SERVICE_ROLE_KEY` no navegador ou em arquivos Git.

## 2. Variáveis do Netlify

Confira em **Site configuration > Environment variables**:

```text
R2_ID
R2_KEY
R2_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_MENSAL
STRIPE_PRICE_ANUAL
STRIPE_PRICE_FUNDADOR
SUPABASE_SERVICE_ROLE_KEY
```

Com Netlify CLI autenticada, os comandos equivalentes são:

```bash
npx netlify link
npx netlify env:list
npx netlify env:set R2_ID
npx netlify env:set R2_KEY
npx netlify env:set R2_SECRET
npx netlify env:set STRIPE_SECRET_KEY
npx netlify env:set STRIPE_WEBHOOK_SECRET
npx netlify env:set STRIPE_PRICE_MENSAL
npx netlify env:set STRIPE_PRICE_ANUAL
npx netlify env:set STRIPE_PRICE_FUNDADOR
npx netlify env:set SUPABASE_SERVICE_ROLE_KEY
```

Digite os valores somente no prompt seguro. Nunca os coloque no comando, conversa ou Git.

## 3. Worker de Criatividade e transcrição

```bash
npx wrangler login
npx wrangler kv namespace create LIMITS --config wrangler.creativity.toml
```

Copie o `id` retornado para `wrangler.creativity.toml` e habilite:

```toml
[[kv_namespaces]]
binding = "LIMITS"
id = "ID_RETORNADO"
```

Depois:

```bash
npx wrangler secret put SUPABASE_ANON_KEY --config wrangler.creativity.toml
npx wrangler deploy --config wrangler.creativity.toml
```

Copie a URL do Worker e defina `window.AFB_CREATIVITY_API` antes de carregar
`assets/js/creativity.js`. Teste `/analyze` e `/transcribe` com usuário autenticado.

## 4. Stripe

Webhook de produção:

```text
https://deutschbloom.com/.netlify/functions/stripe-webhook
```

Eventos necessários:

```text
checkout.session.completed
customer.subscription.deleted
```

Testar mensal, anual e fundador em modo de teste. Confirmar:

- registro em `user_premium`;
- redirecionamento ao Perfil;
- indicação marcada como paga;
- crédito de 20% com `available_at` sete dias depois;
- o mesmo evento não cria crédito duplicado.

## 5. Proteger o R2 — não desligar ainda

O site ainda usa a URL pública `r2.dev`. Não a desative antes de concluir este bloco.

Criar um Worker gateway com binding privado:

```toml
[[r2_buckets]]
binding = "CONTENT"
bucket_name = "edicao"
```

O gateway deve:

1. validar JWT no Supabase;
2. validar plano e sessão ativa;
3. devolver apenas amostras para visitante/grátis;
4. devolver JSON completo e áudios para Premium;
5. aceitar `Range` para áudio;
6. limitar requisições;
7. nunca devolver credenciais do R2;
8. impedir caminhos com `..` e listagem do bucket.

Criar JSONs de amostra separados ou filtrar no gateway. Não entregue o JSON completo ao
visitante, pois o bloqueio visual do frontend não protege os dados.

Somente depois de trocar `assets/js/data.js` e todos os caminhos diretos para o gateway,
testar e então desativar:

```text
Cloudflare > R2 > edicao > Settings > Public Development URL > Disable
```

## 6. Validação obrigatória

```bash
git diff --check
npx netlify dev
```

Testar em desktop e celular:

- e-mail/senha e Google OAuth;
- Perfil e alteração de nome;
- painel administrativo e bloqueio para não administradores;
- concessão de plano sem vencimento;
- link `/r/CODIGO`;
- carteira e extrato;
- segunda sessão encerrando a anterior;
- checkout sem efetuar cobrança real;
- áudio de Profissões;
- gravação e transcrição;
- Home e bandeja usando a mesma estação;
- Moderno, Vikings e Aurora nos modos dia/noite.

Não coloque chaves, tokens, e-mails de teste ou gravações no repositório.
