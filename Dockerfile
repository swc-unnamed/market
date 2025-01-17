FROM --platform=linux/arm64 node:22-alpine AS base

RUN apk update

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

COPY . .

RUN pnpm install

RUN rm -rf ./src/

USER node:node

EXPOSE 3000:3000

VOLUME [ "/data" ]

CMD ["node", "build/index.js"]