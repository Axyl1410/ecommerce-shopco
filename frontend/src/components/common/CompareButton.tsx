"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { addToComparison, removeFromComparison } from "@/lib/features/comparison/comparisonSlice";
import type { Product } from "@/types/product.types";
import { toast } from "sonner";
import { useState } from "react";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

type CompareButtonProps = {
  product: Product;
  className?: string;
  variant?: "icon" | "text" | "both";
};

const MAX_COMPARISON_ITEMS = 4;

export default function CompareButton({
  product,
  className,
  variant = "both",
}: CompareButtonProps) {
  const dispatch = useAppDispatch();
  const comparisonItems = useAppSelector((state) => state.comparison.items);
  const [isAnimating, setIsAnimating] = useState(false);

  const isInComparison = comparisonItems.some((item) => item.id === product.id);
  const canAddMore = comparisonItems.length < MAX_COMPARISON_ITEMS;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInComparison) {
      dispatch(removeFromComparison(product.id));
      toast.success("Đã xóa khỏi danh sách so sánh");
    } else {
      if (!canAddMore) {
        toast.error(`Chỉ có thể so sánh tối đa ${MAX_COMPARISON_ITEMS} sản phẩm`);
        return;
      }
      dispatch(addToComparison(product));
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
      toast.success("Đã thêm vào danh sách so sánh");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium transition-all hover:bg-black/5 active:scale-95",
        variant === "icon" && "p-2 rounded-full",
        isInComparison && "bg-black text-white hover:bg-black/90 border-black",
        className,
      )}
      aria-label={
        isInComparison ? "Xóa khỏi so sánh" : "Thêm vào so sánh"
      }
      title={
        isInComparison ? "Xóa khỏi so sánh" : "Thêm vào so sánh"
      }
    >
      <Scale
        className={cn(
          "h-4 w-4 transition-transform",
          isAnimating && "scale-125",
        )}
      />
      {variant !== "icon" && (
        <span>{isInComparison ? "Đã thêm" : "So sánh"}</span>
      )}
    </button>
  );
}

