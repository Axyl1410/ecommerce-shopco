"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/product/ProductForm";
import { ProductAdminService } from "@/services/admin/product/productAdmin.service";
import { CreateProductRequest } from "@/types/admin/product.types";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateProductRequest) => {
    try {
      setLoading(true);
      // Convert empty strings to undefined for foreign keys
      const cleanData = {
        ...data,
        brandId: data.brandId && data.brandId.trim() !== "" ? data.brandId : undefined,
        categoryId: data.categoryId && data.categoryId.trim() !== "" ? data.categoryId : undefined,
        defaultImage: data.defaultImage && data.defaultImage.trim() !== "" ? data.defaultImage : undefined,
      };
      await ProductAdminService.createProduct(cleanData as CreateProductRequest);
      toast.success("Tạo sản phẩm thành công");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error.message || "Không thể tạo sản phẩm");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold">Tạo sản phẩm mới</h1>
        <p className="text-muted-foreground mt-2">
          Nhập thông tin để tạo sản phẩm mới
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <ProductForm
          onSubmit={handleSubmit as any}
          onCancel={handleCancel}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
