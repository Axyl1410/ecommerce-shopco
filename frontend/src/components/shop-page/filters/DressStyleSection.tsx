"use client";

import React, { useState, useEffect } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useProductFilters } from "@/lib/hooks/useProducts";

type DressStyle = {
  title: string;
  slug: string;
};

const dressStylesData: DressStyle[] = [
  {
    title: "Casual",
    slug: "casual",
  },
  {
    title: "Formal",
    slug: "formal",
  },
  {
    title: "Party",
    slug: "party",
  },
  {
    title: "Gym",
    slug: "gym",
  },
];

const DressStyleSection = () => {
  const { filters, updateFilters } = useProductFilters();
  const [selectedStyles, setSelectedStyles] = useState<string[]>(
    filters.tags || []
  );

  // Sync with Redux state
  useEffect(() => {
    setSelectedStyles(filters.tags || []);
  }, [filters.tags]);

  const handleStyleToggle = (slug: string) => {
    const newSelected = selectedStyles.includes(slug)
      ? selectedStyles.filter((s) => s !== slug)
      : [...selectedStyles, slug];

    setSelectedStyles(newSelected);
    updateFilters({ tags: newSelected });
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-style">
      <AccordionItem value="filter-style" className="border-none">
        <AccordionTrigger className="p-0 py-0.5 text-xl font-bold text-black hover:no-underline">
          Dress Style
        </AccordionTrigger>
        <AccordionContent className="pb-0 pt-4">
          <div className="flex flex-col space-y-0.5 text-black/60">
            {dressStylesData.map((dStyle, idx) => (
              <button
                key={idx}
                onClick={() => handleStyleToggle(dStyle.slug)}
                className={`flex items-center justify-between py-2 text-left hover:text-black transition-colors ${selectedStyles.includes(dStyle.slug) ? "text-black font-medium" : ""
                  }`}
              >
                {dStyle.title} <MdKeyboardArrowRight />
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DressStyleSection;
