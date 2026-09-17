# URL Shortener

Сервис для сокращения длинных ссылок. Любой может вставить URL и получить короткую ссылку; зарегистрированные пользователи видят список своих ссылок и статистику переходов по каждой.

[![Maintainability](https://qlty.sh/gh/kekby/projects/shorty/maintainability.svg)](https://qlty.sh/gh/kekby/projects/shorty)

## Стек

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express
- **База данных:** PostgreSQL

## Как запустить локально

```bash
make backend            # postgres + .env + миграции + сид пользователя + dev-сервер API (порт 4000)
```

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev              # порт 3000
```

Подробности и переменные окружения — в [backend/README.md](backend/README.md).

## Деплой

- Frontend: https://frontend-flame-one-63.vercel.app/

## Структура репозитория

```
backend/    Express API + PostgreSQL
frontend/   Next.js приложение
```
