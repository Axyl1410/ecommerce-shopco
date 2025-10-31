"use client";

import React, { useMemo, useState, useCallback } from "react";
import { ProfilePage } from "@/components/profile-page";
import type { Address } from "@/components/profile-page/AddressBook";
import type { OrderSummary } from "@/components/profile-page/ActivityHistory";
import type { Review } from "@/types/review.types";
import { toast } from "@/hooks/use-toast";
import { profileService } from "@/services/profile.service";
import { convertImageToBase64 } from "@/lib/utils";

type Props = {
  initialUser: { name: string; email: string; avatarUrl?: string };
  initialAddresses: Address[];
  initialOrders: OrderSummary[];
  initialReviews: Review[];
};

export default function ProfileClient({ initialUser, initialAddresses, initialOrders, initialReviews }: Props) {
  const [user] = useState(initialUser);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>(initialOrders);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const handleUpdateProfile = useCallback(async (values: any) => {
    try {
      await profileService.updateProfile({ name: values.name, avatarUrl: values.avatarUrl });
      toast({ title: "Đã lưu", description: "Hồ sơ đã được cập nhật" });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Lỗi", description: e.message || "Không thể cập nhật hồ sơ" });
    }
  }, []);

  const handleCreate = useCallback(async (payload: Omit<Address, "id"> | any): Promise<Address> => {
    try {
      setCreating(true);
      const created = await profileService.createAddress(payload);
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
      const updated = await profileService.updateAddress(id, payload);
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
      await profileService.deleteAddress(id);
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
      await profileService.setDefaultAddress(id);
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    } catch (e: any) {
      console.error(e);
      toast({ title: "Lỗi", description: e.message || "Không thể đặt mặc định" });
    }
  }, []);

  return (
    <div className="py-6">
      <ProfilePage
        user={user}
        addresses={addresses}
        orders={orders}
        reviews={reviews}
        creating={creating}
        updatingId={updatingId}
        deletingId={deletingId}
        onUpdateProfile={handleUpdateProfile}
        onUploadAvatar={async (file) => await convertImageToBase64(file)}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onSetDefault={handleSetDefault}
      />
    </div>
  );
}
