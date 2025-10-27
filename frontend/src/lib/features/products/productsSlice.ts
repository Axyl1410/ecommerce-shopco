import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type {
  ProductFilters,
  ProductSort,
  PaginationParams,
} from "@/types/product.types";

export type Color = {
  name: string;
  code: string;
};

// Define a type for the slice state
interface ProductsState {
  // Product detail selection (existing)
  colorSelection: Color;
  sizeSelection: string;

  // Product list filtering & sorting (new)
  filters: ProductFilters;
  sort: ProductSort;
  pagination: PaginationParams;
}

// Define the initial state using that type
const initialState: ProductsState = {
  // Existing state
  colorSelection: {
    name: "Brown",
    code: "bg-[#4F4631]",
  },
  sizeSelection: "Large",

  // New state for filtering & sorting
  filters: {
    category: undefined,
    brandId: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    colors: [],
    sizes: [],
    tags: [],
    search: undefined,
  },
  sort: {
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  pagination: {
    page: 1,
    limit: 12,
  },
};

export const productsSlice = createSlice({
  name: "products",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Existing reducers
    setColorSelection: (state, action: PayloadAction<Color>) => {
      state.colorSelection = action.payload;
    },
    setSizeSelection: (state, action: PayloadAction<string>) => {
      state.sizeSelection = action.payload;
    },

    // New reducers for filtering & sorting
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to page 1 when filters change
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setCategory: (state, action: PayloadAction<string | undefined>) => {
      state.filters.category = action.payload;
      state.pagination.page = 1;
    },
    setPriceRange: (
      state,
      action: PayloadAction<{ minPrice?: number; maxPrice?: number }>
    ) => {
      state.filters.minPrice = action.payload.minPrice;
      state.filters.maxPrice = action.payload.maxPrice;
      state.pagination.page = 1;
    },
    setColors: (state, action: PayloadAction<string[]>) => {
      state.filters.colors = action.payload;
      state.pagination.page = 1;
    },
    setSizes: (state, action: PayloadAction<string[]>) => {
      state.filters.sizes = action.payload;
      state.pagination.page = 1;
    },
    setSearch: (state, action: PayloadAction<string | undefined>) => {
      state.filters.search = action.payload;
      state.pagination.page = 1;
    },
    setSort: (state, action: PayloadAction<ProductSort>) => {
      state.sort = action.payload;
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
  },
});

export const {
  setColorSelection,
  setSizeSelection,
  setFilters,
  resetFilters,
  setCategory,
  setPriceRange,
  setColors,
  setSizes,
  setSearch,
  setSort,
  setPage,
  setLimit,
} = productsSlice.actions;

export default productsSlice.reducer;
