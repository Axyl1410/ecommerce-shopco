# Profile feature – overview and design

This document summarizes the Profile feature and related functions:
- Update basic user info (name, avatar)
- Manage shipping addresses (create, read, update, delete, set default)
- View activity (recent orders and product reviews)

The implementation follows clean architecture and does not change database schema or environment variables.

## Backend (Spring Boot) – responsibilities

- Controller: `ProfileController` exposes HTTP endpoints.
- Application service: `ProfileService` implements use-cases and maps entities to DTOs.
- DTOs: `UserProfileDTO`, `UpdateProfileDTO`, `AddressDTO`, `OrderSummaryDTO`, `ReviewDTO`.
- Repositories: `UserRepository`, `AddressRepository`, `OrderRepository`, `ReviewRepository`.

Key endpoints (conceptual):
- GET `/api/profile` → UserProfileDTO
- PUT `/api/profile` (UpdateProfileDTO) → UserProfileDTO
- GET `/api/profile/addresses` → AddressDTO[]
- POST `/api/profile/addresses` (AddressDTO) → AddressDTO
- PUT `/api/profile/addresses/{id}` (AddressDTO) → AddressDTO
- DELETE `/api/profile/addresses/{id}` → void
- POST `/api/profile/addresses/{id}/default` → void
- GET `/api/profile/activity` → { orders: OrderSummaryDTO[], reviews: ReviewDTO[] }

Note: In the frontend, an activity route may also be provided for SSR convenience.

## Frontend (Next.js) – responsibilities

- Server page (`app/(shop)/profile/page.tsx`) fetches profile, addresses, and activity data on the server and renders without placeholders.
- Client wrapper (`app/(shop)/profile/ProfileClient.tsx`) wires user interaction handlers.
- Components: `ProfileForm`, `AddressBook`, `ActivityHistory` in `components/profile-page/`.
- Service layer: `src/services/profile.service.ts` centralizes API calls.

## Class diagram (Profile, Address CRUD, Activity)

```mermaid
classDiagram
  direction LR

  class ProfileController {
    +getProfile(userId): UserProfileDTO
    +updateProfile(userId, dto: UpdateProfileDTO): UserProfileDTO
    +listAddresses(userId): List~AddressDTO~
    +createAddress(userId, dto: AddressDTO): AddressDTO
    +updateAddress(userId, addrId, dto: AddressDTO): AddressDTO
    +deleteAddress(userId, addrId): void
    +setDefaultAddress(userId, addrId): void
    +getActivity(userId): ActivityResponse
  }

  class ProfileService {
    +getProfile(userId): UserProfileDTO
    +updateProfile(userId, dto: UpdateProfileDTO): UserProfileDTO
    +listAddresses(userId): List~AddressDTO~
    +createAddress(userId, dto: AddressDTO): AddressDTO
    +updateAddress(userId, addrId, dto: AddressDTO): AddressDTO
    +deleteAddress(userId, addrId): void
    +setDefaultAddress(userId, addrId): void
    +getOrderSummaries(userId): List~OrderSummaryDTO~
    +getReviews(userId): List~ReviewDTO~
  }

  ProfileController --> ProfileService

  class ActivityResponse {
    +orders: List~OrderSummaryDTO~
    +reviews: List~ReviewDTO~
  }

  class User {
    +id: UUID
    +name: String
    +email: String
    +avatarUrl: String?
  }

  class Address {
    +id: UUID
    +userId: UUID
    +fullName: String
    +phone: String
    +line1: String
    +line2: String?
    +city: String
    +state: String?
    +postalCode: String
    +country: String
    +isDefault: boolean
    +createdAt: Instant
  }

  class Order {
    +id: UUID
    +userId: UUID
    +total: Decimal
    +status: OrderStatus
    +createdAt: Instant
  }

  class Review {
    +id: UUID
    +userId: UUID
    +productId: UUID
    +rating: int
    +comment: String?
    +createdAt: Instant
  }

  class UserProfileDTO { +name: String; +email: String; +avatarUrl: String? }
  class UpdateProfileDTO { +name: String; +avatarUrl: String? }
  class AddressDTO { +id: UUID; +...fields; +isDefault: boolean }
  class OrderSummaryDTO { +id: UUID; +total: Decimal; +status: OrderStatus; +createdAt: Instant }
  class ReviewDTO { +id: UUID; +productId: UUID; +rating: int; +createdAt: Instant }

  ProfileService --> User : reads/writes
  ProfileService --> Address : CRUD
  ProfileService --> Order : read summaries
  ProfileService --> Review : read

  class UserRepository
  class AddressRepository
  class OrderRepository
  class ReviewRepository

  ProfileService --> UserRepository
  ProfileService --> AddressRepository
  ProfileService --> OrderRepository
  ProfileService --> ReviewRepository

  UserRepository ..> User
  AddressRepository ..> Address
  OrderRepository ..> Order
  ReviewRepository ..> Review
```

## Notes
- Single default address per user is enforced by the service (clears other defaults when setting one).
- Avatar is handled as a URL string; the UI supports client-side base64 conversion for previews/uploads.
- The design is additive; existing schema and environment configuration remain unchanged.

## Use cases (Hồ sơ người dùng)

### UC-01: Mở trang Hồ sơ (Open Profile)

- Diễn viên chính: Người dùng đã đăng nhập
- Tiền điều kiện:
  - Phiên đăng nhập còn hiệu lực.
  - Người dùng tồn tại trong hệ thống.
- Kích hoạt: Người dùng truy cập trang `Profile` từ menu hoặc URL trực tiếp.
- Luồng thành công chính:
  1. Hệ thống tải dữ liệu hồ sơ, danh sách địa chỉ, và lịch sử hoạt động (đơn hàng, đánh giá).
  2. Hệ thống hiển thị trang Hồ sơ với thông tin người dùng, địa chỉ, và hoạt động gần đây.
- Ngoại lệ/nhánh rẽ:
  - 1a. Chưa đăng nhập → chuyển hướng tới trang đăng nhập hoặc trả về 401.
  - 1b. Lỗi tải dữ liệu phụ (addresses/activity) → hiển thị phần dữ liệu đó rỗng và thông báo nhẹ.
- Hậu điều kiện: Trang hiển thị ổn định, sẵn sàng cho các thao tác chỉnh sửa/quản lý địa chỉ.

### UC-02: Xem hồ sơ (View Profile)

- Diễn viên chính: Người dùng đã đăng nhập
- Tiền điều kiện: Tài khoản hợp lệ; dữ liệu hồ sơ tồn tại.
- Kích hoạt: Trang Hồ sơ được mở (UC-01) hoặc người dùng chuyển sang tab “Thông tin”.
- Luồng thành công chính:
  1. Hệ thống hiển thị tên, email, ảnh đại diện, ngày tạo/cập nhật.
  2. Nếu thiếu ảnh đại diện, hiển thị ảnh mặc định.
- Ngoại lệ:
  - 1a. Hồ sơ không tồn tại (case hiếm) → hiển thị thông báo và đề xuất liên hệ hỗ trợ.
- Hậu điều kiện: Không thay đổi dữ liệu.

### UC-03: Chỉnh sửa hồ sơ (Edit Profile)

- Diễn viên chính: Người dùng đã đăng nhập
- Tiền điều kiện: Xem hồ sơ thành công (UC-02).
- Kích hoạt: Người dùng nhấn “Chỉnh sửa”/“Sửa hồ sơ”.
- Luồng thành công chính:
  1. Hệ thống hiển thị form với các trường hiện tại (Tên, Ảnh đại diện URL).
  2. Người dùng cập nhật trường hợp lệ.
  3. Hệ thống kiểm tra ràng buộc client-side (tối thiểu 2 ký tự cho tên, URL hợp lệ cho avatar nếu có).
- Ngoại lệ:
  - 3a. Dữ liệu không hợp lệ → hiển thị lỗi tại chỗ, không cho phép lưu.
  - 3b. Mất kết nối → hiển thị thông báo, cho phép thử lại.
- Hậu điều kiện: Dữ liệu tạm thời trong form; chưa lưu.

### UC-04: Lưu hồ sơ (Save Profile)

- Diễn viên chính: Người dùng đã đăng nhập
- Tiền điều kiện: Đang ở form chỉnh sửa (UC-03) với dữ liệu hợp lệ.
- Kích hoạt: Người dùng nhấn “Lưu”.
- Luồng thành công chính:
  1. Hệ thống gửi yêu cầu cập nhật hồ sơ.
  2. Hệ thống cập nhật tên/ảnh đại diện và trả về dữ liệu mới.
  3. UI hiển thị thông báo thành công và cập nhật giao diện.
- Ngoại lệ:
  - 1a. Không có quyền (401/403) → yêu cầu đăng nhập lại hoặc thông báo quyền.
  - 1b. Xung đột dữ liệu/validation backend → hiển thị lỗi cụ thể, giữ nguyên form để sửa.
- Hậu điều kiện: Hồ sơ được cập nhật; thời gian cập nhật thay đổi.

### UC-05: Đặt địa chỉ mặc định (Set Default Address)

- Diễn viên chính: Người dùng đã đăng nhập
- Tiền điều kiện:
  - Người dùng có ít nhất 1 địa chỉ.
  - Danh sách địa chỉ đã được tải.
- Kích hoạt: Người dùng chọn một địa chỉ và nhấn “Đặt mặc định”.
- Luồng thành công chính:
  1. Hệ thống gửi yêu cầu đặt mặc định cho địa chỉ được chọn.
  2. Hệ thống bỏ cờ mặc định của các địa chỉ khác và đặt cờ mặc định cho địa chỉ được chọn.
  3. UI cập nhật trạng thái: địa chỉ được đánh dấu là mặc định, các địa chỉ khác bỏ đánh dấu.
- Ngoại lệ:
  - 1a. Địa chỉ không thuộc người dùng → trả 404, UI hiển thị thông báo “Không tìm thấy”.
  - 1b. ID rỗng/không hợp lệ → trả 400, UI hiển thị lỗi hợp lệ hóa.
- Hậu điều kiện: Chính xác một địa chỉ được đánh dấu mặc định.

### UC-06A: Tạo địa chỉ (Create Address)

- Diễn viên chính: Người dùng đã đăng nhập
- Tiền điều kiện: Dữ liệu địa chỉ hợp lệ (họ tên, điện thoại, địa chỉ, tỉnh/thành, quận/huyện, thành phố, mã bưu chính tùy chọn).
- Kích hoạt: Người dùng mở form “Thêm địa chỉ” và nhấn “Lưu”.
- Luồng thành công chính:
  1. Hệ thống kiểm tra hợp lệ phía server.
  2. Nếu người dùng chọn “Đặt làm mặc định”, hệ thống bỏ cờ mặc định của các địa chỉ khác.
  3. Hệ thống tạo địa chỉ mới và trả về.
  4. UI chèn địa chỉ mới vào danh sách theo thứ tự (mặc định trước, sau đó theo ngày tạo giảm dần).
- Ngoại lệ:
  - 1a. Dữ liệu không hợp lệ → trả 400 + chi tiết, UI hiển thị lỗi.
  - 2a. Lỗi mạng → cho phép thử lại.
- Hậu điều kiện: Địa chỉ mới được lưu; danh sách địa chỉ cập nhật.

### UC-06B: Xem danh sách địa chỉ (List Addresses)

- Diễn viên chính: Người dùng đã đăng nhập
- Tiền điều kiện: Có thể có 0..n địa chỉ.
- Kích hoạt: Vào tab “Địa chỉ” hoặc mở trang Hồ sơ (UC-01).
- Luồng thành công chính:
  1. Hệ thống trả về danh sách địa chỉ, sắp xếp mặc định trước, sau đó theo ngày tạo giảm dần.
  2. UI hiển thị địa chỉ, đánh dấu “Mặc định” nếu có.
- Ngoại lệ: Lỗi tải dữ liệu → hiển thị trạng thái rỗng và nút “Tải lại”.
- Hậu điều kiện: Không thay đổi dữ liệu.

### UC-06C: Cập nhật địa chỉ (Update Address)

- Diễn viên chính: Người dùng đã đăng nhập
- Tiền điều kiện: Địa chỉ thuộc về người dùng; form dữ liệu hợp lệ.
- Kích hoạt: Người dùng chỉnh sửa địa chỉ và nhấn “Lưu”.
- Luồng thành công chính:
  1. Hệ thống kiểm tra quyền sở hữu và hợp lệ dữ liệu.
  2. Nếu bật “Mặc định”, hệ thống bỏ cờ mặc định các địa chỉ khác của người dùng.
  3. Hệ thống lưu và trả về địa chỉ đã cập nhật.
  4. UI cập nhật phần tử tương ứng trong danh sách.
- Ngoại lệ:
  - 1a. Không tìm thấy/không thuộc người dùng → 404.
  - 1b. Dữ liệu không hợp lệ → 400.
- Hậu điều kiện: Địa chỉ được cập nhật; đảm bảo quy tắc một mặc định.

### UC-06D: Xóa địa chỉ (Delete Address)

- Diễn viên chính: Người dùng đã đăng nhập
- Tiền điều kiện: Địa chỉ thuộc về người dùng.
- Kích hoạt: Người dùng nhấn “Xóa” trên một địa chỉ và xác nhận.
- Luồng thành công chính:
  1. Hệ thống xác nhận quyền sở hữu, xóa địa chỉ.
  2. UI loại bỏ địa chỉ khỏi danh sách.
- Ngoại lệ:
  - 1a. Không tìm thấy/không thuộc người dùng → 404.
  - 1b. Địa chỉ mặc định bị xóa → cho phép xóa, không còn mặc định cho tới khi người dùng đặt địa chỉ khác (hoặc theo rule khác nếu yêu cầu).
- Hậu điều kiện: Địa chỉ bị xóa khỏi hệ thống.

### UC-07: Xem hoạt động (View Activities)

- Diễn viên chính: Người dùng đã đăng nhập
- Tiền điều kiện: Có thể có 0..n đơn hàng/đánh giá.
- Kích hoạt: Người dùng mở tab “Hoạt động” hoặc trang Hồ sơ (UC-01).
- Luồng thành công chính:
  1. Hệ thống trả về danh sách đơn hàng gần đây (mã đơn, ngày tạo, tổng tiền, trạng thái, số lượng dòng hàng).
  2. Hệ thống trả về danh sách đánh giá (sản phẩm, sao, tiêu đề, nội dung, ngày tạo).
  3. UI hiển thị theo thứ tự thời gian, có phân trang/giới hạn hiển thị.
- Ngoại lệ:
  - 1a. Không có dữ liệu → hiển thị trạng thái trống.
  - 1b. Lỗi tải dữ liệu → hiển thị thông báo và nút “Thử lại”.
- Hậu điều kiện: Không thay đổi dữ liệu.

### Quy tắc nghiệp vụ & ràng buộc

- Chỉ có duy nhất một địa chỉ mặc định cho mỗi người dùng.
- Kiểm tra hợp lệ:
  - Tên: tối thiểu 2 ký tự.
  - Số điện thoại: tối thiểu 8 ký tự (điều chỉnh theo locale nếu cần).
  - Trường địa chỉ: không rỗng (đường, thành phố, quận/huyện, tỉnh/thành; mã bưu chính tùy chọn).
  - Avatar URL: nếu cung cấp phải là URL hợp lệ.
- Bảo mật và quyền hạn:
  - Mọi thao tác profile/địa chỉ/hoạt động yêu cầu người dùng đăng nhập.
  - Chỉ thao tác trên dữ liệu thuộc về chính người dùng đó.
- Hiệu năng/UX:
  - Ưu tiên SSR cho lần tải đầu để tránh nháy màn hình.
  - Địa chỉ sắp xếp: mặc định trước, sau đó theo ngày tạo giảm dần.
  - Hoạt động giới hạn số bản ghi (ví dụ: 20 gần nhất); có thể phân trang hoặc tải thêm.
