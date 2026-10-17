# CRUD Node.js + Prisma + PostgreSQL

API REST simples para criar, consultar, atualizar e remover tarefas.

## Requisitos

- Node.js 20.19+ (ou 22.12+)
- npm
- PostgreSQL 17+ ou Docker Compose

## Executar

```bash
npm install
cp .env.example .env
docker compose up -d db
npm run db:migrate -- --name init
npm run dev
```

O serviço inicia em `http://localhost:3000`. `GET /health` verifica se a API está ativa.
Configure `DATABASE_URL` em `.env` caso use uma instância PostgreSQL diferente.

## Endpoints

| Método | Caminho | Ação |
| --- | --- | --- |
| `GET` | `/api/tasks` | Lista tarefas |
| `GET` | `/api/tasks/:id` | Busca uma tarefa |
| `POST` | `/api/tasks` | Cria uma tarefa |
| `PATCH` | `/api/tasks/:id` | Atualiza título, descrição ou conclusão |
| `DELETE` | `/api/tasks/:id` | Remove uma tarefa |

Exemplo de criação:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Primeira tarefa","description":"Exemplo"}'
```

Os endpoints retornam `400` para entradas inválidas e `404` quando a tarefa não existe.
