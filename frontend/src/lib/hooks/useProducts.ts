"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import {
    setFilters,
    resetFilters,
    setCategory,
    setPriceRange,
    setColors,
    setSizes,
    setSearch,
    setSort,
    setPage,
    setLimit,
} from "@/lib/features/products/productsSlice";
import type { ProductFilters, ProductSort } from "@/types/product.types";

/**
 * Hook for managing product filters
 */
export const useProductFilters = () => {
    const dispatch = useDispatch();
    const filters = useSelector((state: RootState) => state.products.filters);

    const updateFilters = useCallback(
        (newFilters: Partial<ProductFilters>) => {
            dispatch(setFilters(newFilters));
        },
        [dispatch]
    );

    const updateCategory = useCallback(
        (category: string | undefined) => {
            dispatch(setCategory(category));
        },
        [dispatch]
    );

    const updatePriceRange = useCallback(
        (minPrice?: number, maxPrice?: number) => {
            dispatch(setPriceRange({ minPrice, maxPrice }));
        },
        [dispatch]
    );

    const updateColors = useCallback(
        (colors: string[]) => {
            dispatch(setColors(colors));
        },
        [dispatch]
    );

    const updateSizes = useCallback(
        (sizes: string[]) => {
            dispatch(setSizes(sizes));
        },
        [dispatch]
    );

    const updateSearch = useCallback(
        (search: string | undefined) => {
            dispatch(setSearch(search));
        },
        [dispatch]
    );

    const clearFilters = useCallback(() => {
        dispatch(resetFilters());
    }, [dispatch]);

    return {
        filters,
        updateFilters,
        updateCategory,
        updatePriceRange,
        updateColors,
        updateSizes,
        updateSearch,
        clearFilters,
    };
};

/**
 * Hook for managing product sorting
 */
export const useProductSort = () => {
    const dispatch = useDispatch();
    const sort = useSelector((state: RootState) => state.products.sort);

    const updateSort = useCallback(
        (newSort: ProductSort) => {
            dispatch(setSort(newSort));
        },
        [dispatch]
    );

    return {
        sort,
        updateSort,
    };
};

/**
 * Hook for managing product pagination
 */
export const useProductPagination = () => {
    const dispatch = useDispatch();
    const pagination = useSelector(
        (state: RootState) => state.products.pagination
    );

    const goToPage = useCallback(
        (page: number) => {
            dispatch(setPage(page));
        },
        [dispatch]
    );

    const updateLimit = useCallback(
        (limit: number) => {
            dispatch(setLimit(limit));
        },
        [dispatch]
    );

    const nextPage = useCallback(() => {
        dispatch(setPage(pagination.page + 1));
    }, [dispatch, pagination.page]);

    const prevPage = useCallback(() => {
        if (pagination.page > 1) {
            dispatch(setPage(pagination.page - 1));
        }
    }, [dispatch, pagination.page]);

    return {
        pagination,
        goToPage,
        updateLimit,
        nextPage,
        prevPage,
    };
};

/**
 * Combined hook for all product operations
 */
export const useProducts = () => {
    const filters = useProductFilters();
    const sort = useProductSort();
    const pagination = useProductPagination();

    return {
        ...filters,
        ...sort,
        ...pagination,
    };
};
