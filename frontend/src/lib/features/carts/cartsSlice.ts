import { compareArrays } from "@/lib/utils";
import type { Cart as ServerCart } from "@/types/cart";
import type { Discount } from "@/types/product.types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const calcAdjustedTotalPrice = (
  totalPrice: number,
  data: LocalCartItem,
  quantity?: number,
): number => {
  return (
    (totalPrice + data.discount.percentage > 0
      ? Math.round(data.price - (data.price * data.discount.percentage) / 100)
      : data.discount.amount > 0
        ? Math.round(data.price - data.discount.amount)
        : data.price) * (quantity ? quantity : data.quantity)
  );
};

export type RemoveCartItem = {
  id: number | string;
  attributes: string[];
};

// Local cart item for client-side cart management
export type LocalCartItem = {
  id: number | string;
  name: string;
  srcUrl: string;
  price: number;
  attributes: string[];
  discount: Discount;
  quantity: number;
};

export type LocalCart = {
  items: LocalCartItem[];
  totalQuantities: number;
};

// Define a type for the slice state
interface CartsState {
  cart: LocalCart | null;
  totalPrice: number;
  adjustedTotalPrice: number;
  action: "update" | "add" | "delete" | null;
  // Server cart from API using new types
  serverCart: ServerCart | null;
}

// Define the initial state using that type
const initialState: CartsState = {
  cart: null,
  totalPrice: 0,
  adjustedTotalPrice: 0,
  action: null,
  serverCart: null,
};

export const cartsSlice = createSlice({
  name: "carts",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<LocalCartItem>) => {
      // if cart is empty then add
      if (state.cart === null) {
        state.cart = {
          items: [action.payload],
          totalQuantities: action.payload.quantity,
        };
        state.totalPrice =
          state.totalPrice + action.payload.price * action.payload.quantity;
        state.adjustedTotalPrice =
          state.adjustedTotalPrice +
          calcAdjustedTotalPrice(state.totalPrice, action.payload);
        return;
      }

      // check item in cart
      const isItemInCart = state.cart.items.find(
        (item) =>
          action.payload.id === item.id &&
          compareArrays(action.payload.attributes, item.attributes),
      );

      if (isItemInCart) {
        state.cart = {
          ...state.cart,
          items: state.cart.items.map((eachCartItem) => {
            if (
              eachCartItem.id === action.payload.id
                ? !compareArrays(
                    eachCartItem.attributes,
                    isItemInCart.attributes,
                  )
                : eachCartItem.id !== action.payload.id
            )
              return eachCartItem;

            return {
              ...isItemInCart,
              quantity: action.payload.quantity + isItemInCart.quantity,
            };
          }),
          totalQuantities: state.cart.totalQuantities + action.payload.quantity,
        };
        state.totalPrice =
          state.totalPrice + action.payload.price * action.payload.quantity;
        state.adjustedTotalPrice =
          state.adjustedTotalPrice +
          calcAdjustedTotalPrice(state.totalPrice, action.payload);
        return;
      }

      state.cart = {
        ...state.cart,
        items: [...state.cart.items, action.payload],
        totalQuantities: state.cart.totalQuantities + action.payload.quantity,
      };
      state.totalPrice =
        state.totalPrice + action.payload.price * action.payload.quantity;
      state.adjustedTotalPrice =
        state.adjustedTotalPrice +
        calcAdjustedTotalPrice(state.totalPrice, action.payload);
    },
    removeCartItem: (state, action: PayloadAction<RemoveCartItem>) => {
      if (state.cart === null) return;

      // check item in cart
      const isItemInCart = state.cart.items.find(
        (item) =>
          action.payload.id === item.id &&
          compareArrays(action.payload.attributes, item.attributes),
      );

      if (isItemInCart) {
        state.cart = {
          ...state.cart,
          items: state.cart.items
            .map((eachCartItem) => {
              if (
                eachCartItem.id === action.payload.id
                  ? !compareArrays(
                      eachCartItem.attributes,
                      isItemInCart.attributes,
                    )
                  : eachCartItem.id !== action.payload.id
              )
                return eachCartItem;

              return {
                ...isItemInCart,
                quantity: eachCartItem.quantity - 1,
              };
            })
            .filter((item) => item.quantity > 0),
          totalQuantities: state.cart.totalQuantities - 1,
        };

        state.totalPrice = state.totalPrice - isItemInCart.price * 1;
        state.adjustedTotalPrice =
          state.adjustedTotalPrice -
          calcAdjustedTotalPrice(isItemInCart.price, isItemInCart, 1);
      }
    },
    remove: (
      state,
      action: PayloadAction<RemoveCartItem & { quantity: number }>,
    ) => {
      if (!state.cart) return;

      // check item in cart
      const isItemInCart = state.cart.items.find(
        (item) =>
          action.payload.id === item.id &&
          compareArrays(action.payload.attributes, item.attributes),
      );

      if (!isItemInCart) return;

      state.cart = {
        ...state.cart,
        items: state.cart.items.filter((pItem) => {
          return pItem.id === action.payload.id
            ? !compareArrays(pItem.attributes, isItemInCart.attributes)
            : pItem.id !== action.payload.id;
        }),
        totalQuantities: state.cart.totalQuantities - isItemInCart.quantity,
      };
      state.totalPrice =
        state.totalPrice - isItemInCart.price * isItemInCart.quantity;
      state.adjustedTotalPrice =
        state.adjustedTotalPrice -
        calcAdjustedTotalPrice(
          isItemInCart.price,
          isItemInCart,
          isItemInCart.quantity,
        );
    },
    // New: set server cart from API response using new types
    setServerCart: (state, action: PayloadAction<ServerCart>) => {
      state.serverCart = action.payload;
    },
    // Map server cart to local cart so existing UI renders server data
    hydrateLocalFromServer: (state, action: PayloadAction<ServerCart>) => {
      const server = action.payload;
      const localItems: LocalCartItem[] = server.items.map((it) => {
        let attrs: string[] = [];
        try {
          const parsed = it.attributes
            ? (JSON.parse(it.attributes) as Record<string, unknown>)
            : {};
          attrs = Object.values(parsed).map((v) => String(v));
        } catch {
          attrs = [];
        }
        return {
          id: it.variantId || it.id,
          name: it.productName,
          srcUrl: it.imageUrl ?? "",
          price: Number(it.priceAtAdd),
          attributes: attrs,
          discount: { amount: 0, percentage: 0 },
          quantity: it.quantity,
        };
      });

      const totalQuantities = localItems.reduce(
        (sum, i) => sum + i.quantity,
        0,
      );
      const totalPrice = localItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
      const adjusted = localItems.reduce(
        (sum, i) => sum + calcAdjustedTotalPrice(0, i, i.quantity),
        0,
      );

      state.cart = {
        items: localItems,
        totalQuantities,
      };
      state.totalPrice = totalPrice;
      state.adjustedTotalPrice = adjusted;
      state.action = "update";
    },
  },
});

export const {
  addToCart,
  removeCartItem,
  remove,
  setServerCart,
  hydrateLocalFromServer,
} = cartsSlice.actions;

export default cartsSlice.reducer;
