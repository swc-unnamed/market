FROM node:22-alpine AS base

RUN apk update

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

COPY . .

RUN pnpm install

RUN pnpm prisma:generate

RUN pnpm build

USER node:node

EXPOSE 3000:3000


CMD ["node", "build/index.js"]