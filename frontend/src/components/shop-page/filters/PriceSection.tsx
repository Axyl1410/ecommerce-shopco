"use client";

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useProductFilters } from "@/lib/hooks/useProducts";

const PriceSection = () => {
  const { filters, updatePriceRange } = useProductFilters();
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 250,
  ]);

  // Sync local state with Redux when filters change externally
  useEffect(() => {
    setPriceRange([filters.minPrice || 0, filters.maxPrice || 250]);
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const handlePriceCommit = (values: number[]) => {
    updatePriceRange(values[0], values[1]);
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-price">
      <AccordionItem value="filter-price" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Price
        </AccordionTrigger>
        <AccordionContent className="pt-4" contentClassName="overflow-visible">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceCommit}
            min={0}
            max={250}
            step={1}
            label="$"
          />
          <div className="mb-3" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PriceSection;
