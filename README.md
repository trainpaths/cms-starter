# CMS site

A website built on [trainpaths/cms](https://github.com/trainpaths/cms). This repo holds only what is specific to the
site: its configuration (`cms.config.json`), blocks, page templates, component overrides and theme. Use it as a
GitHub template for each new client site.

```bash
cp .env.example .env     # set API_JWT_KEY, S3_SECRET_KEY (openssl rand -hex 32), BOOTSTRAP_SUPERADMIN_* (first admin)
pnpm install
pnpm docker:up            # → http://localhost:5173, admin at /admin/login
```

Development: `pnpm dev` (API stack in docker + Vite with hot reload), `pnpm docker:down` to stop.

Deploying: the stack publishes its ports on `127.0.0.1` only; put a reverse proxy on the host in front of
`127.0.0.1:FRONTEND_PORT` (TLS; it must set `X-Forwarded-For`, Caddy does by default). Backups (admin: Profile →
Backups) land in `./backups` (`BACKUP_DIR`); copy them off the server.

How it works and what you can customize: `node_modules/@trainpaths/cms/docs/INSTANCE_GUIDE.md` (after `pnpm install`),
or [the guide on GitHub](https://github.com/trainpaths/cms/blob/main/frontend/docs/INSTANCE_GUIDE.md). Project notes:
[`CLAUDE.md`](CLAUDE.md).
