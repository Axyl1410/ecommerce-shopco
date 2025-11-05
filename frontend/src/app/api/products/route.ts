import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema cho query params
const ProductQuerySchema = z.object({
  // Pagination
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),

  // Filters
  category: z.string().optional(),
  brandId: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  colors: z.string().optional(), // comma-separated
  sizes: z.string().optional(), // comma-separated
  tags: z.string().optional(), // comma-separated
  search: z.string().optional(),

  // Sorting
  sortBy: z
    .enum(["price", "rating", "name", "createdAt", "popularity"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse và validate query params
    const queryParams = Object.fromEntries(searchParams.entries());
    const parsed = ProductQuerySchema.safeParse(queryParams);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const {
      page,
      limit,
      category,
      brandId,
      minPrice,
      maxPrice,
      colors,
      sizes,
      tags,
      search,
      sortBy,
      sortOrder,
    } = parsed.data;

    // Build Prisma where clause
    const where: Prisma.ProductWhereInput = {
      status: "PUBLISHED", // Chỉ lấy sản phẩm đã publish
    };

    // Filter by category
    if (category) {
      where.category = {
        slug: category,
      };
    }

    // Filter by brand
    if (brandId) {
      where.brandId = brandId;
    }

    // Filter by search
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(",").map((t) => t.trim());
      where.tags = {
        some: {
          tag: {
            slug: {
              in: tagArray,
            },
          },
        },
      };
    }

    // Filter by price range (through variants)
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.variants = {
        some: {
          ...(minPrice !== undefined && {
            price: { gte: minPrice },
          }),
          ...(maxPrice !== undefined && {
            price: { lte: maxPrice },
          }),
        },
      };
    }

    // Filter by colors or sizes (stored in variant attributes)
    if (colors || sizes) {
      const attributeFilter: any[] = [];

      if (colors) {
        const colorArray = colors.split(",").map((c) => c.trim().toLowerCase());
        attributeFilter.push({
          variants: {
            some: {
              attributes: {
                path: ["color"],
                string_contains: colorArray[0], // Prisma JSON filter
              },
            },
          },
        });
      }

      if (sizes) {
        const sizeArray = sizes.split(",").map((s) => s.trim().toUpperCase());
        attributeFilter.push({
          variants: {
            some: {
              attributes: {
                path: ["size"],
                string_contains: sizeArray[0],
              },
            },
          },
        });
      }

      if (attributeFilter.length > 0) {
        where.AND = attributeFilter;
      }
    }

    // Build orderBy clause
    let orderBy: Prisma.ProductOrderByWithRelationInput = {};

    switch (sortBy) {
      case "price":
        // Sort by minimum variant price
        orderBy = {
          variants: {
            _count: sortOrder, // Workaround: sort by variant count, will need custom logic
          },
        };
        break;
      case "name":
        orderBy = { name: sortOrder };
        break;
      case "createdAt":
        orderBy = { createdAt: sortOrder };
        break;
      case "rating":
        // Sort by average rating (requires aggregation)
        orderBy = { reviews: { _count: sortOrder } }; // Workaround: sort by review count
        break;
      case "popularity":
        // Sort by review count as popularity metric
        orderBy = { reviews: { _count: sortOrder } };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch products with relations
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          variants: {
            take: 1, // Get first variant for price display
            orderBy: { price: "asc" },
            select: {
              id: true,
              price: true,
              salePrice: true,
              stockQuantity: true,
              attributes: true,
            },
          },
          images: {
            take: 1,
            orderBy: { sortOrder: "asc" },
            select: {
              url: true,
              altText: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Transform data for frontend
    const transformedProducts = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            product.reviews.length
          : 0;

      const firstVariant = product.variants[0];
      const displayPrice = firstVariant?.salePrice || firstVariant?.price || 0;
      const originalPrice = firstVariant?.price || 0;
      const discount =
        firstVariant?.salePrice && firstVariant?.price
          ? ((Number(firstVariant.price) - Number(firstVariant.salePrice)) /
              Number(firstVariant.price)) *
            100
          : 0;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: Number(displayPrice),
        originalPrice: Number(originalPrice),
        discount: Math.round(discount),
        rating: Number(avgRating.toFixed(1)),
        reviewCount: product.reviews.length,
        image: product.images[0]?.url || product.defaultImage || "",
        imageAlt: product.images[0]?.altText || product.name,
        category: product.category,
        brand: product.brand,
        tags: product.tags.map((pt) => pt.tag),
        inStock: (firstVariant?.stockQuantity || 0) > 0,
        variants: product.variants,
      };
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
