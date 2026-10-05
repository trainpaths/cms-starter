# CLAUDE.md — CMS site

A client website built on the CMS (`trainpaths/cms`): this repo is an **instance**. It owns only what is specific to
the client (config, blocks, page templates, overrides, theme); the admin, editor, public site and API come from the
CMS, pinned to one version. Created from the GitHub template `trainpaths/cms-starter`.

## Read first
- `node_modules/@trainpaths/cms/docs/INSTANCE_GUIDE.md` — how instances work: `cms.config.json`, blocks, templates,
  overrides (and which are stable), theme, site config helpers, images, upgrading
- `node_modules/@trainpaths/cms/CLAUDE.md` — CMS package internals (when an override or block needs them)

## Layout
```
cms.config.json        instance config, read by the API only (pages, site config fields/groups, publicAuth, site.lang,
                       hidden blocks); "$schema" → node_modules/@trainpaths/cms/cms.config.schema.json
src/blocks/<name>/     site blocks (example: cta); Edit/Settings/index import @trainpaths/cms/editor, View @trainpaths/cms/site
src/templates/<name>.vue   template pages (example: legal = owner blocks + firm/contact/VAT/register from Configuration)
src/overrides/<Name>.vue   replace CMS components (example: SiteFooter = CMS footer + socials); nb-ui: src/overrides/ui/
src/style.css          @import '@trainpaths/cms/style.css' + theme (@theme tokens, .site-theme overrides)
src/main.ts, src/entry-client.ts, src/entry-server.ts   entry stubs (import ./style.css, call the CMS entries)
index.html, public.html    admin shell / public page template (keep the <!--app-*--> placeholders)
vite.config.ts         plugins: [cms()]
Dockerfile             build → renderer + frontend images; api = ghcr.io/trainpaths/cms-api:${CMS_VERSION} + cms.config.json
docker-compose.yml     postgres + seaweedfs + api + renderer + frontend
e2e/                   Playwright smoke tests against the compose stack
scripts/check-cms-version.mjs   package tag = Dockerfile CMS_VERSION
scripts/bump-cms.mjs   bump CMS package tag + Dockerfile CMS_VERSION + nb-ui peer together
```

## Commands
```bash
cp .env.example .env     # set API_JWT_KEY, S3_SECRET_KEY (openssl rand -hex 32), BOOTSTRAP_SUPERADMIN_* (first admin)
pnpm install
docker compose up -d --build        # whole site → http://localhost:5173, admin at /admin/login
docker compose up -d --build postgres seaweedfs api && pnpm dev   # dev: API in docker + Vite (hot reload, dev SSR)
pnpm build               # vue-tsc + client + SSR bundles
pnpm lint                # ESLint
pnpm check-version       # @trainpaths/cms tag == Dockerfile CMS_VERSION
pnpm bump-cms [X.Y.Z]    # upgrade the CMS (default: latest release), see below
pnpm test:e2e            # smoke tests (stack running; PLAYWRIGHT_BASE_URL, default http://localhost:5173)
```
(`make` targets wrap the same commands.) Changing `cms.config.json` → rebuild/restart the api (`docker compose up -d
--build api`); a new block/template/override file → restart `pnpm dev`.

## Upgrading the CMS
1. Read the GitHub releases of `trainpaths/cms` between the current and the target version (`!` = breaking).
2. `pnpm bump-cms [X.Y.Z]` (`make bump-cms V=X.Y.Z`; no version = latest): sets `@trainpaths/cms` (`#vX.Y.Z`),
   `ARG CMS_VERSION` in the `Dockerfile` and `@trainpaths/nb-ui` (= the CMS's peer at that tag), checks the tag and
   the `cms-api` image exist, runs `pnpm install` + `check-version` (`--no-install` to skip), prints release links.
3. `pnpm build`; fix type errors in blocks/templates/overrides.
4. Back up the database before deploying (the API migrates it on start, no downgrade).

## Code style
Tabs (`.editorconfig`, `.prettierrc`: no semicolons, single quotes, 120 chars, one attribute per line), `<script
setup lang="ts">`, Tailwind only (spacing unit 1px: `p-16` = 16px), container-query variants (`@md:`) in blocks.

## Git
Feature branches off `main` → PR into `main`. **Conventional Commits**, short single line: `<type>(<scope>): <desc>`
(types `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`; scopes `blocks`, `templates`, `theme`, `config`,
`infra`, `dep`).
