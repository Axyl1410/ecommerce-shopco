"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { searchService } from "@/services/search.service";
import ProductCard from "@/components/common/ProductCard";
import { Product } from "@/types/product.types";
import SpinnerLoader from "@/components/ui/SpinnerLoader";

type SearchResult = {
    id: string;
    name: string;
    slug: string;
    description: string;
    defaultImage: string;
    minPrice: number;
    maxPrice: number;
    categoryName?: string;
    brandName?: string;
    tags: string[];
};

type SearchResponse = {
    products: SearchResult[];
    pagination: {
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
};

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
    });

    useEffect(() => {
        if (!query) return;

        const fetchResults = async () => {
            setLoading(true);
            setError(null);

            try {
                const data: SearchResponse = await searchService.searchProducts(
                    query,
                    pagination.page,
                    pagination.limit
                );

                setResults(data.products);
                setPagination(data.pagination);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Search failed");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, pagination.page]);

    const handlePageChange = (newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Convert SearchResult to Product type for ProductCard
    const convertToProduct = (result: SearchResult): Product => {
        // Calculate discount if maxPrice > minPrice (means there's a sale)
        const hasDiscount = result.maxPrice > result.minPrice;
        const discountAmount = hasDiscount ? result.maxPrice - result.minPrice : 0;
        const discountPercentage = hasDiscount
            ? Math.round((discountAmount / result.maxPrice) * 100)
            : 0;

        return {
            id: Number(result.id),
            title: result.name,
            srcUrl: result.defaultImage || "/images/placeholder.png",
            price: Number(result.maxPrice), // Original price
            discount: {
                amount: discountAmount,
                percentage: discountPercentage,
            },
            rating: 0,
        };
    };

    return (
        <div className="max-w-frame mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">
                    Search Results for "{query}"
                </h1>
                {!loading && (
                    <p className="text-gray-600">
                        Found {pagination.totalCount} {pagination.totalCount === 1 ? "product" : "products"}
                    </p>
                )}
            </div>

            {loading && (
                <div className="flex justify-center items-center min-h-[400px]">
                    <SpinnerLoader className="w-10 h-10 border-2 border-gray-300 border-t-gray-600" />
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {!loading && !error && results.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600 mb-4">No products found</p>
                    <p className="text-gray-500">Try searching with different keywords</p>
                </div>
            )}

            {!loading && !error && results.length > 0 && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                        {results.map((result) => (
                            <ProductCard key={result.id} data={convertToProduct(result)} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={!pagination.hasPrevPage}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>

                            <div className="flex gap-2">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                    .filter((page) => {
                                        // Show current page, first, last, and neighbors
                                        return (
                                            page === 1 ||
                                            page === pagination.totalPages ||
                                            Math.abs(page - pagination.page) <= 1
                                        );
                                    })
                                    .map((page, index, array) => {
                                        // Add ellipsis
                                        const showEllipsis = index > 0 && page - array[index - 1] > 1;

                                        return (
                                            <div key={page} className="flex gap-2">
                                                {showEllipsis && <span className="px-2 py-2">...</span>}
                                                <button
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-4 py-2 border rounded-lg ${pagination.page === page
                                                            ? "bg-black text-white"
                                                            : "hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            </div>
                                        );
                                    })}
                            </div>

                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={!pagination.hasNextPage}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
