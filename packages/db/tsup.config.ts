import { defineConfig } from "tsup";

export default defineConfig({
	entry: ['src/prisma/client.ts'],
	format: ['esm'],
	dts: true,
	outDir: 'dist',
	clean: true,
	splitting: false
})