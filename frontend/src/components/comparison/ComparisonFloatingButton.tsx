"use client";

import { useAppSelector } from "@/lib/hooks/redux";
import Link from "next/link";
import { Scale } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function ComparisonFloatingButton() {
  const comparisonItems = useAppSelector((state) => state.comparison.items);

  if (comparisonItems.length === 0) {
    return null;
  }

  return (
    <Link href="/compare">
      <Button
        className={cn(
          "fixed bottom-20 right-2 z-[60] rounded-full shadow-lg h-14 px-6 gap-2",
          "animate-in fade-in slide-in-from-bottom-4 duration-300",
          "sm:bottom-20 sm:right-3 md:bottom-20 md:right-4",
        )}
        size="lg"
      >
        <Scale className="h-5 w-5" />
        <span className="font-semibold">
          So sánh ({comparisonItems.length})
        </span>
      </Button>
    </Link>
  );
}

