import type { assets } from '$lib/server/db/schema';
import type { ColumnDef } from '@tanstack/table-core';
import type { InferSelectModel } from 'drizzle-orm';

export type Asset = InferSelectModel<typeof assets>;

export const columns: ColumnDef<Asset>[] = [
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'type',
		header: 'Type'
	},
	{
		accessorKey: 'apiLink',
		header: 'API Link'
	}
];
