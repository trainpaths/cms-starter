# CMS site

A website built on [trainpaths/cms](https://github.com/trainpaths/cms). This repo holds only what is specific to the
site: its configuration (`cms.config.json`), blocks, page templates, component overrides and theme. Use it as a
GitHub template for each new client site.

```bash
cp .env.example .env     # set API_JWT_KEY, S3_SECRET_KEY (openssl rand -hex 32), BOOTSTRAP_SUPERADMIN_* (first admin)
pnpm install
docker compose up -d --build     # → http://localhost:5173, admin at /admin/login
```

Development: `docker compose up -d --build postgres seaweedfs api && pnpm dev` (Vite with hot reload).

How it works and what you can customize: `node_modules/@trainpaths/cms/docs/INSTANCE_GUIDE.md` (after `pnpm install`),
or [the guide on GitHub](https://github.com/trainpaths/cms/blob/main/frontend/docs/INSTANCE_GUIDE.md). Project notes:
[`CLAUDE.md`](CLAUDE.md), [`claude-context/SITE.md`](claude-context/SITE.md).
