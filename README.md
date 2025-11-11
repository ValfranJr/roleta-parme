## Projeto: Roleta de Cupons com Dashboard Admin (STAR)

### Situação

Uma campanha promocional precisava registrar participantes via formulário, sortear cupons em uma roleta visual e permitir que a equipe acompanhasse resultados em um painel administrativo seguro. Havia a necessidade de persistência em banco, autenticação simples para admins e exportação dos dados coletados.

### Tarefa

Construir um aplicativo web responsivo com:

- Coleta de nome e WhatsApp dos participantes
- Mecânica de roleta para revelar o cupom
- API para persistir e atualizar cupons ganhos
- Área administrativa com login, listagem e exportação
- Operação simples de deploy e configuração via variáveis de ambiente

### Ação

- Implementação com Next.js (App Router) e TypeScript
- UI com Tailwind CSS e componentes prontos em `src/components/ui`
- API Routes em `src/app/api` para cadastro, atualização e consulta
- Autenticação de admin baseada em cookie de sessão (`admin_session`)
- Banco PostgreSQL via `pg`, com criação automática da tabela `coupon_users`
- Painel admin com login, dashboard e botões de exportação

### Resultado

- Fluxo de participação rápido e consistente (formulário + roleta)
- Gestão centralizada no dashboard para a equipe de marketing
- Persistência confiável dos dados e trilha de auditoria mínima (timestamp)
- Base pronta para evoluções: múltiplas campanhas, regras de sorteio e relatórios

---

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- PostgreSQL (`pg`)
- Cookies HTTP-only para sessão admin

## Estrutura (principal)

- `src/app/page.tsx`: página pública com formulário/roleta
- `src/app/admin/login/page.tsx`: login admin
- `src/app/admin/dashboard/page.tsx`: dashboard admin
- `src/app/api/*`: rotas de API (submit, update, admin, auth)
- `src/lib/db.ts`: conexão e inicialização do banco
- `src/lib/auth.ts`: sessão de admin via cookies
- `src/components/*`: componentes da UI (roleta, formulários, exportação)

## Endpoints principais

- `POST /api/submit-coupon-data`
  - body: `{ name: string, whatsapp: string }`
  - cria participante (evita duplicidade por WhatsApp)
- `POST /api/update-coupon-won`
  - body: `{ whatsapp: string, coupon: string }`
  - grava o cupom ganho pelo participante
- `POST /api/admin/login`
  - body: `{ username: string, password: string }`
  - cria cookie de sessão admin ao autenticar
- `GET /api/admin/coupon-users`
  - retorna lista de participantes (requer sessão admin)

## Variáveis de ambiente

- `DATABASE_URL` (obrigatória): string de conexão do PostgreSQL
- `ADMIN_USERNAME` e `ADMIN_PASSWORD`: credenciais do painel admin
- `NODE_ENV`: ajusta `secure` do cookie e SSL do banco em produção

Exemplo `.env.local`:

```bash
DATABASE_URL=postgres://user:password@host:5432/database
ADMIN_USERNAME=admin
ADMIN_PASSWORD=strong-password
```

## Setup e execução

1. Instale dependências:

```bash
pnpm install
```

2. Configure o `.env.local` conforme acima.
3. Rode em desenvolvimento:

```bash
pnpm dev
```

4. Acesse `http://localhost:3000`.
5. Painel admin em `/admin` (login em `/admin/login`).

Build e produção:

```bash
pnpm build
pnpm start
```

## Banco de dados

Ao iniciar a aplicação, `src/lib/db.ts`:

- testa a conexão
- garante a existência da tabela:
  - `coupon_users (id, name, whatsapp UNIQUE, coupon_won, created_at)`

SSL é habilitado automaticamente em produção (`rejectUnauthorized: false`); ajuste conforme sua infra.

## Segurança

- Sessão admin via cookie HTTP-only `admin_session` (SameSite=strict)
- Recomenda-se servir somente sobre HTTPS em produção e usar variáveis fortes

## Licença

Consulte `LICENSE`.
