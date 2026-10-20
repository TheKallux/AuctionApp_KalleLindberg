export interface Auction {
  id: number;
  title: string;
  description: string;
  startPrice: number;
  startDate: string;
  endDate: string;
  creatorId: number;
  creatorName: string;
  highestBid: number | null;
  isOpen: boolean;
}

export interface CreateAuction {
  title: string;
  description: string;
  startPrice: number;
  startDate: string;
  endDate: string;
}