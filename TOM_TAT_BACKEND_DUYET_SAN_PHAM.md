# TÓM TẮT BACKEND CHỨC NĂNG DUYỆT SẢN PHẨM

## 📌 Tổng Quan

Dự án Shopco sử dụng **Next.js Full-Stack** với backend được implement bằng **Next.js API Routes** (không phải Java Spring Boot). Chức năng duyệt sản phẩm bao gồm 3 tính năng chính:

1. ✅ **Filter (Lọc)** - Lọc theo category, brand, giá, màu, size, tags, search
2. ✅ **Sort (Sắp xếp)** - Sắp xếp theo giá, rating, tên, ngày tạo, độ phổ biến
3. ✅ **Pagination (Phân trang)** - Chia nhỏ danh sách sản phẩm theo trang

---

## 📁 CÁC FILE CHÍNH VÀ GIẢI THÍCH ĐỠN GIẢN

### 1. API Route - `/frontend/src/app/api/products/route.ts`

**Vai trò**: Đây là file backend chính xử lý tất cả request lấy danh sách sản phẩm.

**Chức năng**:
- Nhận request từ frontend với các tham số (filters, sort, pagination)
- Validate dữ liệu đầu vào bằng Zod schema
- Xây dựng query để tìm kiếm trong database
- Lọc sản phẩm theo các điều kiện
- Sắp xếp kết quả
- Phân trang dữ liệu
- Trả về JSON response cho frontend

**Ví dụ đơn giản**:
```
User request: "Tìm áo thun giá từ 100-500k, sắp xếp theo giá tăng dần, trang 1"
                        ↓
API Route nhận request → Tìm trong database → Trả về 12 sản phẩm đầu tiên
```

**Code quan trọng**:
```typescript
// 1. Validate input
const parsed = ProductQuerySchema.safeParse(queryParams);

// 2. Build filter conditions
const where = {
  status: "PUBLISHED",  // Chỉ lấy sản phẩm đã publish
  category: { slug: category },
  variants: { 
    some: { 
      price: { gte: minPrice, lte: maxPrice } 
    }
  }
};

// 3. Get products from database
const products = await prisma.product.findMany({
  where,
  orderBy,
  skip: (page - 1) * limit,
  take: limit
});
```

---

### 2. Service - `/frontend/src/services/product.service.ts`

**Vai trò**: Lớp trung gian giúp frontend gọi API dễ dàng hơn.

**Chức năng**:
- Xây dựng URL với query parameters
- Gọi fetch() đến API endpoint
- Xử lý response và errors
- Trả về dữ liệu cho component

**Ví dụ đơn giản**:
```
Component cần products → Gọi productService → Service gọi API → Trả về data
```

**Code quan trọng**:
```typescript
class ProductService {
  async getProducts(filters, sort, pagination) {
    // Build URL: /api/products?category=t-shirts&page=1&...
    const queryString = this.buildQueryString(filters, sort, pagination);
    const url = `${this.baseUrl}?${queryString}`;
    
    // Fetch from API
    const response = await fetch(url);
    return await response.json();
  }
}
```

---

### 3. Types - `/frontend/src/types/product.types.ts`

**Vai trò**: Định nghĩa cấu trúc dữ liệu (types) cho TypeScript.

**Chức năng**:
- Định nghĩa type cho Product, Filter, Sort, Pagination
- Giúp code an toàn hơn (type-safe)
- Hỗ trợ IntelliSense khi code

**Ví dụ đơn giản**:
```typescript
// Định nghĩa filter có những gì
export type ProductFilters = {
  category?: string;      // Lọc theo category
  minPrice?: number;      // Giá tối thiểu
  maxPrice?: number;      // Giá tối đa
  colors?: string[];      // Màu sắc
  search?: string;        // Tìm kiếm
  // ... thêm nhiều filters khác
}

// Định nghĩa sort có những gì
export type ProductSort = {
  sortBy: "price" | "rating" | "name" | "createdAt";
  sortOrder: "asc" | "desc";
}
```

---

### 4. Redux Slice - `/frontend/src/lib/features/products/productsSlice.ts`

**Vai trò**: Quản lý state (trạng thái) của filters, sort, pagination trong Redux.

**Chức năng**:
- Lưu trữ state hiện tại của filters, sort, pagination
- Cung cấp actions để update state
- Khi state thay đổi → Component tự động re-render

**Ví dụ đơn giản**:
```
User click category "T-Shirts" 
    → dispatch(setCategory("t-shirts"))
    → Redux state updated
    → Component nhận state mới
    → Fetch lại products
```

**Code quan trọng**:
```typescript
// State structure
interface ProductsState {
  filters: ProductFilters,      // Lưu tất cả filters
  sort: ProductSort,            // Lưu cách sắp xếp
  pagination: PaginationParams  // Lưu trang hiện tại
}

// Actions để update state
setFilters(filters)     // Update filters
setSort(sort)           // Update sort
setPage(page)           // Đổi trang
```

---

### 5. Hooks - `/frontend/src/lib/hooks/useProducts.ts`

**Vai trò**: Custom hooks giúp component dễ dàng sử dụng Redux state và actions.

**Chức năng**:
- Kết nối component với Redux store
- Cung cấp functions tiện lợi để update filters, sort, pagination
- Code ngắn gọn và dễ đọc hơn

**Ví dụ đơn giản**:
```typescript
// Trong component
const { filters, updateFilters, goToPage } = useProducts();

// Update filter - rất đơn giản!
updateFilters({ category: "t-shirts" });

// Chuyển trang
goToPage(2);
```

**Code quan trọng**:
```typescript
export const useProducts = () => {
  return {
    // State
    filters,
    sort,
    pagination,
    
    // Actions
    updateFilters,
    updateSort,
    goToPage,
    nextPage,
    prevPage,
    // ... many more
  }
}
```

---

### 6. Database Schema - `/frontend/prisma/schema.prisma`

**Vai trò**: Định nghĩa cấu trúc database (bảng, cột, quan hệ).

**Chức năng**:
- Định nghĩa bảng Product, Category, Brand, Tag, etc.
- Định nghĩa quan hệ giữa các bảng
- Prisma dùng file này để generate TypeScript types

**Các bảng quan trọng**:
```prisma
model Product {
  id          String        @id
  name        String        // Tên sản phẩm
  slug        String        // URL-friendly name
  description String?       // Mô tả
  status      ProductStatus // DRAFT/PUBLISHED/ARCHIVED
  
  // Quan hệ
  categoryId  String?
  category    Category?     // Thuộc category nào
  brandId     String?
  brand       Brand?        // Thuộc brand nào
  variants    ProductVariant[]  // Có nhiều variants (size, màu)
  images      ProductImage[]    // Có nhiều ảnh
  reviews     Review[]          // Có nhiều reviews
  tags        ProductTag[]      // Có nhiều tags
}

model ProductVariant {
  id            String
  productId     String
  price         Decimal     // Giá
  salePrice     Decimal?    // Giá sale
  stockQuantity Int         // Số lượng trong kho
  attributes    Json?       // { "color": "Blue", "size": "M" }
}
```

**Giải thích quan hệ**:
- 1 Product có nhiều Variants (1-to-many)
- 1 Product thuộc 1 Category (many-to-one)
- 1 Product thuộc 1 Brand (many-to-one)
- 1 Product có nhiều Tags (many-to-many)

---

### 7. Frontend Page - `/frontend/src/app/(shop)/shop/page.tsx`

**Vai trò**: Trang chính hiển thị danh sách sản phẩm cho user.

**Chức năng**:
- Hiển thị filters sidebar (desktop) hoặc mobile filters
- Hiển thị sort dropdown
- Hiển thị grid sản phẩm
- Hiển thị pagination controls
- Fetch data khi filters/sort/pagination thay đổi

**Luồng hoạt động**:
```
1. User mở trang /shop
2. Component mount → useEffect chạy
3. Fetch products từ API
4. Hiển thị products trong grid
5. User click filter/sort/pagination
6. State thay đổi → useEffect chạy lại
7. Fetch lại products với params mới
8. Update UI
```

---

## 🔄 LUỒNG HOẠT ĐỘNG TỔNG THỂW

### Khi User Filter Sản Phẩm:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER ACTION                                               │
│    User click "T-Shirts" category                           │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 2. COMPONENT (ShopPage)                                      │
│    onClick → updateCategory("t-shirts")                     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 3. HOOK (useProducts)                                        │
│    dispatch(setCategory("t-shirts"))                        │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 4. REDUX (productsSlice)                                    │
│    State updated: filters.category = "t-shirts"            │
│    Page reset to 1                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 5. COMPONENT (useEffect)                                     │
│    Detect filters changed → fetchProducts()                 │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 6. SERVICE (ProductService)                                  │
│    Build URL: /api/products?category=t-shirts&page=1       │
│    fetch(url)                                               │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 7. API ROUTE (route.ts)                                     │
│    Validate params → Build query → Query database          │
│    Transform data → Return JSON                             │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 8. DATABASE (PostgreSQL)                                     │
│    Execute query: SELECT * FROM product                     │
│    WHERE category.slug = 't-shirts'                         │
│    LIMIT 12 OFFSET 0                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 9. RESPONSE BACK TO COMPONENT                                │
│    { products: [...], pagination: {...} }                   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 10. UI UPDATE                                                │
│     Display filtered T-Shirts products                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 KIẾN TRÚC HỆ THỐNG

```
┌──────────────────────────────────────────────────────────┐
│                    USER INTERFACE                         │
│  Shop Page (page.tsx)                                     │
│  - Filters UI                                             │
│  - Sort Dropdown                                          │
│  - Products Grid                                          │
│  - Pagination                                             │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ useProducts() hook
                     │
┌────────────────────▼─────────────────────────────────────┐
│              REACT HOOKS LAYER                            │
│  useProducts.ts                                           │
│  - Kết nối với Redux                                     │
│  - Cung cấp functions tiện lợi                           │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ dispatch(actions)
                     │
┌────────────────────▼─────────────────────────────────────┐
│             REDUX STATE LAYER                             │
│  productsSlice.ts                                         │
│  - Lưu trữ state: filters, sort, pagination              │
│  - Cung cấp actions để update state                      │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ productService.getProducts()
                     │
┌────────────────────▼─────────────────────────────────────┐
│              SERVICE LAYER                                │
│  product.service.ts                                       │
│  - Build query string                                     │
│  - Gọi fetch() đến API                                   │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ HTTP GET /api/products
                     │
┌────────────────────▼─────────────────────────────────────┐
│           API ROUTES LAYER (Backend)                      │
│  route.ts                                                 │
│  - Validate input                                         │
│  - Build Prisma query                                     │
│  - Query database                                         │
│  - Transform & return data                               │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ Prisma query
                     │
┌────────────────────▼─────────────────────────────────────┐
│              DATABASE LAYER                               │
│  PostgreSQL                                               │
│  - product, category, brand, tag, ...                    │
└──────────────────────────────────────────────────────────┘
```

---

## 💡 TÍNH NĂNG CHI TIẾT

### 1. FILTER (Lọc)

**Các loại filter có sẵn**:
- ✅ Category (Danh mục): Áo, Quần, Giày, ...
- ✅ Brand (Thương hiệu): Nike, Adidas, ...
- ✅ Price Range (Khoảng giá): 100-500k
- ✅ Colors (Màu sắc): Đỏ, Xanh, ...
- ✅ Sizes (Kích thước): S, M, L, XL
- ✅ Tags (Nhãn): Sale, New, Hot, ...
- ✅ Search (Tìm kiếm): Tìm theo tên hoặc mô tả

**Cách hoạt động**:
```typescript
// User chọn filters
updateFilters({ 
  category: "t-shirts",
  minPrice: 100,
  maxPrice: 500,
  colors: ["red", "blue"]
});

// API sẽ tìm products thỏa mãn TẤT CẢ điều kiện (AND logic)
```

---

### 2. SORT (Sắp xếp)

**Các cách sắp xếp có sẵn**:
- ✅ Newest (Mới nhất)
- ✅ Most Popular (Phổ biến nhất - theo số reviews)
- ✅ Price: Low to High (Giá tăng dần)
- ✅ Price: High to Low (Giá giảm dần)
- ✅ Highest Rated (Đánh giá cao nhất)
- ✅ Name: A to Z (Tên A-Z)
- ✅ Name: Z to A (Tên Z-A)

**Cách hoạt động**:
```typescript
// User chọn sort
updateSort({ sortBy: "price", sortOrder: "asc" });

// API sẽ sắp xếp results theo giá tăng dần
```

---

### 3. PAGINATION (Phân trang)

**Thông tin pagination**:
- `page`: Trang hiện tại (bắt đầu từ 1)
- `limit`: Số sản phẩm mỗi trang (mặc định 12)
- `totalCount`: Tổng số sản phẩm
- `totalPages`: Tổng số trang
- `hasNextPage`: Có trang tiếp theo không?
- `hasPrevPage`: Có trang trước không?

**Cách hoạt động**:
```typescript
// Go to page 2
goToPage(2);

// Next page
nextPage();

// Previous page
prevPage();
```

---

## 🎯 VÍ DỤ THỰC TẾ

### Ví dụ 1: User tìm áo thun giá rẻ

```
1. User vào trang /shop
2. User click category "T-Shirts"
3. User kéo price slider: 100k - 300k
4. User chọn sort "Price: Low to High"
5. Kết quả: Hiển thị áo thun giá 100-300k, sắp xếp từ rẻ đến đắt
```

**API call tương ứng**:
```
GET /api/products?category=t-shirts&minPrice=100000&maxPrice=300000&sortBy=price&sortOrder=asc&page=1&limit=12
```

---

### Ví dụ 2: User tìm giày Nike màu đỏ

```
1. User click category "Shoes"
2. User chọn brand "Nike"
3. User chọn color "Red"
4. User chọn sort "Highest Rated"
5. Kết quả: Hiển thị giày Nike màu đỏ, sắp xếp theo rating cao nhất
```

**API call tương ứng**:
```
GET /api/products?category=shoes&brandId=nike-id&colors=red&sortBy=rating&sortOrder=desc&page=1&limit=12
```

---

## ✅ ĐIỂM MẠNH

1. ✅ **Tách biệt rõ ràng**: Mỗi layer có nhiệm vụ riêng
2. ✅ **Type-safe**: Full TypeScript, giảm bugs
3. ✅ **Dễ maintain**: Code rõ ràng, dễ đọc
4. ✅ **Dễ extend**: Thêm filter mới rất đơn giản
5. ✅ **Performance tốt**: Pagination giảm load
6. ✅ **UX tốt**: React hooks giúp state sync tự động

---

## ⚠️ HẠN CHẾ HIỆN TẠI

1. ⚠️ **Sort by price chưa chính xác**: Dùng workaround (sort by variant count)
2. ⚠️ **Không có cache**: Luôn fetch fresh data
3. ⚠️ **Search chưa có debounce**: Có thể lag khi gõ nhanh

---

## 🚀 CÁCH CHẠY VÀ TEST

### Chạy Development Server:
```bash
cd frontend
npm install
npm run dev
```

### Test API Endpoint:
```bash
# Test basic
curl http://localhost:3000/api/products

# Test với filters
curl "http://localhost:3000/api/products?category=t-shirts&minPrice=100"

# Test với sort
curl "http://localhost:3000/api/products?sortBy=price&sortOrder=asc"
```

### Test trên Browser:
1. Mở http://localhost:3000/shop
2. Click các filters bên trái
3. Chọn sort options
4. Click pagination buttons
5. Xem Network tab để thấy API calls

---

## 📚 TÀI LIỆU KHÁC

Xem thêm các file tài liệu chi tiết:

1. **PRODUCT_BROWSING_BACKEND_DOCUMENTATION.md** - Tài liệu chi tiết đầy đủ
2. **ARCHITECTURE_DIAGRAM.md** - Sơ đồ kiến trúc chi tiết
3. **QUICK_REFERENCE_GUIDE.md** - Hướng dẫn nhanh cho developers

---

## 📞 HỖ TRỢ

Nếu có câu hỏi hoặc cần giải thích thêm, vui lòng tạo issue trên GitHub hoặc liên hệ team.

---

**Tóm lại**: Backend chức năng duyệt sản phẩm được implement hoàn chỉnh với Next.js API Routes, có đầy đủ filter, sort, pagination. Code sạch, dễ hiểu, dễ maintain và extend. 🎉
