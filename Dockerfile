FROM node:22 AS base

RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm db:generate

RUN pnpm build

CMD ["node", "/app/build/index.js"]