# Central de Compras API

Backend REST do projeto Central de Compras.

API desenvolvida originalmente para um contexto academico e evoluida para uma live demo publica com foco em seguranca, operacao simplificada e recuperacao rapida do ambiente.

## Contexto do projeto

Este backend nasceu como entrega academica com prazo curto. A versao atual inclui hardening e ajustes de produto para ser demonstravel em ambiente publico, com contas demo e fluxo completo por perfil.

## O que mudou na adaptacao para live demo

- autenticacao por cookie HttpOnly e JWT
- protecao de rotas sensiveis com autorizacao por papel/ownership
- leitura publica para campanhas exibidas na home
- seed idempotente com dados em todas as tabelas principais
- reset total em um comando para recuperar o ambiente
- snapshot SQL com retencao
- rate limiting global e especifico para login

## Stack

- Node.js 18+
- Express 5
- PostgreSQL (pg)
- Joi
- JWT
- Bcrypt
- Swagger UI

## Arquitetura

- src/routes: rotas HTTP
- src/controllers: camada HTTP/orquestracao
- src/services: regras de negocio
- src/models: acesso a dados
- src/middlewares: auth, erros, utilitarios
- src/validations: contratos Joi
- db: conexao, seed e backup

## Contas demo

Criadas/atualizadas pelo seed:

- Admin: admin@demo.com / demo1234
- Fornecedor: fornecedor@demo.com / demo1234
- Usuario loja: usuario@demo.com / demo1234

## Como rodar localmente

1. Instalar dependencias:
   - pnpm install
2. Configurar ambiente:
   - cp .env.example .env
3. Ajustar variaveis do banco no `.env`
4. Popular dados demo:
   - pnpm run seed:demo
5. Subir API:
   - pnpm run dev

Endpoints locais:

- API: http://localhost:3000
- Swagger: http://localhost:3000/docs

## Operacao do ambiente demo

### Seed idempotente

- `pnpm run seed:demo`

Atualiza/cria as entidades demo sem depender de banco vazio.

### Reset total + seed em 1 comando

- `pnpm run seed:demo:reset`

Executa truncate das tabelas demo e reidrata o estado base.

### Snapshot SQL manual

- `pnpm run backup:snapshot`

O script:

- executa `pg_dump`
- grava arquivos em `BACKUP_DIR` (padrao `./backups`)
- remove backups antigos por dias (`BACKUP_RETENTION_DAYS`)
- limita quantidade total (`BACKUP_MAX_FILES`)

### Snapshot a cada 6h (cron)

1. Abrir o crontab:
   - `crontab -e`
2. Adicionar:
   - `0 */6 * * * cd /caminho/absoluto/projeto-central-compras && pnpm run backup:snapshot >> backup-cron.log 2>&1`

## Seguranca

- autenticacao via cookie HttpOnly
- autorizacao por papel e dono do recurso
- validacao de payloads com Joi
- tratamento padronizado de erros
- rate limiting:
  - global da API
  - dedicado para `/usuarios/login`

## Variaveis de ambiente (resumo)

Confira a referencia completa em `.env.example`.

- APP/Auth: `NODE_ENV`, `PORT`, `JWT_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `AUTH_COOKIE_*`
- CORS/Docs: `CORS_ORIGIN`, `SWAGGER_SERVER_URL`
- Banco: `POSTGRES_*`
- Seed: `DEMO_DEFAULT_PASSWORD`, `SEED_RESET_BEFORE`
- Rate limiting: `RATE_LIMIT_*`, `AUTH_RATE_LIMIT_*`
- Backup: `BACKUP_DIR`, `BACKUP_RETENTION_DAYS`, `BACKUP_MAX_FILES`

## Deploy (checklist objetivo)

1. Criar banco PostgreSQL dedicado para demo
2. Configurar variaveis de ambiente do backend
3. Publicar API (Render/Railway)
4. Validar `GET /docs`
5. Rodar `pnpm run seed:demo:reset` no ambiente deployado
6. Validar login dos 3 perfis
7. Validar home publica sem login (campanhas/produtos)
8. Agendar snapshots (cron/GitHub Actions)

## Resumo academico

O backend manteve a proposta original academica (gestao de compras por papeis), mas recebeu reforcos de engenharia para operar como demo publica: seguranca de sessao, controles de abuso, recuperacao rapida e documentacao operacional.
