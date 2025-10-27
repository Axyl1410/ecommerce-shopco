"use client";

import React from "react";
import CategoriesSection from "@/components/shop-page/filters/CategoriesSection";
import ColorsSection from "@/components/shop-page/filters/ColorsSection";
import DressStyleSection from "@/components/shop-page/filters/DressStyleSection";
import PriceSection from "@/components/shop-page/filters/PriceSection";
import SizeSection from "@/components/shop-page/filters/SizeSection";
import { Button } from "@/components/ui/button";
import { useProductFilters } from "@/lib/hooks/useProducts";

const Filters = () => {
  const { clearFilters } = useProductFilters();

  return (
    <>
      <hr className="border-t-black/10" />
      <CategoriesSection />
      <hr className="border-t-black/10" />
      <PriceSection />
      <hr className="border-t-black/10" />
      <ColorsSection />
      <hr className="border-t-black/10" />
      <SizeSection />
      <hr className="border-t-black/10" />
      <DressStyleSection />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full text-sm font-medium py-4 h-12"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </>
  );
};

export default Filters;
