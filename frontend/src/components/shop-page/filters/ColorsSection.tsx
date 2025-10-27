"use client";

import React, { useState, useEffect } from "react";
import { IoMdCheckmark } from "react-icons/io";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useProductFilters } from "@/lib/hooks/useProducts";

const colorOptions = [
  { name: "Green", value: "green", class: "bg-green-600" },
  { name: "Red", value: "red", class: "bg-red-600" },
  { name: "Yellow", value: "yellow", class: "bg-yellow-300" },
  { name: "Orange", value: "orange", class: "bg-orange-600" },
  { name: "Cyan", value: "cyan", class: "bg-cyan-400" },
  { name: "Blue", value: "blue", class: "bg-blue-600" },
  { name: "Purple", value: "purple", class: "bg-purple-600" },
  { name: "Pink", value: "pink", class: "bg-pink-600" },
  { name: "White", value: "white", class: "bg-white" },
  { name: "Black", value: "black", class: "bg-black" },
];

const ColorsSection = () => {
  const { filters, updateColors } = useProductFilters();
  const [selectedColors, setSelectedColors] = useState<string[]>(
    filters.colors || []
  );

  // Sync with Redux state
  useEffect(() => {
    setSelectedColors(filters.colors || []);
  }, [filters.colors]);

  const handleColorToggle = (colorValue: string) => {
    const newSelected = selectedColors.includes(colorValue)
      ? selectedColors.filter((c) => c !== colorValue)
      : [...selectedColors, colorValue];

    setSelectedColors(newSelected);
    updateColors(newSelected);
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-colors">
      <AccordionItem value="filter-colors" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Colors
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex space-2.5 flex-wrap md:grid grid-cols-5 gap-2.5">
            {colorOptions.map((color, index) => (
              <button
                key={index}
                type="button"
                className={cn([
                  color.class,
                  "rounded-full w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center border border-black/20",
                ])}
                onClick={() => handleColorToggle(color.value)}
                title={color.name}
              >
                {selectedColors.includes(color.value) && (
                  <IoMdCheckmark className="text-base text-white" />
                )}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ColorsSection;
