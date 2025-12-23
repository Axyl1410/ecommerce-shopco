# Sơ Đồ Kiến Trúc Chức Năng Duyệt Sản Phẩm
# Product Browsing Architecture Diagram

## 1. Kiến Trúc Tổng Quan / Overall Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE (Browser)                     │
│                                                                       │
│  ┌─────────────────────┐  ┌─────────────────────────────────────┐  │
│  │   Shop Page         │  │   Product Components                 │  │
│  │   /shop/page.tsx    │  │   - ProductCard                      │  │
│  │                     │  │   - Filters                          │  │
│  │  - Filters UI       │  │   - Pagination                       │  │
│  │  - Sort Dropdown    │  │   - Sort Dropdown                    │  │
│  │  - Product Grid     │  └─────────────────────────────────────┘  │
│  │  - Pagination       │                                             │
│  └─────────────────────┘                                             │
└───────────┬─────────────────────────────────────────────────────────┘
            │
            │ useProducts() hook
            │
┌───────────▼─────────────────────────────────────────────────────────┐
│                     REACT HOOKS LAYER                                │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  /lib/hooks/useProducts.ts                                     │  │
│  │                                                                 │  │
│  │  • useProductFilters() → filters, updateFilters()             │  │
│  │  • useProductSort() → sort, updateSort()                      │  │
│  │  • useProductPagination() → pagination, goToPage()            │  │
│  └───────────────────────────────────────────────────────────────┘  │
└───────────┬─────────────────────────────────────────────────────────┘
            │
            │ dispatch(actions)
            │
┌───────────▼─────────────────────────────────────────────────────────┐
│                     REDUX STATE LAYER                                │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  /lib/features/products/productsSlice.ts                       │  │
│  │                                                                 │  │
│  │  State: {                                                       │  │
│  │    filters: ProductFilters,                                    │  │
│  │    sort: ProductSort,                                          │  │
│  │    pagination: PaginationParams                                │  │
│  │  }                                                              │  │
│  │                                                                 │  │
│  │  Actions:                                                       │  │
│  │  • setFilters, resetFilters, setCategory                      │  │
│  │  • setPriceRange, setColors, setSizes, setSearch             │  │
│  │  • setSort, setPage, setLimit                                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
└───────────┬─────────────────────────────────────────────────────────┘
            │
            │ productService.getProducts(filters, sort, pagination)
            │
┌───────────▼─────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                                    │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  /services/product.service.ts                                  │  │
│  │                                                                 │  │
│  │  ProductService:                                               │  │
│  │  • buildQueryString(filters, sort, pagination)                │  │
│  │  • getProducts(filters, sort, pagination)                     │  │
│  │  • getProductBySlug(slug)                                     │  │
│  │  • getFilterOptions()                                         │  │
│  └───────────────────────────────────────────────────────────────┘  │
└───────────┬─────────────────────────────────────────────────────────┘
            │
            │ HTTP GET /api/products?filters&sort&pagination
            │
┌───────────▼─────────────────────────────────────────────────────────┐
│                     API ROUTES LAYER (Backend)                       │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  /app/api/products/route.ts                                    │  │
│  │                                                                 │  │
│  │  GET Handler:                                                   │  │
│  │  1. Parse & Validate Query Params (Zod)                       │  │
│  │  2. Build Prisma WHERE clause                                  │  │
│  │     - Filter by category, brand, price, colors, sizes, tags   │  │
│  │     - Filter by search text                                    │  │
│  │     - Only PUBLISHED products                                  │  │
│  │  3. Build Prisma ORDER BY clause                              │  │
│  │     - Sort by price, rating, name, date, popularity           │  │
│  │  4. Execute Prisma Query                                       │  │
│  │     - findMany with skip/take for pagination                  │  │
│  │     - count for total records                                  │  │
│  │  5. Transform Data                                             │  │
│  │     - Calculate average rating                                 │  │
│  │     - Get display price from variants                         │  │
│  │     - Include category, brand, tags, images                   │  │
│  │  6. Return JSON Response                                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
└───────────┬─────────────────────────────────────────────────────────┘
            │
            │ Prisma Client Query
            │
┌───────────▼─────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                                   │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                           │  │
│  │  (Defined in /prisma/schema.prisma)                           │  │
│  │                                                                 │  │
│  │  Tables:                                                        │  │
│  │  • product (main table)                                        │  │
│  │  • product_variant (price, stock, attributes)                 │  │
│  │  • category (hierarchical)                                     │  │
│  │  • brand                                                        │  │
│  │  • tag + product_tag (many-to-many)                           │  │
│  │  • product_image                                               │  │
│  │  • review (for ratings)                                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Luồng Dữ Liệu Chi Tiết / Detailed Data Flow

### A. Filter Product Flow

```
┌────────────┐
│   USER     │ Click "T-Shirts" category
└─────┬──────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│  COMPONENT: ShopPage                                         │
│  Action: User clicks category filter                         │
└─────┬───────────────────────────────────────────────────────┘
      │
      │ updateCategory("t-shirts")
      ▼
┌─────────────────────────────────────────────────────────────┐
│  HOOK: useProducts()                                         │
│  • Calls dispatch(setCategory("t-shirts"))                  │
└─────┬───────────────────────────────────────────────────────┘
      │
      │ dispatch action
      ▼
┌─────────────────────────────────────────────────────────────┐
│  REDUX: productsSlice                                        │
│  • State updated: filters.category = "t-shirts"             │
│  • Page reset to 1                                           │
└─────┬───────────────────────────────────────────────────────┘
      │
      │ State change triggers useEffect
      ▼
┌─────────────────────────────────────────────────────────────┐
│  COMPONENT: ShopPage useEffect                               │
│  • Detects filters change                                    │
│  • Calls fetchProducts()                                     │
└─────┬───────────────────────────────────────────────────────┘
      │
      │ productService.getProducts(filters, sort, pagination)
      ▼
┌─────────────────────────────────────────────────────────────┐
│  SERVICE: ProductService                                     │
│  • Builds query string: "?category=t-shirts&page=1&..."    │
│  • Makes fetch call to API                                   │
└─────┬───────────────────────────────────────────────────────┘
      │
      │ GET /api/products?category=t-shirts&...
      ▼
┌─────────────────────────────────────────────────────────────┐
│  API: /api/products/route.ts                                 │
│  1. Validate query params with Zod                          │
│  2. Build WHERE clause:                                      │
│     {                                                         │
│       status: "PUBLISHED",                                   │
│       category: { slug: "t-shirts" }                        │
│     }                                                         │
└─────┬───────────────────────────────────────────────────────┘
      │
      │ prisma.product.findMany({ where, orderBy, skip, take })
      ▼
┌─────────────────────────────────────────────────────────────┐
│  DATABASE: PostgreSQL                                        │
│  Execute query:                                              │
│  SELECT * FROM product                                       │
│  JOIN category ON product.categoryId = category.id          │
│  WHERE product.status = 'PUBLISHED'                         │
│    AND category.slug = 't-shirts'                           │
│  ORDER BY product.createdAt DESC                            │
│  LIMIT 12 OFFSET 0                                          │
└─────┬───────────────────────────────────────────────────────┘
      │
      │ Returns raw database records
      ▼
┌─────────────────────────────────────────────────────────────┐
│  API: Transform Data                                         │
│  • Calculate average rating from reviews                     │
│  • Get display price from first variant                     │
│  • Calculate discount percentage                            │
│  • Format response with pagination metadata                 │
└─────┬───────────────────────────────────────────────────────┘
      │
      │ Return JSON: { products: [...], pagination: {...} }
      ▼
┌─────────────────────────────────────────────────────────────┐
│  SERVICE: ProductService                                     │
│  • Receives response                                         │
│  • Returns to component                                      │
└─────┬───────────────────────────────────────────────────────┘
      │
      │ Update component state
      ▼
┌─────────────────────────────────────────────────────────────┐
│  COMPONENT: ShopPage                                         │
│  • setProducts(response.products)                           │
│  • setPaginationMeta(response.pagination)                   │
│  • setIsLoading(false)                                      │
└─────┬───────────────────────────────────────────────────────┘
      │
      │ React re-renders
      ▼
┌─────────────────────────────────────────────────────────────┐
│  UI UPDATE                                                   │
│  • Display filtered T-Shirts products                        │
│  • Update pagination controls                               │
│  • Show "Showing X-Y of Z Products"                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema Relationships

```
┌──────────────────────────────────────────────────────────────────┐
│                     DATABASE RELATIONSHIPS                        │
└──────────────────────────────────────────────────────────────────┘

┌─────────────┐
│  Category   │
│─────────────│         ┌─────────────┐
│ id (PK)     │◄────┐   │   Brand     │
│ name        │     │   │─────────────│
│ slug        │     │   │ id (PK)     │
│ parentId    │─────┘   │ name        │
│ (self-ref)  │         │ slug        │
└─────────────┘         └──────┬──────┘
       ▲                       │
       │                       │
       │ categoryId            │ brandId
       │                       │
       │                       ▼
┌──────┴────────────────────────────────┐
│           Product                      │
│────────────────────────────────────────│
│ id (PK)                                │
│ name                                   │
│ slug (unique)                          │
│ description                            │
│ categoryId (FK) ──────────────────────┘
│ brandId (FK) ──────────────────────────┐
│ status (enum: DRAFT/PUBLISHED/ARCHIVED)│
│ createdAt                              │
│ updatedAt                              │
└───┬────────┬────────┬─────────────────┘
    │        │        │
    │        │        │
    │        │        └──────────────────┐
    │        │                           │
    │        │                           ▼
    │        │                  ┌─────────────────┐
    │        │                  │  ProductImage   │
    │        │                  │─────────────────│
    │        │                  │ id (PK)         │
    │        │                  │ productId (FK)  │
    │        │                  │ variantId (FK?) │
    │        │                  │ url             │
    │        │                  │ altText         │
    │        │                  │ sortOrder       │
    │        │                  └─────────────────┘
    │        │
    │        └───────────────────┐
    │                            │
    ▼                            ▼
┌─────────────────┐      ┌──────────────────┐
│ ProductVariant  │      │   ProductTag     │
│─────────────────│      │──────────────────│
│ id (PK)         │      │ productId (FK)   │◄─┐
│ productId (FK)  │      │ tagId (FK)       │  │
│ sku (unique)    │      └──────┬───────────┘  │
│ attributes(JSON)│             │              │
│ {               │             │              │
│   color: "Blue",│             ▼              │
│   size: "M"     │      ┌─────────────┐      │
│ }               │      │    Tag      │      │
│ price (Decimal) │      │─────────────│      │
│ salePrice       │      │ id (PK)     │      │
│ stockQuantity   │      │ name        │      │
│ weight          │      │ slug        │      │
└────────┬────────┘      └─────────────┘      │
         │                                     │
         │                                     │
         ▼                                     │
┌─────────────────┐                           │
│    CartItem     │                           │
│─────────────────│                           │
│ id (PK)         │                           │
│ cartId (FK)     │                           │
│ variantId (FK)  │                           │
│ quantity        │                           │
│ priceAtAdd      │                           │
└─────────────────┘                           │
                                              │
┌──────────────────┐                          │
│     Review       │                          │
│──────────────────│                          │
│ id (PK)          │                          │
│ productId (FK) ──┼──────────────────────────┘
│ userId (FK)      │
│ rating (1-5)     │
│ title            │
│ body             │
│ status           │
│ createdAt        │
└──────────────────┘
```

**Giải thích Relationships**:
- **Product → Category**: Many-to-One (nhiều sản phẩm thuộc 1 category)
- **Product → Brand**: Many-to-One (nhiều sản phẩm thuộc 1 brand)
- **Product → ProductVariant**: One-to-Many (1 sản phẩm có nhiều variants)
- **Product ↔ Tag**: Many-to-Many (qua bảng ProductTag)
- **Product → ProductImage**: One-to-Many (1 sản phẩm có nhiều ảnh)
- **Product → Review**: One-to-Many (1 sản phẩm có nhiều reviews)
- **ProductVariant → CartItem**: One-to-Many (1 variant có thể ở nhiều giỏ hàng)

---

## 4. API Request/Response Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                  API REQUEST/RESPONSE CYCLE                         │
└────────────────────────────────────────────────────────────────────┘

REQUEST
───────
GET /api/products?category=t-shirts&minPrice=100&maxPrice=500&sortBy=price&sortOrder=asc&page=1&limit=12

   │
   ▼
┌────────────────────────────────────────────────────────────────────┐
│ 1. PARSE & VALIDATE (Zod Schema)                                   │
│                                                                     │
│    const parsed = ProductQuerySchema.safeParse(queryParams)        │
│                                                                     │
│    Validated params:                                                │
│    {                                                                │
│      category: "t-shirts",                                         │
│      minPrice: 100,                                                │
│      maxPrice: 500,                                                │
│      sortBy: "price",                                              │
│      sortOrder: "asc",                                             │
│      page: 1,                                                      │
│      limit: 12                                                     │
│    }                                                                │
└────────────────────────────────────────────────────────────────────┘
   │
   ▼
┌────────────────────────────────────────────────────────────────────┐
│ 2. BUILD PRISMA WHERE CLAUSE                                       │
│                                                                     │
│    const where = {                                                 │
│      status: "PUBLISHED",                                          │
│      category: {                                                   │
│        slug: "t-shirts"                                           │
│      },                                                            │
│      variants: {                                                   │
│        some: {                                                     │
│          price: { gte: 100, lte: 500 }                           │
│        }                                                           │
│      }                                                             │
│    }                                                               │
└────────────────────────────────────────────────────────────────────┘
   │
   ▼
┌────────────────────────────────────────────────────────────────────┐
│ 3. BUILD PRISMA ORDER BY CLAUSE                                    │
│                                                                     │
│    const orderBy = {                                               │
│      variants: { _count: "asc" }  // Workaround for price sort   │
│    }                                                               │
└────────────────────────────────────────────────────────────────────┘
   │
   ▼
┌────────────────────────────────────────────────────────────────────┐
│ 4. CALCULATE PAGINATION                                            │
│                                                                     │
│    const skip = (page - 1) * limit = (1 - 1) * 12 = 0           │
│    const take = limit = 12                                        │
└────────────────────────────────────────────────────────────────────┘
   │
   ▼
┌────────────────────────────────────────────────────────────────────┐
│ 5. EXECUTE PRISMA QUERIES (Parallel)                              │
│                                                                     │
│    const [products, totalCount] = await Promise.all([              │
│      prisma.product.findMany({                                     │
│        where,                                                      │
│        orderBy,                                                    │
│        skip: 0,                                                    │
│        take: 12,                                                   │
│        include: {                                                  │
│          category, brand, variants, images, reviews, tags         │
│        }                                                           │
│      }),                                                           │
│      prisma.product.count({ where })                              │
│    ])                                                              │
└────────────────────────────────────────────────────────────────────┘
   │
   ▼
┌────────────────────────────────────────────────────────────────────┐
│ 6. TRANSFORM DATA                                                  │
│                                                                     │
│    For each product:                                               │
│    • Calculate avgRating from reviews                             │
│    • Get displayPrice from first variant                          │
│    • Calculate discount percentage                                │
│    • Extract category, brand, tags info                           │
│    • Check stock availability                                     │
└────────────────────────────────────────────────────────────────────┘
   │
   ▼
┌────────────────────────────────────────────────────────────────────┐
│ 7. BUILD PAGINATION METADATA                                       │
│                                                                     │
│    const totalPages = Math.ceil(totalCount / limit)               │
│    const hasNextPage = page < totalPages                          │
│    const hasPrevPage = page > 1                                   │
└────────────────────────────────────────────────────────────────────┘
   │
   ▼
RESPONSE (200 OK)
────────────────
{
  "products": [
    {
      "id": "clx123abc",
      "name": "Classic T-Shirt",
      "slug": "classic-t-shirt",
      "price": 199,
      "originalPrice": 299,
      "discount": 33,
      "rating": 4.5,
      "reviewCount": 120,
      "image": "https://...",
      "category": {
        "id": "cat123",
        "name": "T-Shirts",
        "slug": "t-shirts"
      },
      "brand": {
        "id": "brand123",
        "name": "Nike",
        "slug": "nike"
      },
      "tags": [
        { "name": "Summer", "slug": "summer" },
        { "name": "Casual", "slug": "casual" }
      ],
      "inStock": true,
      "variants": [...]
    },
    // ... 11 more products
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "totalCount": 45,
    "totalPages": 4,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 5. Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                     SHOP PAGE COMPONENT TREE                      │
└──────────────────────────────────────────────────────────────────┘

                    ┌────────────────────┐
                    │   ShopPage.tsx     │
                    │   (Main Container) │
                    └────────┬───────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
    ┌─────────────┐  ┌─────────────┐  ┌────────────┐
    │   Filters   │  │ Products    │  │ Pagination │
    │  Component  │  │   Grid      │  │  Component │
    └──────┬──────┘  └──────┬──────┘  └──────┬─────┘
           │                │                 │
           │                │                 │
     Filters UI      Product Cards      Page Controls
           │                │                 │
           ▼                ▼                 ▼
    ┌─────────────┐  ┌─────────────┐  ┌────────────┐
    │ - Category  │  │ ProductCard │  │ - Previous │
    │ - Price     │  │ Component   │  │ - Numbers  │
    │ - Colors    │  │ (x12)       │  │ - Next     │
    │ - Sizes     │  │             │  │            │
    │ - Tags      │  │ Props:      │  │ Events:    │
    │             │  │ - name      │  │ - prevPage │
    │ Events:     │  │ - price     │  │ - goToPage │
    │ - onChange  │  │ - image     │  │ - nextPage │
    └─────────────┘  │ - rating    │  └────────────┘
                     └─────────────┘

All components use:
  ┌────────────────────────────┐
  │  useProducts() hook        │
  │  ┌──────────────────────┐  │
  │  │ filters              │  │
  │  │ sort                 │  │
  │  │ pagination           │  │
  │  │ updateFilters()      │  │
  │  │ updateSort()         │  │
  │  │ goToPage()           │  │
  │  └──────────────────────┘  │
  └────────────────────────────┘
               │
               │ Connected to
               ▼
  ┌────────────────────────────┐
  │  Redux Store               │
  │  (productsSlice)           │
  └────────────────────────────┘
```

---

## 6. Type System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     TYPE DEFINITIONS FLOW                         │
└──────────────────────────────────────────────────────────────────┘

DATABASE SCHEMA (Prisma)
    ↓
┌─────────────────────────┐
│ Prisma Generated Types  │
│ - Product               │
│ - ProductVariant        │
│ - Category              │
│ - Brand                 │
│ - Tag                   │
└────────┬────────────────┘
         │
         │ Used by API
         ▼
┌─────────────────────────┐
│ API Internal Types      │
│ (Prisma models)         │
└────────┬────────────────┘
         │
         │ Transformed to
         ▼
┌─────────────────────────┐
│ Frontend Types          │
│ (/types/product.types)  │
│                         │
│ - ProductDetail         │
│ - ProductFilters        │
│ - ProductSort           │
│ - PaginationParams      │
│ - PaginationMeta        │
└────────┬────────────────┘
         │
         │ Used by
         ├────────────────┐
         │                │
         ▼                ▼
┌─────────────┐   ┌──────────────┐
│   Service   │   │   Redux      │
│   Layer     │   │   Slice      │
└──────┬──────┘   └──────┬───────┘
       │                 │
       └────────┬────────┘
                │
                ▼
        ┌───────────────┐
        │  Components   │
        │  & Hooks      │
        └───────────────┘

Type Safety Flow:
Database → Prisma Types → API Types → Frontend Types → Components
(Full type safety end-to-end)
```

---

## Kết Luận / Summary

Kiến trúc này cho phép:
- ✅ **Separation of Concerns**: Mỗi layer có trách nhiệm rõ ràng
- ✅ **Type Safety**: Full TypeScript từ DB đến UI
- ✅ **Scalability**: Dễ dàng thêm filters/sorts mới
- ✅ **Maintainability**: Code dễ đọc và maintain
- ✅ **Performance**: Query optimization với Prisma
- ✅ **Developer Experience**: Hooks và types giúp dev nhanh hơn
