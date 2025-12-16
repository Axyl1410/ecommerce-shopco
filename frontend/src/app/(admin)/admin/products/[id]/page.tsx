"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/product/ProductForm";
import { ProductAdminService } from "@/services/admin/product/productAdmin.service";
import { UpdateProductRequest, Product } from "@/types/admin/product.types";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await ProductAdminService.getProductById(productId);
      if (response.success && response.product) {
        setProduct(response.product);
      } else {
        toast.error("Không tìm thấy sản phẩm");
        router.push("/admin/products");
      }
    } catch (error) {
      toast.error("Không thể tải thông tin sản phẩm");
      console.error(error);
      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateProductRequest) => {
    try {
      setSubmitting(true);
      // Convert empty strings to undefined for foreign keys
      const cleanData = {
        ...data,
        brandId: data.brandId && data.brandId.trim() !== "" ? data.brandId : undefined,
        categoryId: data.categoryId && data.categoryId.trim() !== "" ? data.categoryId : undefined,
        defaultImage: data.defaultImage && data.defaultImage.trim() !== "" ? data.defaultImage : undefined,
      };
      await ProductAdminService.updateProduct(productId, cleanData as UpdateProductRequest);
      toast.success("Cập nhật sản phẩm thành công");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật sản phẩm");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

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
        <h1 className="text-3xl font-bold">Chỉnh sửa sản phẩm</h1>
        <p className="text-muted-foreground mt-2">
          Cập nhật thông tin sản phẩm: {product.name}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit as any}
          onCancel={handleCancel}
          isLoading={submitting}
        />
      </div>
    </div>
  );
}
