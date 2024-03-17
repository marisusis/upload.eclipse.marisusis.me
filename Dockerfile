FROM node:21-alpine

WORKDIR /site
COPY . .

RUN corepack enable pnpm
RUN pnpm install -d

WORKDIR /site/app
RUN pnpm install -d
RUN pnpm run build

WORKDIR /site
RUN rm gcloud.json
ENTRYPOINT ["node", "index.js"]
