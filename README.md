# Unnamed Market

The Unnamed Market is a digital market place for the [SWCombine](https://www.swcombine.com)

## Development

```bash
git clone https://github.com/swc-unnamed/market.git

pnpm install

docker compose up -d

pnpm db:migrate

pnpm db:seed

cp .env.example .env

openssl rand -hex 32

# Copy the value of the rand to the correct encryption key environment variables

pnpm dev
```

> [!note]
> All copyrights and names are property of their respective owners.
