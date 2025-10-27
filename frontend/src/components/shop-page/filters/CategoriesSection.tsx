"use client";

import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useProductFilters } from "@/lib/hooks/useProducts";

type Category = {
  title: string;
  slug: string;
};

const categoriesData: Category[] = [
  {
    title: "T-shirts",
    slug: "t-shirts",
  },
  {
    title: "Shorts",
    slug: "shorts",
  },
  {
    title: "Shirts",
    slug: "shirts",
  },
  {
    title: "Hoodie",
    slug: "hoodie",
  },
  {
    title: "Jeans",
    slug: "jeans",
  },
];

const CategoriesSection = () => {
  const { filters, updateCategory } = useProductFilters();

  const handleCategoryClick = (slug: string) => {
    updateCategory(filters.category === slug ? undefined : slug);
  };

  return (
    <div className="flex flex-col space-y-0.5 text-black/60">
      {categoriesData.map((category, idx) => (
        <button
          key={idx}
          onClick={() => handleCategoryClick(category.slug)}
          className={`flex items-center justify-between py-2 text-left hover:text-black transition-colors ${filters.category === category.slug ? "text-black font-medium" : ""
            }`}
        >
          {category.title} <MdKeyboardArrowRight />
        </button>
      ))}
    </div>
  );
};

export default CategoriesSection;
