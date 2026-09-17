# URL Shortener — backend

REST API на Express и PostgreSQL. 

## Стек

Node.js, Express, PostgreSQL

## Запуск локально

```bash
cp .env.example .env
docker compose -f ../docker-compose.yml up -d postgres
npm install
npm run migrate
npm run seed -- you@example.com yourpassword
npm run dev
```

Сервер поднимется на `http://localhost:4000` (порт задаётся `PORT` в `.env`).