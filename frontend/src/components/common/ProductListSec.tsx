import * as motion from "framer-motion/client";
import Link from "next/link";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import type { Product } from "@/types/product.types";
import ProductCard from "./ProductCard";

type ProductListSecProps = {
  title: string;
  data: Product[];
  viewAllLink?: string;
};

const ProductListSec = ({ title, data, viewAllLink }: ProductListSecProps) => {
  return (
    <section className="mx-auto max-w-frame text-center">
      <motion.h2
        initial={{ y: "100px", opacity: 0 }}
        whileInView={{ y: "0", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={cn([
          integralCF.className,
          "mb-8 text-[32px] capitalize md:mb-14 md:text-5xl",
        ])}
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ y: "100px", opacity: 0 }}
        whileInView={{ y: "0", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Carousel
          opts={{
            align: "start",
          }}
          className="mb-6 w-full md:mb-9"
        >
          <CarouselContent className="mx-4 space-x-4 sm:space-x-5 xl:mx-0">
            {data.map((product) => (
              <CarouselItem
                key={product.id}
                className="w-full max-w-[198px] pl-0 sm:max-w-[295px]"
              >
                <ProductCard data={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {viewAllLink && (
          <div className="w-full px-4 text-center sm:px-0">
            <Link
              href={viewAllLink as any}
              className="inline-block w-full rounded-full border border-black/10 px-[54px] py-4 text-sm font-medium text-black transition-all hover:bg-black hover:text-white sm:w-[218px] sm:text-base"
            >
              View All
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ProductListSec;
