# Production build of the frontend, served by nginx. Used by dev/local/docker-compose.yml.

# --- Build stage: compile the SPA to static assets ---
# Pinned by digest, not tag: a floating tag lets the image this builds from change with no
# change here. Bump deliberately.
FROM node:22-bookworm@sha256:7725a5c2c83eed1d36258c66efae14b1ceccd021db9ed1d9559d3335ed3d68ed AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Call the real backend (through the nginx /api proxy) instead of the in-app stub. A real
# env var overrides the committed .env (VITE_USE_STUB=true) during the Vite build.
ARG VITE_USE_STUB=false
ENV VITE_USE_STUB=$VITE_USE_STUB
RUN npm run build

# --- Serve stage: static files behind nginx ---
# nginx-unprivileged rather than nginx: the stock image runs its master process as root, which
# is unnecessary for serving static files and widens the blast radius of any container escape.
# It listens on 8080 instead of 80 — see nginx.conf and dev/local/docker-compose.yml.
FROM nginxinc/nginx-unprivileged:1.29-alpine@sha256:0c79d56aee561a1d81c63f00eee5fb5fe29279560cdc55e91425133104c7fbe6
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
