import { renderSnippet } from "$lib/components/ui/data-table";
import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";

export type Listing = {
  id: string;
  name: string;
  createdAt: Date;
  listingId: string;
  entityId: string;
  quantity: number;
  uuu: boolean;
  unique: boolean;
  customName: string | null;
  customImage: string | null;
  imported: boolean;
  entity: {
    id: string;
    name: string;
    imageSmall: string;
  };
  listing: {
    id: string;
    title: string;
    listingNumber: number;
    type: string;
    location: string;
    minimumBid: number;
    creditsRecipient: string;
  };
}

export const columns: ColumnDef<Listing>[] = [
  {
    accessorKey: 'entity.imageSmall',
    header: '',
    cell: ({ row }) => {
      const entity = row.original.entity;
      const imageSnipped = createRawSnippet<[string]>(() => {
        return {
          render: () => `<img src="${entity.imageSmall}" alt="${entity.name}" class="w-12 h-12 rounded" />`
        }
      });

      return renderSnippet(imageSnipped);
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: 'name',
    header: 'Entity Name',
    enableColumnFilter: true
  },
  {
    accessorKey: 'listing.title',
    header: 'Listing Title'
  },
  {
    accessorKey: 'listing.listingNumber',
    header: 'Listing #',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity'
  },
  {
    accessorKey: 'listing.minimumBid',
    header: 'Starting Bid',
    cell: ({ row }) => {
      return row.original.listing.minimumBid.toLocaleString()
    }
  },
  {
    accessorKey: 'uuu',
    header: 'U/U/U'
  },
  {
    accessorKey: 'unique',
    header: 'Unique'
  },
  {
    accessorKey: 'customImage',
    header: 'Custom Image',
    cell: ({ row }) => {
      const customImage = row.original.customImage;
      if (!customImage) {
        return ''
      }

      const customImageSnippet = createRawSnippet<[string]>(() => {
        return {
          render: () => `<img src="${customImage}" alt="Custom Image" class="w-12 h-12 rounded" />`
        }
      });

      return renderSnippet(customImageSnippet);

    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     // You can pass whatever you need from `row.original` to the component
  //     return renderComponent(DataTableActions, { id: row.original.id });
  //   },
  //   enableColumnFilter: false
  // },
]