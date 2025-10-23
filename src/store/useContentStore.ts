import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../constants/api.constants";
import {
  ContentItem,
  FilterState,
  SortBy,
  MIN_PRICE,
  MAX_PRICE,
  PricingOptionEnum,
} from "../constants/content.types";

type ContentStore = {
  contents: ContentItem[];
  filteredContents: ContentItem[];
  filters: FilterState;
  loadingMore: boolean;
  visibleCount: number;
  loading: boolean;
  error: string | null;

  setSortBy: (sortBy: SortBy) => void;
  fetchContents: () => Promise<void>;
  loadMore: () => void;
  resetVisible: () => void;
  setPricingFilter: (options: string[]) => void;
  setKeyword: (keyword: string) => void;
  setPriceRange: (min: number, max: number) => void;
  clearPriceRange: () => void;
  applyFilters: (pricingOptions: string[], keyword: string) => void;
  resetFilters: () => void;
};

const defaultFilterState: FilterState = {
  pricing: [],
  keyword: "",
  sortBy: "name",
  priceMin: MIN_PRICE,
  priceMax: MAX_PRICE,
};

const useContentStore = create<ContentStore>((set, get) => ({
  contents: [],
  filteredContents: [],
  filters: defaultFilterState,
  visibleCount: 12,
  loading: false,
  error: null,
  loadingMore: false,

  fetchContents: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<ContentItem[]>(API_URL);
      const data = response.data;
      set({ contents: data, loading: false });
      const { pricing, keyword } = get().filters;
      get().applyFilters(pricing, keyword);
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch data", loading: false });
    }
  },

  loadMore: async () => {
    const { visibleCount, filteredContents } = get();
    if (visibleCount >= filteredContents.length) return;

    set({ loadingMore: true });
    set({
      visibleCount: Math.min(visibleCount + 8, filteredContents.length),
      loadingMore: false,
    });
  },

  resetVisible: () => set({ visibleCount: 12 }),

  setSortBy: (sortBy) => {
    set({ filters: { ...get().filters, sortBy } });
    const { pricing, keyword } = get().filters;
    get().applyFilters(pricing, keyword);
  },

  setPricingFilter: (pricingOptions) => {
    const { keyword } = get().filters;
    set({
      filters: {
        ...get().filters,
        pricing: pricingOptions as ("Paid" | "Free" | "View Only")[],
      },
    });
    get().applyFilters(pricingOptions, keyword);
  },

  setPriceRange: (min, max) => {
    const clampedMin = Math.max(MIN_PRICE, Math.min(min, MAX_PRICE));
    const clampedMax = Math.max(MIN_PRICE, Math.min(max, MAX_PRICE));
    set({
      filters: { ...get().filters, priceMin: clampedMin, priceMax: clampedMax },
    });
    const { pricing, keyword } = get().filters;
    get().applyFilters(pricing, keyword);
  },

  clearPriceRange: () => {
    set({
      filters: { ...get().filters, priceMin: MIN_PRICE, priceMax: MAX_PRICE },
    });
    const { pricing, keyword } = get().filters;
    get().applyFilters(pricing, keyword);
  },

  setKeyword: (keyword) => {
    const { pricing } = get().filters;
    set({ filters: { ...get().filters, keyword } });
    get().applyFilters(pricing, keyword);
  },

  applyFilters: (pricingOptions, keyword) => {
    const all = get().contents;
    if (!all.length) return;

    const LABEL_TO_ENUM: Record<string, number> = {
      Free: PricingOptionEnum.Free,
      Paid: PricingOptionEnum.Paid,
      "View Only": PricingOptionEnum.ViewOnly,
    };

    let filtered = [...all];

    if (pricingOptions.length > 0) {
      const numeric = pricingOptions.map((l) => LABEL_TO_ENUM[l]);
      filtered = filtered.filter((c) => numeric.includes(c.pricingOption));
    }

    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.creator.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q)
      );
    }
    const hasPaid = pricingOptions.includes("Paid");
    const { priceMin = MIN_PRICE, priceMax = MAX_PRICE } = get().filters;

    if (hasPaid) {
      filtered = filtered.filter(
        (c) =>
          c.pricingOption === PricingOptionEnum.Paid &&
          (c.price ?? 0) >= priceMin &&
          (c.price ?? 0) <= priceMax
      );
    }
    const sortBy = get().filters.sortBy;

    if (sortBy) {
      switch (sortBy) {
        case "priceHigh":
          filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
          break;
        case "priceLow":
          filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
          break;
        default:
          filtered.sort((a, b) =>
            a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
          );
      }
    }

    set({ filteredContents: filtered, visibleCount: 12 });
  },

  resetFilters: () => {
    let filtered = [...get().contents];
    if (filtered.length > 0) {
      filtered = filtered.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      );
    }
    set({
      filteredContents: filtered,
      visibleCount: 12,
      filters: defaultFilterState,
    });
  },
}));

export default useContentStore;
