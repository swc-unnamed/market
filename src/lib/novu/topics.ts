export const TOPIC_AUCTION_LISTING_CREATED = 'auction:listing:created';

export const topicAuctionListing = (listingId: string): string => {
  return `auction:listing:${listingId}`;
}