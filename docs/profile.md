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