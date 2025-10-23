export enum PricingOptionEnum {
  Free = 0,
  Paid = 1,
  ViewOnly = 2,
}

export type SortBy = "name" | "priceHigh" | "priceLow";

export const PRICING_LABELS: Record<number, string> = {
  [PricingOptionEnum.Free]: "Free",
  [PricingOptionEnum.Paid]: "Paid",
  [PricingOptionEnum.ViewOnly]: "View Only",
};

export const MIN_PRICE = 0;
export const MAX_PRICE = 999;

export type ContentItem = {
  id: string;
  creator: string;
  title: string;
  pricingOption: number; // 0 = Free, 1 = Paid, 2 = View Only (assumed mapping)
  imagePath: string;
  price: number;
};

export type FilterState = {
  pricing: ("Paid" | "Free" | "View Only")[];
  keyword: string;
  sortBy: SortBy;
  priceMin?: number;
  priceMax?: number;
};
