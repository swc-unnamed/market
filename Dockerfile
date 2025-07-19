FROM node:22 AS base

RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm db:generate

RUN pnpm build

FROM node:22 AS runner

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/build ./build
COPY --from=base /app/package.json ./package.json

CMD ["node", "/app/build/index.js"]