"use client";

import {
  hydrateLocalFromServer,
  setServerCart,
} from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { GetCartResponse } from "@/types/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function CartSyncer() {
  const dispatch = useAppDispatch();

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
