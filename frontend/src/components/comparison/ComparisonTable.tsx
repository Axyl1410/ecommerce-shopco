"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { removeFromComparison, clearComparison } from "@/lib/features/comparison/comparisonSlice";
import { formatCurrency, toCents, fromCents } from "@/lib/utils";
import Rating from "../ui/Rating";
import { X, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function ComparisonTable() {
  const dispatch = useAppDispatch();
  const comparisonItems = useAppSelector((state) => state.comparison.items);

  if (comparisonItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-black/60 mb-4">
          Chưa có sản phẩm nào để so sánh
        </p>
        <Link href="/shop">
          <Button>Xem sản phẩm</Button>
        </Link>
      </div>
    );
  }

  const handleRemove = (e: React.MouseEvent, productId: number | string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Ensure we're passing the correct product ID
    dispatch(removeFromComparison(productId));
    toast.success("Đã xóa khỏi danh sách so sánh");
  };

  const handleClearAll = () => {
    dispatch(clearComparison());
    toast.success("Đã xóa tất cả");
  };

  // Calculate comparison attributes
  const getPrice = (product: typeof comparisonItems[0]) => {
    if (product.discount.percentage > 0) {
      const priceCents = toCents(product.price);
      const discountCents = Math.round(
        (priceCents * product.discount.percentage) / 100,
      );
      return fromCents(priceCents - discountCents);
    }
    if (product.discount.amount > 0) {
      return product.price - product.discount.amount;
    }
    return product.price;
  };

  // Get product specification value
  const getSpecValue = (product: typeof comparisonItems[0], key: string): string => {
    if (product.specifications) {
      const value = product.specifications[key as keyof typeof product.specifications];
      return value || "—";
    }
    return "—";
  };

  // Define specification rows to display
  const specificationRows = [
    { key: "material", label: "Chất liệu" },
    { key: "care", label: "Hướng dẫn bảo quản" },
    { key: "fit", label: "Kiểu dáng" },
    { key: "pattern", label: "Họa tiết" },
    { key: "color", label: "Màu sắc" },
    { key: "size", label: "Kích thước" },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          So sánh sản phẩm ({comparisonItems.length})
        </h2>
        {comparisonItems.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Xóa tất cả
          </Button>
        )}
      </div>

      <div className="border border-black/10 rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black/5">
              <th className="p-4 text-left font-semibold">Đặc điểm</th>
              {comparisonItems.map((product) => (
                <th
                  key={product.id}
                  className="p-4 text-center font-semibold min-w-[200px] relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(e, product.id);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full hover:bg-black/10 active:bg-black/20 transition-colors bg-white shadow-sm"
                    aria-label={`Xóa sản phẩm ${product.title}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Product Image */}
            <tr className="border-t border-black/10">
              <td className="p-4 font-medium">Hình ảnh</td>
              {comparisonItems.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <Link
                    href={`/shop/product/${product.id}/${product.title.split(" ").join("-")}`}
                    className="block"
                  >
                    <div className="bg-[#F0EEED] rounded-lg aspect-square overflow-hidden mb-2">
                      <Image
                        src={product.srcUrl}
                        alt={product.title}
                        width={200}
                        height={200}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </Link>
                </td>
              ))}
            </tr>

            {/* Product Name */}
            <tr className="border-t border-black/10 bg-black/5">
              <td className="p-4 font-medium">Tên sản phẩm</td>
              {comparisonItems.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <Link
                    href={`/shop/product/${product.id}/${product.title.split(" ").join("-")}`}
                    className="font-semibold hover:underline"
                  >
                    {product.title}
                  </Link>
                </td>
              ))}
            </tr>

            {/* Price */}
            <tr className="border-t border-black/10">
              <td className="p-4 font-medium">Giá</td>
              {comparisonItems.map((product) => {
                const finalPrice = getPrice(product);
                return (
                  <td key={product.id} className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-bold text-xl">
                        {formatCurrency(finalPrice)}
                      </span>
                      {(product.discount.percentage > 0 ||
                        product.discount.amount > 0) && (
                        <span className="text-sm text-black/40 line-through">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                      {(product.discount.percentage > 0 ||
                        product.discount.amount > 0) && (
                        <span className="text-xs py-1 px-2 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                          {product.discount.percentage > 0
                            ? `-${product.discount.percentage}%`
                            : `-${formatCurrency(product.discount.amount)}`}
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Rating */}
            <tr className="border-t border-black/10 bg-black/5">
              <td className="p-4 font-medium">Đánh giá</td>
              {comparisonItems.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Rating
                      initialValue={product.rating}
                      allowFraction
                      SVGclassName="inline-block"
                      emptyClassName="fill-gray-50"
                      size={20}
                      readonly
                    />
                    <span className="text-sm">
                      {product.rating.toFixed(1)}/5
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Product Specifications */}
            {specificationRows.map((spec) => {
              // Check if at least one product has this specification
              const hasSpec = comparisonItems.some(
                (product) => product.specifications?.[spec.key as keyof typeof product.specifications],
              );

              // Only render row if at least one product has this spec
              if (!hasSpec) return null;

              return (
                <tr key={spec.key} className="border-t border-black/10">
                  <td className="p-4 font-medium">{spec.label}</td>
                  {comparisonItems.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <span className="text-sm text-black/80">
                        {getSpecValue(product, spec.key)}
                      </span>
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Actions */}
            <tr className="border-t border-black/10">
              <td className="p-4 font-medium">Thao tác</td>
              {comparisonItems.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <Link
                    href={`/shop/product/${product.id}/${product.title.split(" ").join("-")}`}
                  >
                    <Button className="w-full">Xem chi tiết</Button>
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

