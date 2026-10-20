import { request } from "./api";
import type { Auction, CreateAuction } from "../types/auction";

export function searchAuctions(title = "") {
  const query = title ? `?title=${encodeURIComponent(title)}` : "";
  return request<Auction[]>(`/auctions${query}`);
}

export function getAuction(id: number) {
  return request<Auction>(`/auctions/${id}`);
}

export function createAuction(data: CreateAuction, token: string) {
  return request<Auction>("/auctions", { method: "POST", body: JSON.stringify(data) }, token);
}