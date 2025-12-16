"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductFilters } from "@/components/admin/product/ProductFilters";
import { ProductTable } from "@/components/admin/product/ProductTable";
import { ProductAdminService } from "@/services/admin/product/productAdmin.service";
import { Product, ProductStatus, ProductFilters as IProductFilters } from "@/types/admin/product.types";
import { toast } from "sonner";
import { Plus, Trash, Archive, CheckCircle, Loader2, Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProductListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<IProductFilters>({
    page: 0,
    size: 10,
    sortBy: "createdAt",
    sortDir: "desc",
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    product?: Product;
  }>({ open: false });

  // Load products
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductAdminService.getAllProducts(filters);
      setProducts(response.products);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (newFilters: Partial<IProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 0 }));
    setSelectedIds([]);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    setSelectedIds([]);
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Handle select one
  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  // Handle edit
  const handleEdit = (product: Product) => {
    router.push(`/admin/products/${product.id}`);
  };

  // Handle delete
  const handleDelete = (product: Product) => {
    setDeleteDialog({ open: true, product });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.product) return;

    try {
      await ProductAdminService.deleteProduct(deleteDialog.product.id);
      toast.success("Xóa sản phẩm thành công");
      loadProducts();
      setSelectedIds([]);
    } catch (error) {
      toast.error("Không thể xóa sản phẩm");
      console.error(error);
    } finally {
      setDeleteDialog({ open: false });
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      await ProductAdminService.bulkDeleteProducts(selectedIds);
      toast.success(`Đã xóa ${selectedIds.length} sản phẩm`);
      loadProducts();
      setSelectedIds([]);
    } catch (error) {
      toast.error("Không thể xóa sản phẩm");
      console.error(error);
    }
  };

  // Handle publish
  const handlePublish = async (product: Product) => {
    try {
      await ProductAdminService.publishProduct(product.id);
      toast.success("Đã publish sản phẩm");
      loadProducts();
    } catch (error) {
      toast.error("Không thể publish sản phẩm");
      console.error(error);
    }
  };

  // Handle archive
  const handleArchive = async (product: Product) => {
    try {
      await ProductAdminService.archiveProduct(product.id);
      toast.success("Đã archive sản phẩm");
      loadProducts();
    } catch (error) {
      toast.error("Không thể archive sản phẩm");
      console.error(error);
    }
  };

  // Handle bulk publish
  const handleBulkPublish = async () => {
    if (selectedIds.length === 0) return;

    try {
      await ProductAdminService.bulkUpdateStatus(selectedIds, ProductStatus.PUBLISHED);
      toast.success(`Đã publish ${selectedIds.length} sản phẩm`);
      loadProducts();
      setSelectedIds([]);
    } catch (error) {
      toast.error("Không thể publish sản phẩm");
      console.error(error);
    }
  };

  // Handle bulk archive
  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return;

    try {
      await ProductAdminService.bulkUpdateStatus(selectedIds, ProductStatus.ARCHIVED);
      toast.success(`Đã archive ${selectedIds.length} sản phẩm`);
      loadProducts();
      setSelectedIds([]);
    } catch (error) {
      toast.error("Không thể archive sản phẩm");
      console.error(error);
    }
  };

  // Handle export to Excel
  const handleExportExcel = () => {
    try {
      // Prepare data for Excel
      const excelData = products.map((product, index) => ({
        "STT": index + 1,
        "Mã SP": product.id,
        "Tên sản phẩm": product.name,
        "Slug": product.slug,
        "Thương hiệu": product.brandName || "",
        "Danh mục": product.categoryName || "",
        "Trạng thái": product.status,
        "Số biến thể": product.variants?.length || 0,
        "Ngày tạo": new Date(product.createdAt).toLocaleDateString("vi-VN"),
        "Mô tả": product.description || "",
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      ws['!cols'] = [
        { wch: 5 },  // STT
        { wch: 15 }, // Mã SP
        { wch: 30 }, // Tên sản phẩm
        { wch: 30 }, // Slug
        { wch: 15 }, // Thương hiệu
        { wch: 20 }, // Danh mục
        { wch: 12 }, // Trạng thái
        { wch: 12 }, // Số biến thể
        { wch: 12 }, // Ngày tạo
        { wch: 50 }, // Mô tả
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Sản phẩm");

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `san-pham-${timestamp}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);
      
      toast.success(`Đã xuất ${products.length} sản phẩm ra file Excel`);
    } catch (error) {
      toast.error("Không thể xuất file Excel");
      console.error(error);
    }
  };

  // Handle import from Excel
  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          toast.error("File Excel không có dữ liệu");
          return;
        }

        let successCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        console.log("Import data:", jsonData);
        toast.info(`Đang import ${jsonData.length} sản phẩm...`);

        for (const row of jsonData as any[]) {
          try {
            console.log("Processing row:", row);
            const name = row["Tên sản phẩm"] || row["name"] || row["Name"];
            const brandId = row["Mã thương hiệu"] || row["brandId"] || "";
            const categoryId = row["Mã danh mục"] || row["categoryId"] || "";
            
            if (!name) {
              errors.push(`Dòng thiếu tên sản phẩm`);
              errorCount++;
              continue;
            }

            // Generate unique slug with timestamp
            const baseSlug = (row["Slug"] || row["slug"] || name)
              ?.toString()
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/đ/g, "d")
              .replace(/Đ/g, "D")
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .trim();
            
            // Add unique suffix to avoid duplicate slugs
            const uniqueSlug = `${baseSlug}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

            // Map Excel columns to product data - ensure empty strings are converted to undefined
            const productData = {
              name: name,
              slug: uniqueSlug,
              description: row["Mô tả"] || row["description"] || "",
              brandId: brandId && brandId.trim() !== "" ? brandId : undefined,
              categoryId: categoryId && categoryId.trim() !== "" ? categoryId : undefined,
              status: (row["Trạng thái"] || row["status"] || "DRAFT") as ProductStatus,
              seoMetaTitle: name,
              seoMetaDesc: (row["Mô tả"] || row["description"] || "")?.substring(0, 160),
              defaultImage: row["Link hình ảnh"] || row["image"] || undefined,
              images: [],
              variants: [],
              tags: [],
            };

            // Create product via API
            await ProductAdminService.createProduct(productData as any);
            successCount++;
          } catch (error: any) {
            const errorMsg = error?.message || "Lỗi không xác định";
            errors.push(`${row["Tên sản phẩm"] || "Unknown"}: ${errorMsg}`);
            errorCount++;
          }
        }

        if (successCount > 0) {
          toast.success(`Import thành công ${successCount} sản phẩm!`);
          loadProducts();
        }
        
        if (errorCount > 0) {
          console.error("Import errors:", errors);
          toast.error(`Lỗi ${errorCount} sản phẩm. Xem console để biết chi tiết.`);
        }
      } catch (error) {
        toast.error("Không thể đọc file Excel");
        console.error(error);
      }
    };

    reader.readAsBinaryString(file);
    // Reset input để có thể upload lại cùng file
    event.target.value = "";
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground mt-2">
            Tổng cộng {totalElements} sản phẩm
          </p>
        </div>
        <div className="flex gap-2">
          <label htmlFor="import-excel">
            <Button variant="outline" asChild>
              <span className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Nhập Excel
              </span>
            </Button>
          </label>
          <input
            id="import-excel"
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImportExcel}
          />
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          <Button onClick={() => router.push("/admin/products/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      <ProductFilters onFilterChange={handleFilterChange} />

      {selectedIds.length > 0 && (
        <div className="flex gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <span className="text-sm font-medium">
            Đã chọn {selectedIds.length} sản phẩm
          </span>
          <div className="flex gap-2 ml-auto">
            <Button size="sm" variant="outline" onClick={handleBulkPublish}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Publish
            </Button>
            <Button size="sm" variant="outline" onClick={handleBulkArchive}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleBulkDelete}
            >
              <Trash className="mr-2 h-4 w-4" />
              Xóa
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <ProductTable
            products={products}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPublish={handlePublish}
            onArchive={handleArchive}
          />

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(0, (filters.page || 0) - 1))}
                    className={filters.page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(0, (filters.page || 0) - 2);
                  if (page >= totalPages) return null;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === filters.page}
                        className="cursor-pointer"
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages - 1, (filters.page || 0) + 1))
                    }
                    className={
                      filters.page === totalPages - 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm "{deleteDialog.product?.name}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
