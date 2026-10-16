export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" });
}

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("sv-SE")} kr`;
}