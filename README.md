# DeutschBloom

Plataforma de estudos de alemão publicada pelo Netlify, com conteúdo no
Cloudflare R2, autenticação pelo Supabase e pagamentos pelo Stripe.

## Publicação no Netlify

Conecte este repositório ao Netlify. O projeto é estático e as funções ficam
em `netlify/functions`.

Configure estas variáveis em **Site configuration > Environment variables**:

- `R2_ID`
- `R2_KEY`
- `R2_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_MENSAL`
- `STRIPE_PRICE_ANUAL`
- `STRIPE_PRICE_FUNDADOR`
- `SUPABASE_SERVICE_ROLE_KEY`

Depois das variáveis serem salvas, execute um novo deploy.

## Stripe

Configure no painel Stripe o webhook:

```text
https://SEU-DOMINIO/.netlify/functions/stripe-webhook
```

O webhook deve receber os eventos de conclusão do Checkout e atualizações de
assinatura usados pela função `stripe-webhook.js`.

## Supabase

Cadastre o domínio de produção em **Authentication > URL Configuration** e
mantenha a chave `service_role` somente nas variáveis protegidas do Netlify.
Ela nunca deve ser adicionada ao código do navegador.

## Teste de Criatividade

A correção por IA usa um Cloudflare Worker separado. O arquivo
`wrangler.creativity.toml` descreve esse Worker.

1. Crie um KV namespace chamado `LIMITS`.
2. Preencha o `id` do namespace em `wrangler.creativity.toml`.
3. Cadastre `SUPABASE_ANON_KEY` como secret do Worker.
4. Publique o Worker e configure a URL gerada como `AFB_CREATIVITY_API` no site.

Sem esse Worker, a tela continua funcionando com a análise demonstrativa
local, mas não utiliza o modelo de IA.

## Desenvolvimento local

Use `npm start` para iniciar o `netlify dev`, que reproduz as funções do
ambiente publicado. As credenciais locais devem ficar nas variáveis do
ambiente ou no mecanismo local do Netlify, nunca em arquivos versionados.
