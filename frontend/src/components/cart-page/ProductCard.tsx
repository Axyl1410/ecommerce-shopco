"use client";

import { useUpdateCartItemQuantity } from "@/components/cart/CartSyncer";
import CartCounter from "@/components/ui/CartCounter";
import { type LocalCartItem } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { PiTrashFill } from "react-icons/pi";
import { Button } from "../ui/button";
import { formatCurrency, toCents, fromCents } from "@/lib/utils";
import slugify from "slugify"; // ✅ ADD

type ProductCardProps = {
  data: LocalCartItem;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const { mutate: updateQty } = useUpdateCartItemQuantity();

  // ✅ FIX: slug chuẩn (lowercase, không dấu)
  const productSlug = slugify(data.name, {
    lower: true,
    strict: true,
    locale: "vi",
  });

  const productHref = `/shop/product/${data.id}/${productSlug}`;

  return (
    <div className="flex items-start space-x-4">
      <Link
        href={productHref}
        className="aspect-square w-full min-w-[100px] max-w-[100px] overflow-hidden rounded-lg bg-[#F0EEED] sm:max-w-[124px]"
      >
        <Image
          src={data.srcUrl}
          width={124}
          height={124}
          className="h-full w-full rounded-md object-cover transition-all duration-500 hover:scale-110"
          alt={data.name}
          priority
        />
      </Link>

      <div className="flex w-full flex-col self-stretch">
        <div className="flex items-center justify-between">
          <Link
            href={productHref}
            className="text-base font-bold text-black xl:text-xl"
          >
            {data.name}
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 md:h-9 md:w-9"
            onClick={async () => {
              if (!data.cartItemId) return;
              try {
                await axios.delete(`/api/cart/items/${data.cartItemId}`);
              } catch {
                // ignore
              }
            }}
          >
            <PiTrashFill className="text-xl text-red-600 md:text-2xl" />
          </Button>
        </div>

        <div className="-mt-1">
          <span className="mr-1 text-xs text-black md:text-sm">Size:</span>
          <span className="text-xs text-black/60 md:text-sm">
            {data.attributes[0]}
          </span>
        </div>

        <div className="-mt-1.5 mb-auto">
          <span className="mr-1 text-xs text-black md:text-sm">Color:</span>
          <span className="text-xs text-black/60 md:text-sm">
            {data.attributes[1]}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-[5px] xl:space-x-2.5">
            {data.discount.percentage > 0 ? (
              <>
                {(() => {
                  const priceCents = toCents(data.price);
                  const discountCents = Math.round(
                    (priceCents * data.discount.percentage) / 100
                  );
                  const finalCents = priceCents - discountCents;
                  return (
                    <>
                      <span className="font-bold text-black text-xl xl:text-2xl">
                        {formatCurrency(fromCents(finalCents))}
                      </span>
                      <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
                        {formatCurrency(fromCents(priceCents))}
                      </span>
                    </>
                  );
                })()}
                <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                  {`-${data.discount.percentage}%`}
                </span>
              </>
            ) : data.discount.amount > 0 ? (
              <>
                {(() => {
                  const priceCents = toCents(data.price);
                  const discountCents = toCents(data.discount.amount);
                  const finalCents = priceCents - discountCents;
                  return (
                    <>
                      <span className="font-bold text-black text-xl xl:text-2xl">
                        {formatCurrency(fromCents(finalCents))}
                      </span>
                      <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
                        {formatCurrency(fromCents(priceCents))}
                      </span>
                    </>
                  );
                })()}
                <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                  {`-${formatCurrency(data.discount.amount)}`}
                </span>
              </>
            ) : (
              <span className="font-bold text-black text-xl xl:text-2xl">
                {formatCurrency(data.price)}
              </span>
            )}
          </div>

          <CartCounter
            initialValue={data.quantity}
            onAdd={() => {
              if (!data.cartItemId) return;
              updateQty({
                cartItemId: data.cartItemId,
                quantity: data.quantity + 1,
              });
            }}
            onRemove={() => {
              if (!data.cartItemId) return;
              if (data.quantity <= 1) {
                axios.delete(`/api/cart/items/${data.cartItemId}`).catch(() => {});
              } else {
                updateQty({
                  cartItemId: data.cartItemId,
                  quantity: data.quantity - 1,
                });
              }
            }}
            isZeroDelete
            className="max-h-8 min-w-[105px] max-w-[105px] px-5 py-3 sm:max-w-32 md:max-h-10"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
