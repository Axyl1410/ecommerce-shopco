# 📚 Chỉ Mục Tài Liệu / Documentation Index

## Tài Liệu Backend - Chức Năng Duyệt Sản Phẩm
## Backend Documentation - Product Browsing Feature

---

## 🎯 Chọn Tài Liệu Phù Hợp / Choose Your Documentation

### 🇻🇳 Muốn đọc tiếng Việt? (Vietnamese Speakers)
**👉 [TOM_TAT_BACKEND_DUYET_SAN_PHAM.md](./TOM_TAT_BACKEND_DUYET_SAN_PHAM.md)**
- ✅ Tóm tắt dễ hiểu bằng tiếng Việt
- ✅ Giải thích đơn giản từng file
- ✅ Ví dụ thực tế
- ✅ Phù hợp cho người mới bắt đầu

---

### 🌍 English Speakers?

#### 📖 Tài Liệu Chi Tiết / Detailed Documentation
**👉 [PRODUCT_BROWSING_BACKEND_DOCUMENTATION.md](./PRODUCT_BROWSING_BACKEND_DOCUMENTATION.md)**
- ✅ Complete technical documentation
- ✅ File-by-file explanation
- ✅ Features: Filter, Sort, Pagination
- ✅ API formats and examples
- ✅ Strengths and limitations
- ✅ Testing guide

#### 🗺️ Sơ Đồ Kiến Trúc / Architecture Diagrams
**👉 [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)**
- ✅ Overall architecture diagram
- ✅ Detailed data flow
- ✅ Database relationships
- ✅ Component interactions
- ✅ Request/response cycles
- ✅ Type system architecture

#### ⚡ Hướng Dẫn Nhanh / Quick Reference
**👉 [QUICK_REFERENCE_GUIDE.md](./QUICK_REFERENCE_GUIDE.md)**
- ✅ Quick reference for developers
- ✅ Common functions & usage
- ✅ Code examples
- ✅ Testing examples
- ✅ Common issues & solutions
- ✅ API endpoints reference

---

## 📋 Tổng Quan Nội Dung / Content Overview

### Chức Năng Được Tài Liệu Hóa / Documented Features

#### 1. ✅ **FILTER (Lọc Sản Phẩm)**
- Filter by category (theo danh mục)
- Filter by brand (theo thương hiệu)
- Filter by price range (theo khoảng giá)
- Filter by colors (theo màu sắc)
- Filter by sizes (theo kích thước)
- Filter by tags (theo nhãn)
- Filter by search (tìm kiếm văn bản)

#### 2. ✅ **SORT (Sắp Xếp)**
- Sort by price (theo giá)
- Sort by rating (theo đánh giá)
- Sort by name (theo tên)
- Sort by date (theo ngày tạo)
- Sort by popularity (theo độ phổ biến)

#### 3. ✅ **PAGINATION (Phân Trang)**
- Page navigation (điều hướng trang)
- Items per page (số item/trang)
- Total count (tổng số)
- Next/Previous controls (điều khiển)

---

## 🗂️ Files Được Phân Tích / Analyzed Files

### Backend/API Layer
```
frontend/src/app/api/products/route.ts
└─ Main API endpoint (Next.js API Route)
   - Handles GET requests
   - Validates input with Zod
   - Builds Prisma queries
   - Returns paginated JSON response
```

### Service Layer
```
frontend/src/services/product.service.ts
└─ ProductService class
   - Wraps API calls
   - Builds query strings
   - Handles responses & errors
```

### Type Definitions
```
frontend/src/types/product.types.ts
└─ TypeScript types
   - ProductDetail, ProductFilters
   - ProductSort, PaginationParams
   - PaginatedProductsResponse
```

### State Management
```
frontend/src/lib/features/products/productsSlice.ts
└─ Redux Toolkit slice
   - Manages filters, sort, pagination state
   - Provides actions for updates
   - Auto-resets page on filter changes
```

### Custom Hooks
```
frontend/src/lib/hooks/useProducts.ts
└─ React hooks
   - useProductFilters()
   - useProductSort()
   - useProductPagination()
   - useProducts() (combined)
```

### Database Schema
```
frontend/prisma/schema.prisma
└─ Prisma schema
   - Product, ProductVariant models
   - Category, Brand, Tag models
   - Relationships definition
```

### Frontend Page
```
frontend/src/app/(shop)/shop/page.tsx
└─ Main shop page
   - Displays product grid
   - Filters sidebar
   - Pagination controls
```

---

## 🏗️ Kiến Trúc / Architecture

```
┌─────────────────────────────────────────────────┐
│           USER INTERFACE (Browser)              │
│        Shop Page with Filters & Products        │
└────────────────────┬────────────────────────────┘
                     │ useProducts() hook
┌────────────────────▼────────────────────────────┐
│              REACT HOOKS LAYER                   │
│         Connects to Redux Store                  │
└────────────────────┬────────────────────────────┘
                     │ dispatch(actions)
┌────────────────────▼────────────────────────────┐
│             REDUX STATE LAYER                    │
│    Stores: filters, sort, pagination            │
└────────────────────┬────────────────────────────┘
                     │ productService.getProducts()
┌────────────────────▼────────────────────────────┐
│              SERVICE LAYER                       │
│         Builds & executes API calls             │
└────────────────────┬────────────────────────────┘
                     │ HTTP GET /api/products
┌────────────────────▼────────────────────────────┐
│         API ROUTES LAYER (Backend)              │
│      Validates, Queries, Transforms Data        │
└────────────────────┬────────────────────────────┘
                     │ Prisma query
┌────────────────────▼────────────────────────────┐
│           DATABASE LAYER                         │
│      PostgreSQL with Prisma ORM                 │
└─────────────────────────────────────────────────┘
```

---

## 📖 Đọc Theo Thứ Tự / Reading Order

### Cho Người Mới / For Beginners:
1. **[TOM_TAT_BACKEND_DUYET_SAN_PHAM.md](./TOM_TAT_BACKEND_DUYET_SAN_PHAM.md)** - Tóm tắt tiếng Việt
2. **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** - Xem sơ đồ
3. **[QUICK_REFERENCE_GUIDE.md](./QUICK_REFERENCE_GUIDE.md)** - Hướng dẫn thực hành

### Cho Developer Có Kinh Nghiệm / For Experienced Developers:
1. **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** - Hiểu kiến trúc tổng thể
2. **[PRODUCT_BROWSING_BACKEND_DOCUMENTATION.md](./PRODUCT_BROWSING_BACKEND_DOCUMENTATION.md)** - Chi tiết technical
3. **[QUICK_REFERENCE_GUIDE.md](./QUICK_REFERENCE_GUIDE.md)** - Reference khi code

---

## 🔍 Tìm Thông Tin Cụ Thể / Find Specific Information

| Bạn muốn biết... | Đọc file... |
|------------------|-------------|
| **Cách filter hoạt động** | TOM_TAT (phần Filter) hoặc PRODUCT_BROWSING (section "Filtering") |
| **Cách sort hoạt động** | TOM_TAT (phần Sort) hoặc PRODUCT_BROWSING (section "Sorting") |
| **Cách pagination hoạt động** | TOM_TAT (phần Pagination) hoặc PRODUCT_BROWSING (section "Pagination") |
| **Luồng dữ liệu end-to-end** | ARCHITECTURE_DIAGRAM (Detailed Data Flow) |
| **Database schema** | ARCHITECTURE_DIAGRAM (Database Relationships) hoặc PRODUCT_BROWSING (Database Layer) |
| **Code examples** | QUICK_REFERENCE_GUIDE (Code Examples section) |
| **API endpoints** | QUICK_REFERENCE_GUIDE (Testing Examples) |
| **Common issues** | QUICK_REFERENCE_GUIDE (Common Issues & Solutions) |
| **Cách test** | QUICK_REFERENCE_GUIDE (Testing Examples) hoặc PRODUCT_BROWSING (How to Test) |

---

## 🚀 Quick Start

### 1. Đọc Tổng Quan / Read Overview
```bash
# Vietnamese
cat TOM_TAT_BACKEND_DUYET_SAN_PHAM.md

# English
cat PRODUCT_BROWSING_BACKEND_DOCUMENTATION.md
```

### 2. Xem Sơ Đồ / View Diagrams
```bash
cat ARCHITECTURE_DIAGRAM.md
```

### 3. Bắt Đầu Code / Start Coding
```bash
# Open quick reference
cat QUICK_REFERENCE_GUIDE.md

# Run the app
cd frontend
npm install
npm run dev

# Visit http://localhost:3000/shop
```

### 4. Test API
```bash
# Test basic endpoint
curl http://localhost:3000/api/products

# Test with filters
curl "http://localhost:3000/api/products?category=t-shirts&sortBy=price&sortOrder=asc"
```

---

## 💡 Tips

- 📱 **Đang dùng mobile?** Đọc TOM_TAT_BACKEND_DUYET_SAN_PHAM.md - ngắn gọn, dễ đọc
- 💻 **Đang code?** Mở QUICK_REFERENCE_GUIDE.md bên cạnh code editor
- 🎓 **Đang học?** Đọc PRODUCT_BROWSING_BACKEND_DOCUMENTATION.md từ đầu đến cuối
- 🏗️ **Đang thiết kế?** Xem ARCHITECTURE_DIAGRAM.md để hiểu flow

---

## 📞 Support / Hỗ Trợ

Nếu có câu hỏi hoặc cần giải thích thêm:
1. Tạo issue trên GitHub
2. Liên hệ team qua email
3. Check existing issues để xem có ai hỏi tương tự chưa

---

## 📝 Contributing

Muốn cải thiện tài liệu?
1. Fork repository
2. Chỉnh sửa tài liệu
3. Tạo Pull Request
4. Mô tả rõ những gì đã thay đổi

---

## ⭐ Quick Links

- **🏠 Main README**: [README.md](./README.md)
- **🇻🇳 Tóm Tắt Tiếng Việt**: [TOM_TAT_BACKEND_DUYET_SAN_PHAM.md](./TOM_TAT_BACKEND_DUYET_SAN_PHAM.md)
- **📖 Full Documentation**: [PRODUCT_BROWSING_BACKEND_DOCUMENTATION.md](./PRODUCT_BROWSING_BACKEND_DOCUMENTATION.md)
- **🗺️ Architecture**: [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)
- **⚡ Quick Reference**: [QUICK_REFERENCE_GUIDE.md](./QUICK_REFERENCE_GUIDE.md)

---

**Happy Coding! 🎉 Chúc code vui vẻ! 🚀**
