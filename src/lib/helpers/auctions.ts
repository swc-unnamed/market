export const formatAuctionListingStatus = (status: string) => {
	switch (status) {
		case 'new':
			return 'New';
		case 'selected':
			return 'Selected';
		case 'pending_payment':
			return 'Pending Payment';
		case 'pending_delivery':
			return 'Pending Delivery';
		case 'completed':
			return 'Completed';
		default:
			return status;
	}
};
