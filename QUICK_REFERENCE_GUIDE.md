# Hướng Dẫn Nhanh - Chức Năng Duyệt Sản Phẩm
# Quick Reference Guide - Product Browsing Feature

## 📋 Danh Sách Files Quan Trọng / Important Files

### Backend API
```
frontend/src/app/api/products/route.ts
├─ Main API endpoint
├─ Handles GET requests
├─ Filter, Sort, Pagination logic
└─ Returns JSON response
```

### Service Layer
```
frontend/src/services/product.service.ts
├─ ProductService class
├─ API call wrapper
└─ Query string builder
```

### Type Definitions
```
frontend/src/types/product.types.ts
├─ ProductDetail
├─ ProductFilters
├─ ProductSort
├─ PaginationParams
└─ PaginatedProductsResponse
```

### State Management
```
frontend/src/lib/features/products/productsSlice.ts
├─ Redux slice
├─ State: filters, sort, pagination
└─ Actions: setFilters, setSort, setPage, etc.
```

### Custom Hooks
```
frontend/src/lib/hooks/useProducts.ts
├─ useProductFilters()
├─ useProductSort()
├─ useProductPagination()
└─ useProducts() (combined)
```

### Database Schema
```
frontend/prisma/schema.prisma
├─ Product model
├─ ProductVariant model
├─ Category, Brand, Tag models
└─ Relationships definition
```

### Frontend Page
```
frontend/src/app/(shop)/shop/page.tsx
├─ Main shop page
├─ Product grid display
├─ Filters UI
└─ Pagination UI
```

---

## 🔍 Chức Năng Chi Tiết / Feature Details

### 1. FILTERING (Lọc Sản Phẩm)

#### Available Filters:
```typescript
{
  category: string,           // Filter by category slug
  brandId: string,           // Filter by brand ID
  minPrice: number,          // Minimum price
  maxPrice: number,          // Maximum price
  colors: string[],          // Color options
  sizes: string[],           // Size options
  tags: string[],            // Product tags
  search: string             // Text search (name + description)
}
```

#### Usage Example:
```typescript
// Using hooks
const { updateFilters } = useProducts();

// Filter by category
updateFilters({ category: "t-shirts" });

// Filter by price range
updateFilters({ minPrice: 100, maxPrice: 500 });

// Multiple filters
updateFilters({ 
  category: "t-shirts",
  colors: ["red", "blue"],
  minPrice: 100
});
```

#### API Request Example:
```
GET /api/products?category=t-shirts&minPrice=100&maxPrice=500&colors=red,blue
```

---

### 2. SORTING (Sắp Xếp Sản Phẩm)

#### Available Sort Options:
```typescript
sortBy: "price" | "rating" | "name" | "createdAt" | "popularity"
sortOrder: "asc" | "desc"
```

#### Sort Combinations:
```typescript
// Newest first
{ sortBy: "createdAt", sortOrder: "desc" }

// Price: Low to High
{ sortBy: "price", sortOrder: "asc" }

// Price: High to Low
{ sortBy: "price", sortOrder: "desc" }

// Highest Rated
{ sortBy: "rating", sortOrder: "desc" }

// Most Popular
{ sortBy: "popularity", sortOrder: "desc" }

// Name: A to Z
{ sortBy: "name", sortOrder: "asc" }

// Name: Z to A
{ sortBy: "name", sortOrder: "desc" }
```

#### Usage Example:
```typescript
const { updateSort } = useProducts();

// Sort by price ascending
updateSort({ sortBy: "price", sortOrder: "asc" });

// Sort by rating descending
updateSort({ sortBy: "rating", sortOrder: "desc" });
```

#### API Request Example:
```
GET /api/products?sortBy=price&sortOrder=asc
```

---

### 3. PAGINATION (Phân Trang)

#### Pagination Parameters:
```typescript
{
  page: number,    // Current page (starts from 1)
  limit: number    // Items per page (default: 12)
}
```

#### Pagination Metadata Response:
```typescript
{
  page: number,           // Current page
  limit: number,          // Items per page
  totalCount: number,     // Total number of products
  totalPages: number,     // Total number of pages
  hasNextPage: boolean,   // Can go to next page?
  hasPrevPage: boolean    // Can go to previous page?
}
```

#### Usage Example:
```typescript
const { goToPage, nextPage, prevPage, updateLimit } = useProducts();

// Go to specific page
goToPage(3);

// Go to next page
nextPage();

// Go to previous page
prevPage();

// Change items per page
updateLimit(24);
```

#### API Request Example:
```
GET /api/products?page=2&limit=12
```

---

## 🔧 Các Hàm Phổ Biến / Common Functions

### 1. Fetch Products
```typescript
import { productService } from '@/services/product.service';

const fetchProducts = async () => {
  try {
    const response = await productService.getProducts(
      filters,      // ProductFilters
      sort,         // ProductSort
      pagination    // PaginationParams
    );
    
    // response.products: ProductDetail[]
    // response.pagination: PaginationMeta
    
    setProducts(response.products);
    setPaginationMeta(response.pagination);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
```

### 2. Update Filters
```typescript
import { useProducts } from '@/lib/hooks/useProducts';

const { updateFilters, updateCategory, updatePriceRange } = useProducts();

// Update single filter
updateCategory("t-shirts");

// Update price range
updatePriceRange(100, 500);

// Update multiple filters
updateFilters({ 
  category: "t-shirts",
  colors: ["red", "blue"],
  minPrice: 100,
  maxPrice: 500
});
```

### 3. Clear All Filters
```typescript
const { clearFilters } = useProducts();

// Reset all filters to initial state
clearFilters();
```

### 4. Handle Sort Change
```typescript
const { updateSort } = useProducts();

// From UI Select component
const handleSortChange = (value: string) => {
  // value format: "sortBy-sortOrder" (e.g., "price-asc")
  const [sortBy, sortOrder] = value.split("-");
  updateSort({ 
    sortBy: sortBy as SortOption, 
    sortOrder: sortOrder as SortOrder 
  });
};
```

### 5. Build Query String (Manual)
```typescript
import { ProductFilters, ProductSort, PaginationParams } from '@/types/product.types';

const buildQueryString = (
  filters: ProductFilters,
  sort: ProductSort,
  pagination: PaginationParams
): string => {
  const params = new URLSearchParams();
  
  // Pagination
  params.append("page", pagination.page.toString());
  params.append("limit", pagination.limit.toString());
  
  // Sort
  params.append("sortBy", sort.sortBy);
  params.append("sortOrder", sort.sortOrder);
  
  // Filters
  if (filters.category) params.append("category", filters.category);
  if (filters.brandId) params.append("brandId", filters.brandId);
  if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
  if (filters.colors?.length) params.append("colors", filters.colors.join(","));
  if (filters.sizes?.length) params.append("sizes", filters.sizes.join(","));
  if (filters.tags?.length) params.append("tags", filters.tags.join(","));
  if (filters.search) params.append("search", filters.search);
  
  return params.toString();
};
```

---

## 💻 Code Examples

### Complete Shop Page Example
```typescript
"use client";

import { useEffect, useState } from "react";
import { useProducts } from "@/lib/hooks/useProducts";
import { productService } from "@/services/product.service";
import type { ProductDetail, PaginationMeta } from "@/types/product.types";

export default function ShopPage() {
  // 1. Get state and actions from hook
  const { 
    filters, 
    sort, 
    pagination, 
    updateSort, 
    goToPage, 
    nextPage, 
    prevPage 
  } = useProducts();
  
  // 2. Local state
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
  
  // 3. Fetch products when filters/sort/pagination change
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
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters, sort, pagination]);
  
  // 4. Handle sort change
  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as [any, "asc" | "desc"];
    updateSort({ sortBy, sortOrder });
  };
  
  // 5. Render
  return (
    <main>
      {/* Filters sidebar */}
      <Filters />
      
      {/* Sort dropdown */}
      <Select value={`${sort.sortBy}-${sort.sortOrder}`} onValueChange={handleSortChange}>
        <SelectItem value="createdAt-desc">Newest</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
        <SelectItem value="rating-desc">Highest Rated</SelectItem>
      </Select>
      
      {/* Products grid */}
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className="grid">
          {products.map(product => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      <Pagination>
        <PaginationPrevious onClick={prevPage} disabled={!paginationMeta.hasPrevPage} />
        <PaginationNumbers currentPage={paginationMeta.page} totalPages={paginationMeta.totalPages} onPageChange={goToPage} />
        <PaginationNext onClick={nextPage} disabled={!paginationMeta.hasNextPage} />
      </Pagination>
    </main>
  );
}
```

### Custom Filter Component Example
```typescript
"use client";

import { useProducts } from "@/lib/hooks/useProducts";

export default function CategoryFilter() {
  const { filters, updateCategory } = useProducts();
  
  const categories = [
    { name: "All Products", slug: undefined },
    { name: "T-Shirts", slug: "t-shirts" },
    { name: "Jeans", slug: "jeans" },
    { name: "Shoes", slug: "shoes" },
  ];
  
  return (
    <div>
      <h3>Category</h3>
      {categories.map(category => (
        <button
          key={category.slug || "all"}
          onClick={() => updateCategory(category.slug)}
          className={filters.category === category.slug ? "active" : ""}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
```

### Price Range Filter Example
```typescript
"use client";

import { useState } from "react";
import { useProducts } from "@/lib/hooks/useProducts";

export default function PriceRangeFilter() {
  const { filters, updatePriceRange } = useProducts();
  const [minPrice, setMinPrice] = useState(filters.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || 1000);
  
  const handleApply = () => {
    updatePriceRange(minPrice, maxPrice);
  };
  
  return (
    <div>
      <h3>Price Range</h3>
      <input
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(Number(e.target.value))}
        placeholder="Min"
      />
      <input
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
        placeholder="Max"
      />
      <button onClick={handleApply}>Apply</button>
    </div>
  );
}
```

---

## 🧪 Testing Examples

### Test API Endpoint Manually

```bash
# Test basic request
curl http://localhost:3000/api/products

# Test with filters
curl "http://localhost:3000/api/products?category=t-shirts&minPrice=100&maxPrice=500"

# Test with sorting
curl "http://localhost:3000/api/products?sortBy=price&sortOrder=asc"

# Test with pagination
curl "http://localhost:3000/api/products?page=2&limit=12"

# Test combined
curl "http://localhost:3000/api/products?category=t-shirts&sortBy=price&sortOrder=asc&page=1&limit=12"
```

### Test with Fetch in Browser Console

```javascript
// Test basic fetch
fetch('/api/products')
  .then(res => res.json())
  .then(data => console.log(data));

// Test with filters
fetch('/api/products?category=t-shirts&minPrice=100&maxPrice=500')
  .then(res => res.json())
  .then(data => console.log(data));

// Test with all params
fetch('/api/products?category=t-shirts&sortBy=price&sortOrder=asc&page=1&limit=12')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Filters không hoạt động
**Nguyên nhân**: Redux state không được update
**Giải pháp**: 
```typescript
// Đảm bảo component được wrap trong Provider
import { Provider } from 'react-redux';
import { store } from '@/lib/store';

<Provider store={store}>
  <YourComponent />
</Provider>
```

### Issue 2: Pagination không reset khi filter
**Nguyên nhân**: Logic trong reducer bị sai
**Giải pháp**: Kiểm tra productsSlice.ts, mỗi filter action phải reset page về 1

### Issue 3: Sort by price không chính xác
**Nguyên nhân**: Prisma không hỗ trợ sort trực tiếp theo variant price
**Giải pháp**: Đây là limitation hiện tại, cần implement custom sorting logic

### Issue 4: Products không load
**Nguyên nhân**: API endpoint không được gọi
**Giải pháp**: 
```typescript
// Check useEffect dependencies
useEffect(() => {
  fetchProducts();
}, [filters, sort, pagination]); // Đảm bảo có đủ dependencies
```

---

## 📚 Reference Links

- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Redux Toolkit**: https://redux-toolkit.js.org/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Zod Validation**: https://zod.dev/

---

## 📝 Notes

1. **Performance**: API route tự động cache với Next.js, có thể config trong route.ts
2. **Security**: Validation bằng Zod để đảm bảo input an toàn
3. **Scalability**: Có thể dễ dàng thêm filters mới bằng cách update types và API route
4. **Type Safety**: Full TypeScript coverage từ DB đến UI
5. **Testing**: Nên test cả client-side và server-side logic

---

## 🚀 Next Steps

Để extend chức năng này:
1. Thêm filters mới trong ProductFilters type
2. Update API route để handle filter mới
3. Update UI components để display filter
4. Test thoroughly
5. Update documentation

Chúc bạn code vui vẻ! Happy coding! 🎉
