# VENSO Landing

Космический лендинг VENSO: AI-продавец для продаж, электронного склада, CRM, бухгалтерии, банковских сценариев, акций, контроля исполнения и повторных продаж.

## Что изменено в этой версии

- Убраны публичные ссылки на админку из шапки и футера.
- Исправлен визуальный блок с руками: световая точка выровнена между касанием.
- Телефон заменен на `+7 771 996 70 23`.
- В мобильное меню добавлен выбор языка RU / KZ / EN.
- Меню сделано темнее, контрастнее и менее серым.
- Добавлены смыслы про продвижение товаров и акций без кода, расписание кампаний, контроль исполнения заявок, анализ покупок и базу постоянных клиентов.
- Тарифы берутся из backend Venso (`GET /api/v1/tariffs`) через `/api/tariffs` сайта; без backend показывается встроенная копия сида тарифов.
- Конкретное число дней пробного периода на сайте не указывается: в системе оно задаётся `BILLING_TRIAL_DAYS` (по умолчанию 14).
- Демо-чат теперь появляется как реальная переписка: сообщения печатаются постепенно.

## Локальный запуск

```bash
npm install
npm start
```

Сайт откроется на:

```text
http://localhost:3010
```

Служебная админка локально остается доступной по `/admin`, но на публичном лендинге ссылки на нее убраны.

## Один домен с платформой

На стенде и в проде лендинг живёт в корне домена вместе с платформой:

| Путь | Куда |
|---|---|
| `/`, `/legal/*`, `/assets/*`, `/css/*`, `/js/*` | этот лендинг (образ `ghcr.io/venso-io/venso-landing`, статика на Caddy) |
| `/app/*` | кабинет (Next.js, basePath `/app`) |
| `/api/*` | backend Venso |

Поэтому страница ходит в backend напрямую, без своего сервера: тарифы — `GET /api/v1/tariffs`
(мета-тег `venso-public-tariffs-endpoint`), заявки — `POST /api/v1/leads`. Кнопки «Войти» /
«Зарегистрироваться» ведут на `/app/login` и `/app/register` (на `localhost` — на dev-сервер
кабинета `:4000/app`). Маршрутизация — `venso_deploy/staging-server/Caddyfile`.

Образ: `Dockerfile` (только `public/` + `deploy/Caddyfile`, без `server.js`, `api/` и служебной
админки), CI — `.github/workflows/docker-image.yml` (push в `main` → GHCR → обновление стенда).

```bash
docker build -t venso-landing . && docker run --rm -p 3010:8080 venso-landing
```

## Backend Venso

| Переменная | Назначение |
|---|---|
| `VENSO_API_URL` | Адрес backend, например `https://api.venso.kz` (без `/api`). Источник тарифов. |
| `VENSO_API_TIMEOUT_MS` | Таймаут запроса тарифов, по умолчанию `4000`. |

```bash
VENSO_API_URL=http://localhost:8080 npm start
```

Локальный `server.js` отвечает на `/api/v1/tariffs` и `/api/v1/leads` (и старые `/api/tariffs`, `/api/leads`) вместо backend: тарифы проксирует в публичный `GET /api/v1/tariffs`, а заявки при заданном `VENSO_API_URL` пересылает в `POST /api/v1/leads` backend'а (без него — пишет в локальный `data/store.json`). `/api/tariffs` проксирует публичный `GET /api/v1/tariffs` (без JWT) и кеширует ответ на минуту, поэтому CORS на backend для сайта не нужен. Цены, названия и лимиты — из backend, маркетинговые описания — в `TARIFF_MARKETING` (`public/js/app.js`) по коду тарифа. Без `VENSO_API_URL` локальный сервер отдаёт тарифы из локальной админки, а если их нет — страница показывает встроенную копию сида.

## Юридические документы и согласия

Редакция документов — `version` в `public/js/legal-content.js`. Backend пишет согласия при регистрации с тем же значением (`LEGAL_DOCUMENTS_VERSION`), поэтому при публикации новой редакции обе настройки меняются вместе.

Заявка с сайта без отметки согласия на обработку ПДн отклоняется (`400 personal_data_consent_required`). Локальный сервер сохраняет с заявкой `personalDataConsent`, `consentAcceptedAt`, `consentDocuments`, `consentDocumentsVersion` и IP. На Vercel заявки пока не сохраняются.

## Vercel (до переезда на общий домен)

`vercel.json` переписывает `/api/v1/tariffs` и `/api/v1/leads` на функции из `api/`, чтобы
страница работала и отдельно от платформы. Ссылки на кабинет (`/app/...`) там никуда не ведут —
основной вариант теперь общий домен.

Для Vercel добавлены serverless endpoints:

```text
/api/tariffs
/api/leads
```

Для реальных тарифов задайте `VENSO_API_URL` в Environment Variables проекта. Без него тарифы отображаются из встроенной копии сида. Для постоянного хранения заявок на Vercel нужно подключить Postgres/Supabase/Neon и заменить временный обработчик `/api/leads`.

## Обновление через Git

```bash
git status
git add .
git commit -m "Update VENSO landing"
git push
```

После `git push` Vercel сам запустит новый deployment.


## Build marker

Current build: `v5-venso-api-tariffs-20261115`. Check browser DevTools console for `VENSO build v5-venso-api-tariffs-20261115 loaded`.
