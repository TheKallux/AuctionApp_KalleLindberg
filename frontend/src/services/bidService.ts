import { request } from "./api";
import type { Bid } from "../types/bid";

export function getBids(auctionId: number) {
  return request<Bid[]>(`/auctions/${auctionId}/bids`);
}

export function placeBid(auctionId: number, amount: number, token: string) {
  return request<Bid>(`/auctions/${auctionId}/bids`, { method: "POST", body: JSON.stringify({ amount }) }, token);
}