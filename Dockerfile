# Production build of the frontend, served by nginx. Used by dev/local/docker-compose.yml.

# --- Build stage: compile the SPA to static assets ---
FROM node:22-bookworm AS build
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
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
