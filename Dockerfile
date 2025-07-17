FROM node:22 AS base

RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm db:generate

RUN pnpm build

FROM base AS runner
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/build ./build

EXPOSE 3000

CMD ["node", "/app/build/index.js"]