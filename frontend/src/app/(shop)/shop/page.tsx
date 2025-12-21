"use client";

import { useEffect, useState } from "react";
import { FiSliders } from "react-icons/fi";
import ProductCard from "@/components/common/ProductCard";
import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import Filters from "@/components/shop-page/filters";
import MobileFilters from "@/components/shop-page/filters/MobileFilters";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/lib/hooks/useProducts";
import { productService } from "@/services/product.service";
import type { ProductDetail, PaginationMeta } from "@/types/product.types";

export default function ShopPage() {
  const { filters, sort, pagination, updateSort, goToPage, nextPage, prevPage } =
    useProducts();

  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 12,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products whenever filters, sort, or pagination changes
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await productService.getProducts(
          filters,
          sort,
          pagination
        );
        setProducts(response.products);
        setPaginationMeta(response.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters, sort, pagination]);

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as [any, "asc" | "desc"];
    updateSort({ sortBy, sortOrder });
  };

  const renderPaginationItems = () => {
    const { page, totalPages } = paginationMeta;
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            goToPage(1);
          }}
          className="text-black/50 font-medium text-sm"
          isActive={page === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (page > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis className="text-black/50 font-medium text-sm" />
        </PaginationItem>
      );
    }

    // Show current page and neighbors
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToPage(i);
            }}
            className="text-black/50 font-medium text-sm"
            isActive={page === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (page < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis className="text-black/50 font-medium text-sm" />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToPage(totalPages);
            }}
            className="text-black/50 font-medium text-sm"
            isActive={page === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />
        <div className="flex md:space-x-5 items-start">
          <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filters</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <Filters />
          </div>
          <div className="flex flex-col w-full space-y-5">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl md:text-[32px]">
                  {filters.category
                    ? filters.category.charAt(0).toUpperCase() +
                    filters.category.slice(1)
                    : "All Products"}
                </h1>
                <MobileFilters />
              </div>
              <div className="flex flex-col sm:items-center sm:flex-row">
                <span className="text-sm md:text-base text-black/60 mr-3">
                  Showing {paginationMeta.totalCount > 0 ? (paginationMeta.page - 1) * paginationMeta.limit + 1 : 0}-
                  {Math.min(paginationMeta.page * paginationMeta.limit, paginationMeta.totalCount)} of{" "}
                  {paginationMeta.totalCount} Products
                </span>
                <div className="flex items-center">
                  Sort by:{" "}
                  <Select
                    value={`${sort.sortBy}-${sort.sortOrder}`}
                    onValueChange={handleSortChange}
                  >
                    <SelectTrigger className="font-medium text-sm px-1.5 sm:text-base w-fit text-black bg-transparent shadow-none border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt-desc">Newest</SelectItem>
                      <SelectItem value="popularity-desc">Most Popular</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="rating-desc">Highest Rated</SelectItem>
                      <SelectItem value="name-asc">Name: A to Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="w-full text-center py-20">
                <p className="text-black/60">Loading products...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="w-full text-center py-20">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && !error && (
              <>
                {products.length > 0 ? (
                  <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        data={{
                          id: product.id,
                          title: product.name,
                          srcUrl: product.image,
                          price: product.price,
                          discount: {
                            amount: product.originalPrice - product.price,
                            percentage: product.discount,
                          },
                          rating: product.rating,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full text-center py-20">
                    <p className="text-black/60">No products found matching your criteria.</p>
                  </div>
                )}

                {/* Pagination */}
                {paginationMeta.totalPages > 1 && (
                  <>
                    <hr className="border-t-black/10" />
                    <Pagination className="justify-between">
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (paginationMeta.hasPrevPage) prevPage();
                        }}
                        className={`border border-black/10 ${!paginationMeta.hasPrevPage ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                      />
                      <PaginationContent>{renderPaginationItems()}</PaginationContent>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (paginationMeta.hasNextPage) nextPage();
                        }}
                        className={`border border-black/10 ${!paginationMeta.hasNextPage ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                      />
                    </Pagination>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
