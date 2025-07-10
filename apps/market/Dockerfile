FROM node:22 AS base

RUN npm install -g pnpm

RUN npm install -g turbo@^2

WORKDIR /app

COPY . .

RUN turbo prune @market/market --docker

WORKDIR /app/out/full

RUN pnpm install

RUN pnpm db:generate

RUN pnpm build

FROM node:22 AS runner

WORKDIR /app

COPY --from=base /app/out/full .

EXPOSE 3000

CMD ["node", "/app/apps/market/build/index.js"]