.PHONY: backend postgres-up postgres-wait migrate seed down

ENV_FILE := backend/.env
NODE_MODULES := backend/node_modules

$(ENV_FILE):
	cp backend/.env.example $(ENV_FILE)

$(NODE_MODULES): backend/package.json
	cd backend && npm install

postgres-up:
	docker compose up -d postgres

postgres-wait: postgres-up
	until docker compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done

migrate: $(ENV_FILE) $(NODE_MODULES) postgres-wait
	cd backend && npm run migrate

seed: $(ENV_FILE) $(NODE_MODULES) postgres-wait
	cd backend && npm run seed -- $(EMAIL) $(PASSWORD)

backend: migrate
	cd backend && npm run seed -- user@mail.com user
	cd backend && npm run dev

down:
	docker compose down -v
