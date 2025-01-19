****# SWC Unnamed Imperium - Market

<img src="./static/assets/unnamed-banner.png" />

## Setup

```shell
git clone https://github.com/swc-unnamed/market

cd market

pnpm install
```

Copy the `.env.example` to `.env` and update the file. Reach out to the ASIMs to get one approved. 
Marc might be able willing to provide client creds, but would prefer each developer obtains their own for security reasons.

You will need to have docker installed. If you don't have docker installed, you can install it [here](https://docs.docker.com/get-docker/)

Let's start the database:
```shell
docker compose up -d
```

Run the migrations:
```shell
pnpm db:migrate # Will run pending migrations

pnpm db:seed # Will seed your entities table with combine entities
```

You are now good to run the app

```shell
pnpm run dev
```

> [!IMPORTANT]  
> The first build will always take the longest as it's building your cache, it's okay! If you want to speed this up, run `pnpm build` before you run `pnpm dev`

## Development

- Docker for running the postgres database
- UI Market utilizing [TailwindCSS](https://tailwindcss.com/docs/installation) for it's CSS needs.
- Component library that is utlized is [shadcn svelte](https://next.shadcn-svelte.com/docs)
- Base libarary is SvelteKit and Svelte 5
- UI Market only plans for dark mode usage, because we care about your eyes even if you dont ❤️
- ORM is [drizzle](https://orm.drizzle.team/)
- Icon set is [Iconfiy](https://icon-sets.iconify.design/)

## Testing

I don't typically write tests as I personally find TDD to be a waste of time. Instead, if there is an edge case for things, I would typically write a test to just test that edge case.
