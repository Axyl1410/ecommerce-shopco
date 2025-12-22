import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "@/types/product.types";

// Maximum number of products that can be compared
const MAX_COMPARISON_ITEMS = 4;

export type ComparisonProduct = Product;

interface ComparisonState {
  items: ComparisonProduct[];
}

const initialState: ComparisonState = {
  items: [],
};

export const comparisonSlice = createSlice({
  name: "comparison",
  initialState,
  reducers: {
    addToComparison: (state, action: PayloadAction<ComparisonProduct>) => {
      // Check if product already exists
      const exists = state.items.some((item) => item.id === action.payload.id);
      
      if (exists) {
        return; // Don't add duplicate
      }

      // Check if we've reached the maximum
      if (state.items.length >= MAX_COMPARISON_ITEMS) {
        return; // Don't add if max reached
      }

      state.items.push(action.payload);
    },
    removeFromComparison: (state, action: PayloadAction<number | string>) => {
      const idToRemove = action.payload;
      
      // Find index of item to remove
      const indexToRemove = state.items.findIndex((item) => {
        // Try strict equality first
        if (item.id === idToRemove) {
          return true;
        }
        // Fallback to string comparison
        return String(item.id) === String(idToRemove);
      });
      
      // If item found, remove it
      if (indexToRemove !== -1) {
        state.items.splice(indexToRemove, 1);
      }
    },
    clearComparison: (state) => {
      state.items = [];
    },
  },
});

export const { addToComparison, removeFromComparison, clearComparison } =
  comparisonSlice.actions;

export default comparisonSlice.reducer;

