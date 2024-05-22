[![Deploy](https://github.com/Generics-Inc/Duet-Server/actions/workflows/deploy-job.yml/badge.svg)](https://github.com/Generics-Inc/Duet-Server/actions/workflows/deploy-job.yml)

## Installation

```bash
$ npm i
```

## Running the app

```bash
# watch mode
$ npm run start:dev

# migration mode
$ npm run start:mig

# build and run project
$ npm run build
$ npm run start:prod
```

## Env
```bash
API_PORT=

ACCESS_SECRET=
REFRESH_SECRET=
CRYPTO_SECRET=

VK_ACCESS_TOKEN=
VK_ADMIN_ID=

DATABASE_URL="postgresql://POSTGRES_USER:POSTGRES_PASSWORD@POSTGRES_URL:POSTGRES_PORT/POSTGRES_DB?schema=public"
POSTGRES_USER=
POSTGRES_PORT=
POSTGRES_DB=

MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=

SECRET=SECRET🤫
```
