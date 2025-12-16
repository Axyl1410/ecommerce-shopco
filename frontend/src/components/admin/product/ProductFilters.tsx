"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductStatus } from "@/types/admin/product.types";
import { Search } from "lucide-react";

interface ProductFiltersProps {
  onFilterChange: (filters: {
    keyword?: string;
    status?: ProductStatus;
    brandId?: string;
    categoryId?: string;
  }) => void;
}

export function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<ProductStatus | "ALL">("ALL");

  const handleSearch = () => {
    onFilterChange({
      keyword: keyword || undefined,
      status: status === "ALL" ? undefined : status,
    });
  };

  const handleReset = () => {
    setKeyword("");
    setStatus("ALL");
    onFilterChange({});
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      <Select
        value={status}
        onValueChange={(value) => setStatus(value as ProductStatus | "ALL")}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tất cả</SelectItem>
          <SelectItem value={ProductStatus.DRAFT}>Draft</SelectItem>
          <SelectItem value={ProductStatus.PUBLISHED}>Published</SelectItem>
          <SelectItem value={ProductStatus.ARCHIVED}>Archived</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleSearch} className="gap-2">
        <Search className="h-4 w-4" />
        Tìm kiếm
      </Button>

      <Button variant="outline" onClick={handleReset}>
        Đặt lại
      </Button>
    </div>
  );
}
