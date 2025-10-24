# Database Seeding

This directory contains the database seeding script for the ShopCo e-commerce application.

## Overview

The seed file (`seed.ts`) populates the database with sample data for development and testing purposes. It includes:

- **Users**: Admin and customer accounts
- **Categories**: Hierarchical product categories
- **Brands**: Fashion brands (Zara, Gucci, Prada)
- **Products**: Sample products with variants
- **Orders**: Complete order workflow
- **Coupons**: Discount codes and promotions
- **Reviews**: Product reviews
- **Static Content**: Pages and banners

## Prerequisites

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up your database connection in `.env`:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/shopco_db"
   ```

3. Generate Prisma client:
   ```bash
   pnpm generate
   ```

## Running the Seed

### Option 1: Using npm/pnpm scripts

```bash
# Run the seed script
pnpm seed

# Or use the alternative command
pnpm db:seed
```

### Option 2: Direct execution

```bash
# Using tsx
npx tsx prisma/seed.ts

# Or using ts-node
npx ts-node prisma/seed.ts
```

## What Gets Created

The seed script creates the following data:

### Users (3)

- 1 Admin user (`admin@shopco.com`)
- 2 Customer users (`john@example.com`, `jane@example.com`)

### Categories (4)

- Fashion (parent)
  - Women (child)
    - Dresses (grandchild)
  - Men (child)

### Brands (3)

- Zara
- Gucci
- Prada

### Products (3)

- Elegant Summer Dress (Zara)
- Classic White Shirt (Gucci)
- Luxury Handbag (Prada)

### Product Variants (4)

- Different sizes and colors for each product

### Orders (1)

- Complete order with payment and status history

### Coupons (2)

- `SUMMER20`: 20% off summer collection
- `FREESHIP`: Free shipping on orders over $50

### Additional Data

- Product images
- Cart items
- Reviews
- Wishlist items
- Static pages
- Banners
- Audit logs

## Data Relationships

The seed script maintains proper relationships between all entities:

- Users have addresses, carts, orders, and reviews
- Products belong to categories and brands
- Orders contain order items with product variants
- Coupons can be applied to specific products/categories
- Reviews are linked to order items for verification

## Customization

You can modify the seed file to:

1. **Add more sample data**: Extend the existing data arrays
2. **Change data values**: Modify product names, prices, descriptions
3. **Add new entities**: Create additional models and relationships
4. **Modify relationships**: Change how entities are connected

## Important Notes

- The seed script **clears all existing data** before inserting new data
- All IDs are hardcoded for consistency and easier testing
- Images use Unsplash URLs for demonstration purposes
- Passwords are hashed using bcryptjs
- All timestamps are set to realistic values

## Troubleshooting

### Common Issues

1. **Database connection error**: Check your `DATABASE_URL` in `.env`
2. **Prisma client not found**: Run `pnpm generate` first
3. **Permission denied**: Ensure your database user has CREATE/INSERT permissions
4. **Foreign key constraints**: The script deletes data in the correct order to avoid constraint violations

### Reset Database

To completely reset the database:

```bash
# Reset the database (this will delete all data)
npx prisma db push --force-reset

# Then run the seed
pnpm seed
```

## Development Workflow

1. Make changes to the Prisma schema
2. Run `pnpm generate` to update the client
3. Run `pnpm db:push` to apply schema changes
4. Run `pnpm seed` to populate with fresh data
5. Use `pnpm studio` to view the data in Prisma Studio
