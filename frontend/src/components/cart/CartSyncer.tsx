"use client";

import {
  hydrateLocalFromServer,
  setServerCart,
} from "@/lib/features/carts/cartsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { GetCartResponse } from "@/types/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function CartSyncer() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const localCart = useAppSelector((s) => s.carts.cart);

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axios.get<{ user?: { id?: string } }>(
        `/api/profile`,
      );
      return data;
    },
    staleTime: 60_000,
    retry: 1,
  });

  useQuery({
    queryKey: ["cart", profileQuery.data?.user?.id],
    enabled: Boolean(profileQuery.data?.user?.id),
    queryFn: async () => {
      const { data } = await axios.get<GetCartResponse>(`/api/cart`);
      return data; // matches API envelope
    },
    onSuccess: (json) => {
      if (json?.data) {
        dispatch(setServerCart(json.data));
        dispatch(hydrateLocalFromServer(json.data));

        // Merge local cart into server cart once after login
        // Strategy: if server cart is empty but local cart has items, push them
        if (
          localCart?.items?.length &&
          (json.data.totalItems === 0 || json.data.items.length === 0)
        ) {
          const userId = profileQuery.data?.user?.id;
          const itemsToAdd = localCart.items.map((it) => ({
            variantId: String(it.id),
            quantity: it.quantity,
          }));

          // Fire-and-forget adds sequentially to keep order minimal; backend sums quantities
          (async () => {
            try {
              for (const item of itemsToAdd) {
                await axios.post(`/api/cart`, {
                  userId,
                  variantId: item.variantId,
                  quantity: item.quantity,
                });
              }
              // Refetch cart after merge
              queryClient.invalidateQueries({ queryKey: ["cart", userId] });
            } catch {
              // Swallow errors; UI can still show server cart
            }
          })();
        }
      }
    },
    staleTime: 60_000,
    retry: 1,
  });

  return null;
}

// Export hook for updating cart item quantity
export function useUpdateCartItemQuantity() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cartItemId,
      quantity,
    }: {
      cartItemId: string;
      quantity: number;
    }) => {
      const { data } = await axios.put<GetCartResponse>(
        `/api/cart/items/${cartItemId}`,
        { quantity },
      );
      return data;
    },
    onSuccess: (json) => {
      if (json?.data) {
        dispatch(setServerCart(json.data));
        dispatch(hydrateLocalFromServer(json.data));
      }
      // Invalidate cart query to refetch
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
