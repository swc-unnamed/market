import { workflow } from '@novu/framework';
import { db } from '$lib/database/db';
import { z } from 'zod';

export const newListingWorkflow = workflow('new-listing', async ({ step, payload }) => {

  const listingData = await step.custom('get data', async () => {

    const listing = await db.auctionListing.findUnique({
      where: {
        id: payload.listingId
      },
      include: {
        items: {
          include: {
            entity: {
              select: {
                id: true,
                name: true,
                type: true
              }
            }
          }
        }
      }
    });

    if (!listing) {
      throw new Error(`Listing with ID ${payload.listingId} not found`);
    }

    return {
      listing: {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        listingNumber: listing.listingNumber,
        minimumBid: listing.minimumBid,
        items: listing.items.map(item => ({
          entity: {
            id: item.entity.id,
            name: item.entity.name,
            type: item.entity.type
          }
        })),
      }
    }
  }, {
    outputSchema: z.object({
      listing: z.object({
        id: z.string(),
        title: z.string(),
        listingNumber: z.number(),
        description: z.string(),
        minimumBid: z.number(),
        items: z.array(z.object({
          entity: z.object({
            id: z.string(),
            name: z.string(),
            type: z.string()
          })
        }))
      })
    })
  })

  await step.inApp('notify terminal', async () => {
    return {
      subject: `${listingData.listing.title}`,
      body: `A new Auction listing has been created. The bidding starts at ${listingData.listing.minimumBid.toLocaleString()} credits.`,
      primaryAction: {
        label: 'View Details',
        redirect: {
          url: `/auction-house/listings/${listingData.listing.id}`,
        }
      }
    }
  });
},
  {
    payloadSchema: z.object({
      listingId: z.string().describe('The ID of the new Auction Listing')
    }),
    name: 'Auction House - New Listing',
    description: 'This workflow is triggered when a new auction listing is created in the Auction House.',
    tags: ['auction house', 'listings'],
    preferences: {
      channels: {
        inApp: {
          enabled: true,
        }
      },
    },
  })