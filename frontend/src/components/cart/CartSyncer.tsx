"use client";

import {
  hydrateLocalFromServer,
  setServerCart,
} from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { useQuery } from "@tanstack/react-query";

export default function CartSyncer() {
  const dispatch = useAppDispatch();

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(`/api/profile`, { cache: "no-store" });
      if (!res.ok) throw new Error("failed-profile");
      return res.json() as Promise<{ user?: { id?: string } }>;
    },
    staleTime: 60_000,
    retry: 1,
  });

  useQuery({
    queryKey: ["cart", profileQuery.data?.user?.id],
    enabled: Boolean(profileQuery.data?.user?.id),
    queryFn: async () => {
      const userId = profileQuery.data?.user?.id as string;
      const res = await fetch(
        `/api/cart?userId=${encodeURIComponent(userId)}`,
        {
          cache: "no-store",
        },
      );
      if (!res.ok) throw new Error("failed-cart");
      return res.json() as Promise<{ result: string; data?: unknown }>; // matches API envelope
    },
    onSuccess: (json) => {
      if (json?.data) {
        // @ts-expect-error server shape validated elsewhere
        dispatch(setServerCart(json.data));
        // @ts-expect-error server shape validated elsewhere
        dispatch(hydrateLocalFromServer(json.data));
      }
    },
    staleTime: 30_000,
    retry: 1,
  });

  return null;
}
