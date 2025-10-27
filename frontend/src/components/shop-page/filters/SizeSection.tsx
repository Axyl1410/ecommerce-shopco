"use client";

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useProductFilters } from "@/lib/hooks/useProducts";

const sizeOptions = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "3X-Large",
  "4X-Large",
];

const SizeSection = () => {
  const { filters, updateSizes } = useProductFilters();
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    filters.sizes || []
  );

  // Sync with Redux state
  useEffect(() => {
    setSelectedSizes(filters.sizes || []);
  }, [filters.sizes]);

  const handleSizeToggle = (size: string) => {
    const newSelected = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];

    setSelectedSizes(newSelected);
    updateSizes(newSelected);
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-size">
      <AccordionItem value="filter-size" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Size
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex items-center flex-wrap">
            {sizeOptions.map((size, index) => (
              <button
                key={index}
                type="button"
                className={cn([
                  "bg-[#F0F0F0] m-1 flex items-center justify-center px-5 py-2.5 text-sm rounded-full max-h-[39px]",
                  selectedSizes.includes(size) && "bg-black font-medium text-white",
                ])}
                onClick={() => handleSizeToggle(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SizeSection;
