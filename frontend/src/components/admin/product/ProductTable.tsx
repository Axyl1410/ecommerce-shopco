"use client";

import { Product, ProductStatus } from "@/types/admin/product.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash, Archive, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface ProductTableProps {
  products: Product[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onPublish: (product: Product) => void;
  onArchive: (product: Product) => void;
}

export function ProductTable({
  products,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onEdit,
  onDelete,
  onPublish,
  onArchive,
}: ProductTableProps) {
  const allSelected = products.length > 0 && selectedIds.length === products.length;

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.PUBLISHED:
        return <Badge variant="default" className="bg-green-500">Published</Badge>;
      case ProductStatus.DRAFT:
        return <Badge variant="secondary">Draft</Badge>;
      case ProductStatus.ARCHIVED:
        return <Badge variant="destructive">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="w-[80px]">Hình ảnh</TableHead>
            <TableHead>Tên sản phẩm</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Thương hiệu</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                Không có sản phẩm nào
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={(checked) => onSelectOne(product.id, checked as boolean)}
                    aria-label={`Select ${product.name}`}
                  />
                </TableCell>
                <TableCell>
                  {product.defaultImage ? (
                    <img
                      src={product.defaultImage}
                      alt={product.name}
                      className="w-[50px] h-[50px] rounded object-cover"
                    />
                  ) : (
                    <div className="w-[50px] h-[50px] bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      No image
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{product.slug}</TableCell>
                <TableCell>{product.brandName || "-"}</TableCell>
                <TableCell>{product.categoryName || "-"}</TableCell>
                <TableCell>{getStatusBadge(product.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(product.createdAt), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {product.status !== ProductStatus.PUBLISHED && (
                        <DropdownMenuItem onClick={() => onPublish(product)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      {product.status !== ProductStatus.ARCHIVED && (
                        <DropdownMenuItem onClick={() => onArchive(product)}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(product)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
