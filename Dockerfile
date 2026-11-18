# =============================================================================
# Образ лендинга venso — статика public/ на Caddy (:8080)
# =============================================================================
# На стенде лендинг живёт в корне общего домена, кабинет — под /app, весь /api/* —
# backend (venso_deploy/staging-server/Caddyfile). Node-сервер (server.js) и
# функции Vercel (api/) в образ не входят: тарифы и заявки страница берёт прямо у
# backend (/api/v1/tariffs, /api/v1/leads). Служебная админка лендинга (admin.html)
# работает только с server.js, поэтому из образа убрана.
# =============================================================================
FROM caddy:2-alpine

COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY public /srv
RUN rm -f /srv/admin.html /srv/js/admin.js

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/ || exit 1
