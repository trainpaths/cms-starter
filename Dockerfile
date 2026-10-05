# syntax=docker/dockerfile:1
# CMS version of the API image; must match the @trainpaths/cms tag in package.json (`make check-version`, CI).
ARG CMS_VERSION=0.1.0

# ── Build: admin SPA + public site (dist/) + SSR bundle (dist-ssr/) ──────────────
FROM node:26-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Node 26 ships no corepack; pin pnpm to package.json's packageManager
RUN npm install -g "$(node -p "require('./package.json').packageManager")"
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store \
    pnpm install --frozen-lockfile --store-dir /pnpm-store
COPY . .
RUN pnpm build
# runtime files from the CMS package; -L: pnpm's node_modules entries are symlinks
RUN mkdir -p /cms && cp -L node_modules/@trainpaths/cms/nginx.conf /cms/ && \
    cp -rL node_modules/@trainpaths/cms/server /cms/server

# ── Renderer: server-renders public pages for the API (internal only) ──────────
# Needs only the public.html template, the self-contained SSR bundle and the server script (no node_modules).
FROM node:26-alpine AS renderer
WORKDIR /app
RUN echo '{"type":"module"}' > package.json
COPY --from=build /app/dist/public.html dist/public.html
COPY --from=build /app/dist-ssr dist-ssr
COPY --from=build /cms/server/render-server.js /cms/server/template.js server/
ENV NODE_ENV=production PORT=8080
USER node
EXPOSE 8080
CMD ["node", "server/render-server.js"]

# ── Frontend: unprivileged nginx on :8080 (admin SPA, /api proxy, pre-rendered pages) ──
FROM nginxinc/nginx-unprivileged:alpine AS frontend
COPY --from=build /cms/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080

# ── API: the CMS image + this site's instance config ──────────────────────────
FROM ghcr.io/trainpaths/cms-api:${CMS_VERSION} AS api
COPY cms.config.json /app/cms.config.json
