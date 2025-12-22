"use client";

import BreadcrumbCart from "@/components/cart-page/BreadcrumbCart";
import PaymentMethodSelector from "@/components/cart-page/PaymentMethodSelector";
import ProductCard from "@/components/cart-page/ProductCard";
import { Button } from "@/components/ui/button";
import InputGroup from "@/components/ui/input-group";
import { useAppSelector } from "@/lib/hooks/redux";
import type { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineLocalOffer } from "react-icons/md";
import { TbBasketExclamation } from "react-icons/tb";

type PaymentMethod = "BANK_TRANSFER" | "NAPAS_BANK_TRANSFER";

export default function CartPage() {
  const { cart, totalPrice, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts,
  );

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("BANK_TRANSFER");
  const [checkoutURL, setCheckoutURL] = useState("");
  const [checkoutFormfields, setCheckoutFormfields] = useState<
    Record<string, string>
  >({});
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  useEffect(() => {
    if (cart && cart.items.length > 0 && adjustedTotalPrice > 0) {
      setIsLoadingCheckout(true);
      fetch("/api/sepay/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation: "PURCHASE",
          payment_method: paymentMethod,
          order_invoice_number: `ORDER-${Date.now()}`,
          order_amount: Math.round(adjustedTotalPrice * 22000),
          currency: "VND",
          order_description: `Order ${cart.totalQuantities ?? 0} items`,
          success_url: `${window.location.origin}/shop?payment=success`,
          error_url: `${window.location.origin}/cart?payment=error`,
          cancel_url: `${window.location.origin}/cart?payment=cancel`,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to initialize checkout");
          return res.json();
        })
        .then((data) => {
          setCheckoutURL(data.checkoutURL);
          setCheckoutFormfields(data.checkoutFormfields);
        })
        .catch((error) => {
          console.error("Checkout initialization error:", error);
        })
        .finally(() => {
          setIsLoadingCheckout(false);
        });
    }
  }, [cart, adjustedTotalPrice, paymentMethod]);

  return (
    <main className="pb-20">
      <div className="mx-auto max-w-frame px-4 xl:px-0">
        {cart && cart.items.length > 0 ? (
          <>
            <BreadcrumbCart />
            <h2
              className={cn([
                integralCF.className,
                "mb-5 text-[32px] font-bold uppercase text-black md:mb-6 md:text-[40px]",
              ])}
            >
              your cart
            </h2>
            <div className="flex flex-col items-start space-y-5 lg:flex-row lg:space-x-5 lg:space-y-0">
              <div className="w-full flex-col space-y-4 rounded-[20px] border border-black/10 p-3.5 md:space-y-6 md:px-6">
                {cart?.items.map((product, idx, arr) => (
                  <React.Fragment key={idx}>
                    <ProductCard data={product} />
                    {arr.length - 1 !== idx && (
                      <hr className="border-t-black/10" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="w-full flex-col space-y-4 rounded-[20px] border border-black/10 p-5 md:space-y-6 md:px-6 lg:max-w-[505px]">
                <h6 className="text-xl font-bold text-black md:text-2xl">
                  Order Summary
                </h6>
                <div className="flex flex-col space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-black/60 md:text-xl">Subtotal</span>
                    <span className="font-bold md:text-xl">${totalPrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60 md:text-xl">
                      Discount (-
                      {Math.round(
                        ((totalPrice - adjustedTotalPrice) / totalPrice) * 100,
                      )}
                      %)
                    </span>
                    <span className="font-bold text-red-600 md:text-xl">
                      -${Math.round(totalPrice - adjustedTotalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60 md:text-xl">
                      Delivery Fee
                    </span>
                    <span className="font-bold md:text-xl">Free</span>
                  </div>
                  <hr className="border-t-black/10" />
                  <div className="flex items-center justify-between">
                    <span className="text-black md:text-xl">Total</span>
                    <span className="text-xl font-bold md:text-2xl">
                      ${Math.round(adjustedTotalPrice)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <InputGroup className="bg-[#F0F0F0]">
                    <InputGroup.Text>
                      <MdOutlineLocalOffer className="text-2xl text-black/40" />
                    </InputGroup.Text>
                    <InputGroup.Input
                      type="text"
                      name="code"
                      placeholder="Add promo code"
                      className="bg-transparent placeholder:text-black/40"
                    />
                  </InputGroup>
                  <Button
                    type="button"
                    className="h-[48px] w-full max-w-[119px] rounded-full bg-black"
                  >
                    Apply
                  </Button>
                </div>
                {/* <PaymentMethodSelector
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                /> */}
                <form action={checkoutURL} method="POST">
                  {Object.keys(checkoutFormfields).map((field) => (
                    <input
                      key={field}
                      type="hidden"
                      name={field}
                      value={checkoutFormfields[field]}
                    />
                  ))}
                  <Button
                    type="submit"
                    disabled={isLoadingCheckout || !checkoutURL}
                    className="group h-[54px] w-full rounded-full bg-black py-4 text-sm font-medium disabled:opacity-50 md:h-[60px] md:text-base"
                  >
                    {isLoadingCheckout ? "Loading..." : "Go to Checkout"}{" "}
                    {!isLoadingCheckout && (
                      <FaArrowRight className="ml-2 text-xl transition-all group-hover:translate-x-1" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-32 flex flex-col items-center text-gray-300">
            <TbBasketExclamation strokeWidth={1} className="text-6xl" />
            <span className="mb-4 block">Your shopping cart is empty.</span>
            <Button className="w-24 rounded-full" asChild>
              <Link href="/shop">Shop</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
