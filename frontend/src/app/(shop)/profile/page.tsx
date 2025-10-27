"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { ProfilePage } from "@/components/profile-page";
import type { Address } from "@/components/profile-page/AddressBook";
import type { OrderSummary } from "@/components/profile-page/ActivityHistory";
import type { Review } from "@/types/review.types";
import { useSession } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";

export default function ProfileRoutePage() {
  const { data } = useSession();

  const user = useMemo(() => {
    const name = data?.user?.name ?? "Người dùng";
    const email = data?.user?.email ?? "user@example.com";
    const phone = (data?.user as any)?.phone ?? "";
    const avatarUrl = (data?.user as any)?.image ?? "";
    return { name, email, phone, avatarUrl };
  }, [data]);

  // State loaded from API
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [orders] = useState<OrderSummary[]>([]);
  const [reviews] = useState<Review[]>([]);

  // Load addresses on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/addresses", { cache: "no-store" });
        if (!res.ok) throw new Error("Không tải được danh sách địa chỉ");
        const data = await res.json();
        setAddresses(data.addresses || []);
      } catch (e: any) {
        console.error(e);
        toast({ title: "Lỗi", description: e.message || "Không thể tải địa chỉ" });
      }
    };
    load();
  }, []);

  // Handlers calling API
  const handleUpdateProfile = useCallback(async (values: any) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name, avatarUrl: values.avatarUrl }),
      });
      if (!res.ok) throw new Error("Cập nhật hồ sơ thất bại");
      toast({ title: "Đã lưu", description: "Hồ sơ đã được cập nhật" });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Lỗi", description: e.message || "Không thể cập nhật hồ sơ" });
    }
  }, []);

  const handleCreate = useCallback(async (payload: Omit<Address, "id"> | any): Promise<Address> => {
    try {
      setCreating(true);
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Thêm địa chỉ thất bại");
      const data = await res.json();
      const created: Address = data.address;
      setAddresses((prev) => [created, ...prev.map(a => payload.isDefault ? { ...a, isDefault: false } : a)]);
      toast({ title: "Thành công", description: "Đã thêm địa chỉ" });
      return created;
    } catch (e: any) {
      console.error(e);
      toast({ title: "Lỗi", description: e.message || "Không thể thêm địa chỉ" });
      throw e;
    } finally {
      setCreating(false);
    }
  }, []);

  const handleUpdate = useCallback(async (id: string, payload: Partial<Address> | any) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Cập nhật địa chỉ thất bại");
      const data = await res.json();
      const updated: Address = data.address;
      setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
      if (updated.isDefault) {
        setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
      }
      toast({ title: "Đã lưu", description: "Địa chỉ đã được cập nhật" });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Lỗi", description: e.message || "Không thể cập nhật địa chỉ" });
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Xoá địa chỉ thất bại");
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast({ title: "Đã xoá", description: "Địa chỉ đã được xoá" });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Lỗi", description: e.message || "Không thể xoá địa chỉ" });
    } finally {
      setDeletingId(null);
    }
  }, []);

  const handleSetDefault = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/addresses/default`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Đặt mặc định thất bại");
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    } catch (e: any) {
      console.error(e);
      toast({ title: "Lỗi", description: e.message || "Không thể đặt mặc định" });
    }
  }, []);

  return (
    <div className="container py-6">
      <ProfilePage
        user={user}
        addresses={addresses}
        orders={orders}
        reviews={reviews}
        creating={creating}
        updatingId={updatingId}
        deletingId={deletingId}
        onUpdateProfile={handleUpdateProfile}
        onUploadAvatar={async (file) => {
          // For demo only; replace with upload to storage
          return URL.createObjectURL(file);
        }}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onSetDefault={handleSetDefault}
      />
    </div>
  );
}
