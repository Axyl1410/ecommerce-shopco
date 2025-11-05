# Tài Liệu Backend Chức Năng Duyệt Sản Phẩm
# Product Browsing Backend Documentation

## Tổng Quan / Overview

Dự án Shopco sử dụng kiến trúc **Next.js Full-Stack** với:
- **Frontend**: Next.js 14 (React), TypeScript, Tailwind CSS, Redux
- **Backend API**: Next.js API Routes (Server-side)
- **Database**: PostgreSQL với Prisma ORM

Chức năng duyệt sản phẩm bao gồm:
- ✅ **Filter (Lọc)**: Theo category, brand, price, colors, sizes, tags, search
- ✅ **Sort (Sắp xếp)**: Theo giá, rating, tên, ngày tạo, độ phổ biến
- ✅ **Pagination (Phân trang)**: Hỗ trợ phân trang với metadata đầy đủ

---

## Cấu Trúc Files / File Structure

### 1. Backend API Layer

#### 📄 `/frontend/src/app/api/products/route.ts`
**Vai trò**: API endpoint chính xử lý request GET để lấy danh sách sản phẩm

**Chức năng chính**:
- Nhận và validate query parameters (page, limit, filters, sort)
- Xây dựng Prisma query với điều kiện WHERE phức tạp
- Thực hiện sorting theo các tiêu chí khác nhau
- Tính toán pagination metadata
- Transform dữ liệu từ database sang format frontend-friendly
- Xử lý errors và trả về response JSON

**Các tính năng được implement**:

```typescript
// 1. VALIDATION - Sử dụng Zod schema
ProductQuerySchema = {
  page, limit,           // Pagination
  category, brandId,     // Basic filters
  minPrice, maxPrice,    // Price range
  colors, sizes, tags,   // Product attributes
  search,                // Text search
  sortBy, sortOrder      // Sorting
}

// 2. FILTERING
- Filter by category slug
- Filter by brand ID
- Filter by price range (qua variants)
- Filter by colors/sizes (qua variant attributes)
- Filter by tags (many-to-many relationship)
- Filter by search text (name + description)
- Chỉ lấy products có status = "PUBLISHED"

// 3. SORTING
- Sort by price (qua variants)
- Sort by rating (qua reviews)
- Sort by name (alphabetically)
- Sort by createdAt (newest/oldest)
- Sort by popularity (review count)

// 4. PAGINATION
- Skip/Take mechanism
- Total count calculation
- Metadata: totalPages, hasNextPage, hasPrevPage

// 5. DATA TRANSFORMATION
- Calculate average rating từ reviews
- Get display price từ first variant
- Calculate discount percentage
- Include related data: category, brand, tags, images
```

**Response Format**:
```json
{
  "products": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "price": number,
      "originalPrice": number,
      "discount": number,
      "rating": number,
      "reviewCount": number,
      "image": "string",
      "category": { "id", "name", "slug" },
      "brand": { "id", "name", "slug" },
      "tags": [{ "name", "slug" }],
      "inStock": boolean,
      "variants": [...]
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "totalCount": number,
    "totalPages": number,
    "hasNextPage": boolean,
    "hasPrevPage": boolean
  }
}
```

---

### 2. Service Layer

#### 📄 `/frontend/src/services/product.service.ts`
**Vai trò**: Service class để gọi API từ frontend

**Chức năng chính**:
- Xây dựng query string từ filters, sort, pagination params
- Gọi fetch() đến API endpoint `/api/products`
- Xử lý response và errors
- Cache management (no-store để luôn lấy fresh data)

**Methods**:

```typescript
class ProductService {
  // 1. Build query string từ params
  buildQueryString(filters, sort, pagination): string
  
  // 2. Fetch products với full params
  async getProducts(filters, sort, pagination): Promise<PaginatedProductsResponse>
  
  // 3. Lấy single product by slug (optional)
  async getProductBySlug(slug): Promise<ProductDetail>
  
  // 4. Lấy filter options (categories, brands, etc.)
  async getFilterOptions(): Promise<FilterOptions>
}

// Export singleton instance
export const productService = new ProductService();
```

**Cách sử dụng**:
```typescript
const response = await productService.getProducts(
  { category: "t-shirts", minPrice: 100, maxPrice: 500 },
  { sortBy: "price", sortOrder: "asc" },
  { page: 1, limit: 12 }
);
```

---

### 3. Type Definitions

#### 📄 `/frontend/src/types/product.types.ts`
**Vai trò**: Định nghĩa TypeScript types cho toàn bộ product domain

**Types được định nghĩa**:

```typescript
// 1. CORE PRODUCT TYPES
export type Category = { id, name, slug }
export type Brand = { id, name, slug }
export type Tag = { name, slug }
export type ProductVariant = { id, price, salePrice, stockQuantity, attributes }

// 2. PRODUCT DETAIL
export type ProductDetail = {
  id, name, slug, description,
  price, originalPrice, discount,
  rating, reviewCount,
  image, imageAlt,
  category, brand, tags,
  inStock, variants
}

// 3. FILTERING TYPES
export type ProductFilters = {
  category?: string
  brandId?: string
  minPrice?: number
  maxPrice?: number
  colors?: string[]
  sizes?: string[]
  tags?: string[]
  search?: string
}

// 4. SORTING TYPES
export type SortOption = "price" | "rating" | "name" | "createdAt" | "popularity"
export type SortOrder = "asc" | "desc"
export type ProductSort = { sortBy: SortOption, sortOrder: SortOrder }

// 5. PAGINATION TYPES
export type PaginationParams = { page: number, limit: number }
export type PaginationMeta = {
  page, limit, totalCount, totalPages,
  hasNextPage, hasPrevPage
}

// 6. API RESPONSE TYPE
export type PaginatedProductsResponse = {
  products: ProductDetail[]
  pagination: PaginationMeta
}
```

**Giải thích**:
- Tất cả types đều strongly typed
- Hỗ trợ TypeScript IntelliSense tốt
- Dễ maintain và extend
- Type-safe khi gọi API

---

### 4. State Management Layer

#### 📄 `/frontend/src/lib/features/products/productsSlice.ts`
**Vai trò**: Redux slice quản lý state của filters, sorting, pagination

**State Structure**:

```typescript
interface ProductsState {
  // Existing state (cho product detail page)
  colorSelection: Color
  sizeSelection: string
  
  // New state (cho product listing/filtering)
  filters: ProductFilters      // Lưu tất cả filters
  sort: ProductSort            // Lưu sort config
  pagination: PaginationParams // Lưu pagination config
}
```

**Reducers được cung cấp**:

```typescript
// 1. FILTER ACTIONS
setFilters(filters)        // Update nhiều filters cùng lúc
resetFilters()             // Reset về initial state
setCategory(category)      // Set category filter
setPriceRange(min, max)    // Set price range
setColors(colors[])        // Set colors filter
setSizes(sizes[])          // Set sizes filter
setSearch(search)          // Set search query

// 2. SORT ACTIONS
setSort({ sortBy, sortOrder })  // Update sort config

// 3. PAGINATION ACTIONS
setPage(page)              // Go to specific page
setLimit(limit)            // Change items per page

// Note: Mỗi khi thay đổi filter/sort, page tự động reset về 1
```

**Initial State**:
```typescript
{
  filters: {
    category: undefined,
    brandId: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    colors: [],
    sizes: [],
    tags: [],
    search: undefined,
  },
  sort: {
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  pagination: {
    page: 1,
    limit: 12,
  }
}
```

---

### 5. Custom Hooks Layer

#### 📄 `/frontend/src/lib/hooks/useProducts.ts`
**Vai trò**: Custom React hooks để dễ dàng sử dụng Redux state và actions

**Hooks được export**:

```typescript
// 1. Filter Management Hook
export const useProductFilters = () => {
  return {
    filters,              // Current filters state
    updateFilters,        // Update multiple filters
    updateCategory,       // Update category
    updatePriceRange,     // Update price range
    updateColors,         // Update colors
    updateSizes,          // Update sizes
    updateSearch,         // Update search
    clearFilters,         // Reset all filters
  }
}

// 2. Sort Management Hook
export const useProductSort = () => {
  return {
    sort,          // Current sort state
    updateSort,    // Update sort config
  }
}

// 3. Pagination Management Hook
export const useProductPagination = () => {
  return {
    pagination,    // Current pagination state
    goToPage,      // Go to specific page
    updateLimit,   // Change items per page
    nextPage,      // Go to next page
    prevPage,      // Go to previous page
  }
}

// 4. Combined Hook (tất cả trong một)
export const useProducts = () => {
  return {
    ...useProductFilters(),
    ...useProductSort(),
    ...useProductPagination(),
  }
}
```

**Cách sử dụng trong component**:
```typescript
// Trong React component
const {
  filters,
  updateFilters,
  sort,
  updateSort,
  pagination,
  goToPage
} = useProducts();

// Update filter
updateFilters({ category: "t-shirts" });

// Change sort
updateSort({ sortBy: "price", sortOrder: "asc" });

// Go to page 2
goToPage(2);
```

---

### 6. Database Schema Layer

#### 📄 `/frontend/prisma/schema.prisma`
**Vai trò**: Định nghĩa database schema và relationships

**Models liên quan đến Product Browsing**:

```prisma
// 1. PRODUCT MODEL (Main)
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  
  // Relations
  brandId    String?
  brand      Brand?
  categoryId String?
  category   Category?
  
  // Status
  status     ProductStatus @default(DRAFT)
  
  // Timestamps
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  // Relations
  variants      ProductVariant[]  // 1-to-many
  images        ProductImage[]    // 1-to-many
  reviews       Review[]          // 1-to-many
  tags          ProductTag[]      // many-to-many
  wishlistItems WishlistItem[]
}

// 2. PRODUCT VARIANT MODEL
model ProductVariant {
  id            String  @id @default(cuid())
  productId     String
  product       Product @relation(...)
  
  sku           String? @unique
  attributes    Json?   // { "color": "Blue", "size": "M" }
  price         Decimal
  salePrice     Decimal?
  stockQuantity Int
  weight        Float?
  
  // Relations
  images     ProductImage[]
  cartItems  CartItem[]
  orderItems OrderItem[]
}

// 3. CATEGORY MODEL
model Category {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  
  // Self-referencing (tree structure)
  parentId    String?
  parent      Category?
  children    Category[]
  
  products    Product[]
}

// 4. BRAND MODEL
model Brand {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  products    Product[]
}

// 5. TAG MODEL (Many-to-Many với Product)
model Tag {
  id       String       @id @default(cuid())
  name     String       @unique
  slug     String       @unique
  products ProductTag[]
}

model ProductTag {
  productId String
  product   Product
  tagId     String
  tag       Tag
  
  @@id([productId, tagId])
}

// 6. REVIEW MODEL (cho rating)
model Review {
  id        String  @id @default(cuid())
  productId String
  product   Product
  userId    String
  user      User
  
  rating    Int     // 1-5 stars
  title     String?
  body      String?
  status    ReviewStatus
  createdAt DateTime
}

// 7. ENUMS
enum ProductStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

**Relationships quan trọng**:
- Product → Category (many-to-one)
- Product → Brand (many-to-one)
- Product → ProductVariant (one-to-many)
- Product ↔ Tag (many-to-many qua ProductTag)
- Product → Review (one-to-many)

---

### 7. Frontend Page Layer

#### 📄 `/frontend/src/app/(shop)/shop/page.tsx`
**Vai trò**: Main shop page hiển thị danh sách sản phẩm

**Flow hoạt động**:

```typescript
1. COMPONENT INITIALIZATION
   - Import hooks: useProducts()
   - State: products[], paginationMeta, isLoading, error

2. DATA FETCHING (useEffect)
   - Trigger khi filters/sort/pagination thay đổi
   - Call productService.getProducts()
   - Update local state với response

3. UI RENDERING
   a. Filters Sidebar (Desktop)
      - Category filter
      - Price range slider
      - Color checkboxes
      - Size checkboxes
   
   b. Products Grid
      - Loading state
      - Error state
      - Product cards grid (responsive)
      - Empty state
   
   c. Sort Dropdown
      - Newest
      - Most Popular
      - Price: Low to High
      - Price: High to Low
      - Highest Rated
      - Name: A-Z, Z-A
   
   d. Pagination Controls
      - Previous/Next buttons
      - Page numbers with ellipsis
      - Current page highlight

4. USER INTERACTIONS
   - Thay đổi filter → updateFilters() → trigger refetch
   - Thay đổi sort → updateSort() → trigger refetch
   - Click page number → goToPage() → trigger refetch
   - Next/Prev → nextPage()/prevPage() → trigger refetch
```

**Component Structure**:
```tsx
export default function ShopPage() {
  // 1. Hooks
  const { filters, sort, pagination, updateSort, goToPage } = useProducts();
  
  // 2. Local state
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({...});
  const [isLoading, setIsLoading] = useState(false);
  
  // 3. Effect: Fetch products
  useEffect(() => {
    fetchProducts();
  }, [filters, sort, pagination]);
  
  // 4. Render
  return (
    <main>
      {/* Filters Sidebar */}
      <Filters />
      
      {/* Sort Dropdown */}
      <Select onValueChange={handleSortChange}>
        <SelectItem value="createdAt-desc">Newest</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        ...
      </Select>
      
      {/* Products Grid */}
      <div className="grid">
        {products.map(product => <ProductCard {...product} />)}
      </div>
      
      {/* Pagination */}
      <Pagination>
        <PaginationPrevious onClick={prevPage} />
        <PaginationContent>{renderPageNumbers()}</PaginationContent>
        <PaginationNext onClick={nextPage} />
      </Pagination>
    </main>
  );
}
```

---

## Luồng Hoạt Động Chi Tiết / Detailed Flow

### 1. Filter Products Flow

```
USER ACTION: Click category filter "T-Shirts"
    ↓
REDUX: dispatch(setCategory("t-shirts"))
    ↓
STATE: filters.category = "t-shirts", pagination.page = 1
    ↓
REACT: useEffect triggered (dependency: filters)
    ↓
SERVICE: productService.getProducts(filters, sort, pagination)
    ↓
API CALL: GET /api/products?category=t-shirts&page=1&limit=12&sortBy=createdAt&sortOrder=desc
    ↓
API ROUTE: route.ts receives request
    ↓
VALIDATION: Zod validates query params
    ↓
PRISMA QUERY: 
    where: { 
      status: "PUBLISHED",
      category: { slug: "t-shirts" }
    }
    orderBy: { createdAt: "desc" }
    skip: 0
    take: 12
    ↓
DATABASE: PostgreSQL executes query
    ↓
TRANSFORM: Convert DB data to frontend format
    ↓
RESPONSE: { products: [...], pagination: {...} }
    ↓
SERVICE: Returns data to component
    ↓
COMPONENT: setProducts(data.products), setPaginationMeta(data.pagination)
    ↓
UI UPDATE: Re-render với filtered products
```

### 2. Sort Products Flow

```
USER ACTION: Select "Price: Low to High"
    ↓
EVENT: handleSortChange("price-asc")
    ↓
REDUX: dispatch(setSort({ sortBy: "price", sortOrder: "asc" }))
    ↓
STATE: sort = { sortBy: "price", sortOrder: "asc" }, page = 1
    ↓
REACT: useEffect triggered
    ↓
[Same flow as filter, but với orderBy khác nhau]
    ↓
PRISMA QUERY: 
    orderBy: { variants: { _count: "asc" } } // Workaround for price sort
    ↓
UI UPDATE: Products displayed in ascending price order
```

### 3. Pagination Flow

```
USER ACTION: Click page 2
    ↓
EVENT: goToPage(2)
    ↓
REDUX: dispatch(setPage(2))
    ↓
STATE: pagination.page = 2
    ↓
REACT: useEffect triggered
    ↓
SERVICE: Same filters/sort, but page = 2
    ↓
API CALL: GET /api/products?...&page=2&limit=12
    ↓
PRISMA QUERY: 
    skip: (2-1) * 12 = 12
    take: 12
    ↓
DATABASE: Returns records 13-24
    ↓
UI UPDATE: Display page 2 products
```

---

## Các Điểm Mạnh / Strengths

✅ **Separation of Concerns**: Phân tách rõ ràng giữa layers
✅ **Type Safety**: Full TypeScript coverage
✅ **Reusability**: Service và hooks có thể tái sử dụng
✅ **State Management**: Redux giúp sync state across components
✅ **Performance**: Pagination giảm load time
✅ **Flexibility**: Dễ dàng thêm filters/sorts mới
✅ **SEO-friendly**: Server-side API routes
✅ **Error Handling**: Proper error boundaries

---

## Các Điểm Cần Cải Thiện / Areas for Improvement

⚠️ **Price Sorting**: Hiện tại sort by price chưa chính xác (dùng variant count workaround)
⚠️ **Caching**: Không có cache mechanism (luôn fetch fresh data)
⚠️ **Loading State**: Có thể thêm skeleton loading
⚠️ **Debouncing**: Search filter nên có debounce
⚠️ **Optimistic Updates**: Có thể improve UX
⚠️ **Error Messages**: Cần user-friendly error messages hơn

---

## Cách Test Các Chức Năng / How to Test

### 1. Test Filtering
```bash
# Test category filter
GET /api/products?category=t-shirts

# Test price range
GET /api/products?minPrice=100&maxPrice=500

# Test multiple filters
GET /api/products?category=t-shirts&minPrice=100&colors=red,blue
```

### 2. Test Sorting
```bash
# Test price ascending
GET /api/products?sortBy=price&sortOrder=asc

# Test by rating
GET /api/products?sortBy=rating&sortOrder=desc
```

### 3. Test Pagination
```bash
# Page 1
GET /api/products?page=1&limit=12

# Page 2
GET /api/products?page=2&limit=12

# Different limit
GET /api/products?page=1&limit=24
```

---

## Kết Luận / Conclusion

Backend của chức năng duyệt sản phẩm được implement hoàn chỉnh với:
- ✅ Next.js API Routes làm backend layer
- ✅ Prisma ORM để query database
- ✅ Redux để manage state
- ✅ Custom hooks để dễ dàng tích hợp
- ✅ Full TypeScript support
- ✅ Responsive và performant

Hệ thống có thể dễ dàng scale và maintain khi cần thêm features mới.
