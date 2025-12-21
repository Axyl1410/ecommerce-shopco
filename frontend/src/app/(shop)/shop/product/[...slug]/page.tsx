"use client";

import {
  newArrivalsData,
  relatedProductData,
  topSellingData,
} from "@/app/(shop)/page";
import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import Tabs from "@/components/product-page/Tabs";
import type { Product } from "@/types/product.types";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

const data: Product[] = [
  ...newArrivalsData,
  ...topSellingData,
  ...relatedProductData,
];

async function getRelatedProducts(
  categoryId: string,
  excludeProductId: string,
) {
  try {
    const API_BASE =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

    const response = await fetch(
      `${API_BASE}/products?categoryId=${categoryId}&limit=8`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) return [];

    const apiResponse = await response.json();
    const products = apiResponse.data?.products || [];

    // Filter out the current product and map to the required format
    return products
      .filter((product: any) => product.id !== excludeProductId)
      .slice(0, 4) // Limit to 4 related products
      .map((product: any) => ({
        id: product.id,
        title: product.name,
        srcUrl: product.defaultImage || product.images?.[0]?.url || "",
        price: Number(product.minPrice ?? 0),
        discount: { amount: 0, percentage: 0 },
        rating: 4.5, // You might want to calculate this from reviews if available
      }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function getProductDetails(productId: string) {
  try {
    console.log("API URL >>>", process.env.NEXT_PUBLIC_API_URL);

    const API_BASE =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

    const response = await fetch(`${API_BASE}/products/${productId}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const apiData = await response.json();

    // Calculate average rating from reviews
    const reviews = apiData.reviews || [];
    const averageRating =
      reviews.length > 0
        ? reviews.reduce(
            (sum: number, review: any) => sum + (review.rating || 0),
            0,
          ) / reviews.length
        : 0;

    return {
      id: apiData.id,
      title: apiData.name,
      srcUrl: apiData.defaultImage || apiData.images?.[0]?.url || "",
      gallery: apiData.images?.map((img: any) => img.url) || [],
      price: Number(apiData.minPrice ?? 0),
      discount: { amount: 0, percentage: 0 },
      rating: averageRating,
      description: apiData.description,
      categoryId: apiData.categoryId,
      categoryName: apiData.categoryName,
      brandName: apiData.brandName,
      variants: apiData.variants || [],
      reviews: reviews,
      tags: apiData.tags || [],
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const [productData, setProductData] = useState<any>(null);
  const [relatedProductData, setRelatedProductData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string[]>([]);

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug || []);
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    if (slug.length === 0) return;

    const loadData = async () => {
      const [productId] = slug;

      const product = await getProductDetails(productId);
      if (!product) {
        notFound();
        return;
      }

      setProductData(product);

      const related = product.categoryId
        ? await getRelatedProducts(product.categoryId, productId)
        : [];
      setRelatedProductData(related);

      setLoading(false);
    };

    loadData();
  }, [slug]);

  const handleReviewSubmitted = async () => {
    // Refresh product data to get updated reviews
    if (productData) {
      const updatedProduct = await getProductDetails(productData.id);
      if (updatedProduct) {
        setProductData(updatedProduct);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!productData) {
    notFound();
  }

  return (
    <main>
      <div className="mx-auto max-w-frame px-4 xl:px-0">
        <hr className="mb-5 h-[1px] border-t-black/10 sm:mb-6" />
        <BreadcrumbProduct title={productData.title} />

        <section className="mb-11">
          <Header data={productData} />
        </section>

        <Tabs
          productData={productData}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>

      <div className="mb-[50px] sm:mb-20">
        <ProductListSec title="You might also like" data={relatedProductData} />
      </div>
    </main>
  );
}
