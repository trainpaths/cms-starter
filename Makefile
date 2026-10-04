.PHONY: install dev up down build lint typecheck check-version test-e2e

install:
	pnpm install

dev:  ## API stack in docker (postgres, seaweedfs, api with cms.config.json), then the Vite dev server
	docker compose up -d --build postgres seaweedfs api && pnpm dev

up:
	docker compose up -d --build

down:
	docker compose down

build:  ## vue-tsc + client bundle (dist/) + SSR bundle (dist-ssr/)
	pnpm build

lint:
	pnpm lint

typecheck:
	pnpm typecheck

check-version:  ## the @trainpaths/cms tag in package.json must equal CMS_VERSION in the Dockerfile
	pnpm check-version

test-e2e:  ## Playwright smoke tests (stack must be running: make up)
	pnpm test:e2e
