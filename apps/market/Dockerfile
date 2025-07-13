FROM node:22 AS base

RUN npm install -g pnpm

RUN npm install -g turbo@^2

WORKDIR /app

COPY . .

RUN turbo prune @market/market --docker

WORKDIR /app/out/full

RUN pnpm install

RUN pnpm db:generate

ENV NOVU_SECRET_KEY "dummy"

RUN pnpm build

EXPOSE 3000

CMD ["node", "/app/out/full/apps/market/build/index.js"]