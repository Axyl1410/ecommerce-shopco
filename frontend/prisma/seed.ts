import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data (in reverse order of dependencies)
  console.log("🧹 Cleaning existing data...");
  await prisma.auditLog.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.staticPage.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.couponExcludedCategory.deleteMany();
  await prisma.couponExcludedProduct.deleteMany();
  await prisma.couponApplicableCategory.deleteMany();
  await prisma.couponApplicableProduct.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  //   // 1. Create Users
  //   console.log("👤 Creating users...");
  //   const hashedPassword = await hash("password123", 12);

  //   const adminUser = await prisma.user.create({
  //     data: {
  //       id: "admin-001",
  //       name: "Admin User",
  //       email: "admin@shopco.com",
  //       emailVerified: true,
  //       image:
  //         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  //       role: "admin",
  //       banned: false,
  //     },
  //   });

  //   const customerUser = await prisma.user.create({
  //     data: {
  //       id: "customer-001",
  //       name: "John Doe",
  //       email: "john@example.com",
  //       emailVerified: true,
  //       image:
  //         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  //       role: "user",
  //       banned: false,
  //     },
  //   });

  //   const customerUser2 = await prisma.user.create({
  //     data: {
  //       id: "customer-002",
  //       name: "Jane Smith",
  //       email: "jane@example.com",
  //       emailVerified: true,
  //       image:
  //         "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  //       role: "user",
  //       banned: false,
  //     },
  //   });

  //   // 2. Create Sessions
  //   console.log("🔐 Creating sessions...");
  //   await prisma.session.create({
  //     data: {
  //       id: "session-001",
  //       expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  //       token: "session-token-001",
  //       userId: adminUser.id,
  //       ipAddress: "192.168.1.1",
  //       userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  //     },
  //   });

  //   // 3. Create Accounts
  //   console.log("🔑 Creating accounts...");
  //   await prisma.account.create({
  //     data: {
  //       id: "account-001",
  //       accountId: "admin-account",
  //       providerId: "credentials",
  //       userId: adminUser.id,
  //       password: hashedPassword,
  //     },
  //   });

  //   // 4. Create Addresses
  //   console.log("📍 Creating addresses...");
  //   await prisma.address.create({
  //     data: {
  //       id: "addr-001",
  //       userId: customerUser.id,
  //       name: "John Doe",
  //       phone: "0901234567",
  //       addressLine: "123 Main Street",
  //       city: "Ho Chi Minh City",
  //       district: "District 1",
  //       province: "Ward 1",
  //       postalCode: "700000",
  //       isDefault: true,
  //     },
  //   });

  //   await prisma.address.create({
  //     data: {
  //       id: "addr-002",
  //       userId: customerUser2.id,
  //       name: "Jane Smith",
  //       phone: "0907654321",
  //       addressLine: "456 Oak Avenue",
  //       city: "Hanoi",
  //       district: "Ba Dinh",
  //       province: "Dien Bien",
  //       postalCode: "100000",
  //       isDefault: true,
  //     },
  //   });

  //   // 5. Create Categories
  //   console.log("📂 Creating categories...");
  //   const parentCategory = await prisma.category.create({
  //     data: {
  //       id: "cat-001",
  //       name: "Fashion",
  //       slug: "fashion",
  //       description: "All fashion items",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
  //       active: true,
  //     },
  //   });

  //   const womenCategory = await prisma.category.create({
  //     data: {
  //       id: "cat-002",
  //       name: "Women",
  //       slug: "women",
  //       description: "Women's clothing and accessories",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop",
  //       parentId: parentCategory.id,
  //       active: true,
  //     },
  //   });

  //   const menCategory = await prisma.category.create({
  //     data: {
  //       id: "cat-003",
  //       name: "Men",
  //       slug: "men",
  //       description: "Men's clothing and accessories",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
  //       parentId: parentCategory.id,
  //       active: true,
  //     },
  //   });

  //   const dressCategory = await prisma.category.create({
  //     data: {
  //       id: "cat-004",
  //       name: "Dresses",
  //       slug: "dresses",
  //       description: "Beautiful dresses for every occasion",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop",
  //       parentId: womenCategory.id,
  //       active: true,
  //     },
  //   });

  //   // 6. Create Brands
  //   console.log("🏷️ Creating brands...");
  //   const zaraBrand = await prisma.brand.create({
  //     data: {
  //       id: "brand-001",
  //       name: "Zara",
  //       slug: "zara",
  //       description: "Spanish fast fashion brand",
  //       logoUrl:
  //         "https://logos-world.net/wp-content/uploads/2020/04/Zara-Logo.png",
  //       active: true,
  //     },
  //   });

  //   const gucciBrand = await prisma.brand.create({
  //     data: {
  //       id: "brand-002",
  //       name: "Gucci",
  //       slug: "gucci",
  //       description: "Italian luxury fashion brand",
  //       logoUrl:
  //         "https://logos-world.net/wp-content/uploads/2020/04/Gucci-Logo.png",
  //       active: true,
  //     },
  //   });

  //   const pradaBrand = await prisma.brand.create({
  //     data: {
  //       id: "brand-003",
  //       name: "Prada",
  //       slug: "prada",
  //       description: "Italian luxury fashion house",
  //       logoUrl:
  //         "https://logos-world.net/wp-content/uploads/2020/04/Prada-Logo.png",
  //       active: true,
  //     },
  //   });

  //   // 7. Create Tags
  //   console.log("🏷️ Creating tags...");
  //   const summerTag = await prisma.tag.create({
  //     data: {
  //       id: "tag-001",
  //       name: "Summer",
  //       slug: "summer",
  //     },
  //   });

  //   const casualTag = await prisma.tag.create({
  //     data: {
  //       id: "tag-002",
  //       name: "Casual",
  //       slug: "casual",
  //     },
  //   });

  //   const formalTag = await prisma.tag.create({
  //     data: {
  //       id: "tag-003",
  //       name: "Formal",
  //       slug: "formal",
  //     },
  //   });

  //   // 8. Create Products
  //   console.log("👕 Creating products...");
  //   const product1 = await prisma.product.create({
  //     data: {
  //       id: "prod-001",
  //       name: "Elegant Summer Dress",
  //       slug: "elegant-summer-dress",
  //       description:
  //         "A beautiful summer dress perfect for any occasion. Made with high-quality materials and designed for comfort.",
  //       brandId: zaraBrand.id,
  //       categoryId: dressCategory.id,
  //       defaultImage:
  //         "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
  //       seoMetaTitle: "Elegant Summer Dress - ShopCo",
  //       seoMetaDesc:
  //         "Shop the latest elegant summer dress collection at ShopCo. High quality, stylish designs.",
  //       status: "PUBLISHED",
  //     },
  //   });

  //   const product2 = await prisma.product.create({
  //     data: {
  //       id: "prod-002",
  //       name: "Classic White Shirt",
  //       slug: "classic-white-shirt",
  //       description:
  //         "A timeless classic white shirt that never goes out of style. Perfect for both casual and formal occasions.",
  //       brandId: gucciBrand.id,
  //       categoryId: menCategory.id,
  //       defaultImage:
  //         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
  //       seoMetaTitle: "Classic White Shirt - ShopCo",
  //       seoMetaDesc:
  //         "Discover our collection of classic white shirts. Premium quality and timeless style.",
  //       status: "PUBLISHED",
  //     },
  //   });

  //   const product3 = await prisma.product.create({
  //     data: {
  //       id: "prod-003",
  //       name: "Luxury Handbag",
  //       slug: "luxury-handbag",
  //       description:
  //         "An exquisite luxury handbag crafted with the finest materials. A statement piece for any outfit.",
  //       brandId: pradaBrand.id,
  //       categoryId: womenCategory.id,
  //       defaultImage:
  //         "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
  //       seoMetaTitle: "Luxury Handbag - ShopCo",
  //       seoMetaDesc:
  //         "Shop luxury handbags from top designer brands. Premium quality and exclusive designs.",
  //       status: "PUBLISHED",
  //     },
  //   });

  //   // 9. Create Product Tags
  //   console.log("🏷️ Creating product tags...");
  //   await prisma.productTag.create({
  //     data: {
  //       productId: product1.id,
  //       tagId: summerTag.id,
  //     },
  //   });

  //   await prisma.productTag.create({
  //     data: {
  //       productId: product1.id,
  //       tagId: casualTag.id,
  //     },
  //   });

  //   await prisma.productTag.create({
  //     data: {
  //       productId: product2.id,
  //       tagId: formalTag.id,
  //     },
  //   });

  //   // 10. Create Product Variants
  //   console.log("📦 Creating product variants...");
  //   const variant1 = await prisma.productVariant.create({
  //     data: {
  //       id: "var-001",
  //       productId: product1.id,
  //       sku: "ESD-SM-BL",
  //       attributes: {
  //         color: "Blue",
  //         size: "S",
  //       },
  //       price: 89.99,
  //       salePrice: 69.99,
  //       stockQuantity: 50,
  //       weight: 0.5,
  //       barcode: "1234567890123",
  //     },
  //   });

  //   const variant2 = await prisma.productVariant.create({
  //     data: {
  //       id: "var-002",
  //       productId: product1.id,
  //       sku: "ESD-MD-BL",
  //       attributes: {
  //         color: "Blue",
  //         size: "M",
  //       },
  //       price: 89.99,
  //       salePrice: 69.99,
  //       stockQuantity: 30,
  //       weight: 0.5,
  //       barcode: "1234567890124",
  //     },
  //   });

  //   const variant3 = await prisma.productVariant.create({
  //     data: {
  //       id: "var-003",
  //       productId: product2.id,
  //       sku: "CWS-SM-WH",
  //       attributes: {
  //         color: "White",
  //         size: "S",
  //       },
  //       price: 129.99,
  //       stockQuantity: 25,
  //       weight: 0.3,
  //       barcode: "1234567890125",
  //     },
  //   });

  //   const variant4 = await prisma.productVariant.create({
  //     data: {
  //       id: "var-004",
  //       productId: product3.id,
  //       sku: "LHB-BLK",
  //       attributes: {
  //         color: "Black",
  //         material: "Leather",
  //       },
  //       price: 899.99,
  //       stockQuantity: 10,
  //       weight: 1.2,
  //       barcode: "1234567890126",
  //     },
  //   });

  //   // 11. Create Product Images
  //   console.log("🖼️ Creating product images...");
  //   await prisma.productImage.create({
  //     data: {
  //       id: "img-001",
  //       productId: product1.id,
  //       variantId: variant1.id,
  //       url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
  //       altText: "Elegant Summer Dress in Blue - Size Small",
  //       sortOrder: 1,
  //     },
  //   });

  //   await prisma.productImage.create({
  //     data: {
  //       id: "img-002",
  //       productId: product1.id,
  //       variantId: variant2.id,
  //       url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
  //       altText: "Elegant Summer Dress in Blue - Size Medium",
  //       sortOrder: 2,
  //     },
  //   });

  //   await prisma.productImage.create({
  //     data: {
  //       id: "img-003",
  //       productId: product2.id,
  //       variantId: variant3.id,
  //       url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
  //       altText: "Classic White Shirt - Size Small",
  //       sortOrder: 1,
  //     },
  //   });

  //   // 12. Create Carts
  //   console.log("🛒 Creating carts...");
  //   const cart1 = await prisma.cart.create({
  //     data: {
  //       id: "cart-001",
  //       userId: customerUser.id,
  //     },
  //   });

  //   const cart2 = await prisma.cart.create({
  //     data: {
  //       id: "cart-002",
  //       userId: customerUser2.id,
  //     },
  //   });

  //   // 13. Create Cart Items
  //   console.log("🛒 Creating cart items...");
  //   await prisma.cartItem.create({
  //     data: {
  //       id: "cart-item-001",
  //       cartId: cart1.id,
  //       variantId: variant1.id,
  //       quantity: 2,
  //       priceAtAdd: 69.99,
  //     },
  //   });

  //   await prisma.cartItem.create({
  //     data: {
  //       id: "cart-item-002",
  //       cartId: cart2.id,
  //       variantId: variant3.id,
  //       quantity: 1,
  //       priceAtAdd: 129.99,
  //     },
  //   });

  //   // 14. Create Coupons
  //   console.log("🎫 Creating coupons...");
  //   const coupon1 = await prisma.coupon.create({
  //     data: {
  //       id: "coupon-001",
  //       code: "SUMMER20",
  //       type: "PERCENT",
  //       value: 20.0,
  //       description: "20% off summer collection",
  //       minOrderAmount: 100.0,
  //       startsAt: new Date("2024-01-01"),
  //       endsAt: new Date("2024-12-31"),
  //       usageLimit: 1000,
  //       usedCount: 0,
  //       usageLimitPerUser: 1,
  //       active: true,
  //     },
  //   });

  //   const coupon2 = await prisma.coupon.create({
  //     data: {
  //       id: "coupon-002",
  //       code: "FREESHIP",
  //       type: "FREE_SHIPPING",
  //       value: 0.0,
  //       description: "Free shipping on orders over $50",
  //       minOrderAmount: 50.0,
  //       startsAt: new Date("2024-01-01"),
  //       endsAt: new Date("2024-12-31"),
  //       usageLimit: 5000,
  //       usedCount: 0,
  //       usageLimitPerUser: 3,
  //       active: true,
  //     },
  //   });

  //   // 15. Create Coupon Applicable Products
  //   console.log("🎫 Creating coupon applicable products...");
  //   await prisma.couponApplicableProduct.create({
  //     data: {
  //       couponId: coupon1.id,
  //       productId: product1.id,
  //     },
  //   });

  //   await prisma.couponApplicableCategory.create({
  //     data: {
  //       couponId: coupon2.id,
  //       categoryId: womenCategory.id,
  //     },
  //   });

  //   // 16. Create Orders
  //   console.log("📦 Creating orders...");
  //   const order1 = await prisma.order.create({
  //     data: {
  //       id: "order-001",
  //       orderNo: "DH-2024-0001",
  //       userId: customerUser.id,
  //       totalAmount: 139.98,
  //       shippingFee: 10.0,
  //       discountAmount: 20.0,
  //       finalAmount: 129.98,
  //       payStatus: "PAID",
  //       orderStatus: "CONFIRMED",
  //       paymentMethod: "VNPay",
  //       shippingAddress: {
  //         name: "John Doe",
  //         phone: "0901234567",
  //         addressLine: "123 Main Street",
  //         city: "Ho Chi Minh City",
  //         district: "District 1",
  //         province: "Ward 1",
  //         postalCode: "700000",
  //       },
  //       notes: "Please deliver after 2 PM",
  //       appliedCouponCode: "SUMMER20",
  //       couponId: coupon1.id,
  //     },
  //   });

  //   // 17. Create Order Items
  //   console.log("📦 Creating order items...");
  //   await prisma.orderItem.create({
  //     data: {
  //       id: "order-item-001",
  //       orderId: order1.id,
  //       variantId: variant1.id,
  //       productName: "Elegant Summer Dress",
  //       variantAttributes: {
  //         color: "Blue",
  //         size: "S",
  //       },
  //       unitPrice: 69.99,
  //       quantity: 2,
  //       subtotal: 139.98,
  //     },
  //   });

  //   // 18. Create Payments
  //   console.log("💳 Creating payments...");
  //   await prisma.payment.create({
  //     data: {
  //       id: "payment-001",
  //       orderId: order1.id,
  //       provider: "VNPay",
  //       status: "success",
  //       amount: 129.98,
  //       providerTxnId: "VNPAY-123456789",
  //       metadata: {
  //         transactionId: "VNPAY-123456789",
  //         responseCode: "00",
  //         responseMessage: "Success",
  //       },
  //     },
  //   });

  //   // 19. Create Order Status History
  //   console.log("📋 Creating order status history...");
  //   await prisma.orderStatusHistory.create({
  //     data: {
  //       id: "status-hist-001",
  //       orderId: order1.id,
  //       status: "PENDING",
  //       notes: "Order created",
  //       changedBy: "SYSTEM",
  //     },
  //   });

  //   await prisma.orderStatusHistory.create({
  //     data: {
  //       id: "status-hist-002",
  //       orderId: order1.id,
  //       status: "CONFIRMED",
  //       notes: "Payment confirmed",
  //       changedBy: adminUser.id,
  //     },
  //   });

  //   // 20. Create Reviews
  //   console.log("⭐ Creating reviews...");
  //   await prisma.review.create({
  //     data: {
  //       id: "review-001",
  //       productId: product1.id,
  //       userId: customerUser.id,
  //       orderItemId: "order-item-001",
  //       rating: 5,
  //       title: "Perfect dress!",
  //       body: "I love this dress! The quality is excellent and it fits perfectly. Highly recommended!",
  //       status: "APPROVED",
  //     },
  //   });

  //   // 21. Create Wishlist Items
  //   console.log("❤️ Creating wishlist items...");
  //   await prisma.wishlistItem.create({
  //     data: {
  //       id: "wish-001",
  //       userId: customerUser2.id,
  //       productId: product3.id,
  //     },
  //   });

  //   // 22. Create Static Pages
  //   console.log("📄 Creating static pages...");
  //   await prisma.staticPage.create({
  //     data: {
  //       id: "page-001",
  //       title: "About Us",
  //       slug: "about-us",
  //       content:
  //         "Welcome to ShopCo! We are a leading fashion retailer committed to providing high-quality products and exceptional customer service.",
  //       active: true,
  //       seoTitle: "About ShopCo - Your Fashion Destination",
  //       seoDesc:
  //         "Learn more about ShopCo, your trusted fashion retailer with quality products and excellent service.",
  //     },
  //   });

  //   await prisma.staticPage.create({
  //     data: {
  //       id: "page-002",
  //       title: "Privacy Policy",
  //       slug: "privacy-policy",
  //       content:
  //         "This privacy policy explains how we collect, use, and protect your personal information when you use our services.",
  //       active: true,
  //       seoTitle: "Privacy Policy - ShopCo",
  //       seoDesc:
  //         "Read our privacy policy to understand how we protect your personal information.",
  //     },
  //   });

  //   // 23. Create Banners
  //   console.log("🎨 Creating banners...");
  //   await prisma.banner.create({
  //     data: {
  //       id: "banner-001",
  //       title: "Summer Sale",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
  //       linkUrl: "/shop?category=summer",
  //       position: "homepage_slider",
  //       sortOrder: 1,
  //       active: true,
  //     },
  //   });

  //   await prisma.banner.create({
  //     data: {
  //       id: "banner-002",
  //       title: "New Collection",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&h=400&fit=crop",
  //       linkUrl: "/shop?category=new",
  //       position: "homepage_slider",
  //       sortOrder: 2,
  //       active: true,
  //     },
  //   });

  //   // 24. Create Audit Logs
  //   console.log("📊 Creating audit logs...");
  //   await prisma.auditLog.create({
  //     data: {
  //       id: "audit-001",
  //       userId: adminUser.id,
  //       action: "CREATE_PRODUCT",
  //       entity: "Product",
  //       entityId: product1.id,
  //       message: "Created new product: Elegant Summer Dress",
  //       metadata: {
  //         productName: "Elegant Summer Dress",
  //         category: "Dresses",
  //         brand: "Zara",
  //       },
  //     },
  //   });

  //   await prisma.auditLog.create({
  //     data: {
  //       id: "audit-002",
  //       userId: adminUser.id,
  //       action: "UPDATE_ORDER_STATUS",
  //       entity: "Order",
  //       entityId: order1.id,
  //       message: "Order status updated to CONFIRMED",
  //       metadata: {
  //         oldStatus: "PENDING",
  //         newStatus: "CONFIRMED",
  //         orderNo: "DH-2024-0001",
  //       },
  //     },
  //   });

  //   console.log("✅ Database seeding completed successfully!");
  //   console.log("\n📊 Summary:");
  //   console.log(`- Users: 3 (1 admin, 2 customers)`);
  //   console.log(`- Categories: 4`);
  //   console.log(`- Brands: 3`);
  //   console.log(`- Products: 3`);
  //   console.log(`- Product Variants: 4`);
  //   console.log(`- Orders: 1`);
  //   console.log(`- Coupons: 2`);
  //   console.log(`- Reviews: 1`);
  //   console.log(`- Static Pages: 2`);
  //   console.log(`- Banners: 2`);
  //   console.log(`- Audit Logs: 2`);
  // }
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
