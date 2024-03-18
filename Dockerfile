FROM node:21-alpine

WORKDIR /site
COPY ./package.json ./package.json

RUN corepack enable pnpm
RUN pnpm install -d

WORKDIR /site/app
COPY ./app/package.json package.json

RUN pnpm install -d

WORKDIR /site
COPY . .

WORKDIR /site/app
RUN pnpm run build

WORKDIR /site
ENTRYPOINT ["node", "index.js"]
