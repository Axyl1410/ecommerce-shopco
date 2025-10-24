"use client";

import React, { useMemo, useCallback, useState } from "react";
import { ProfileForm } from "@/components/profile-page/ProfileForm";
import { useSession } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProfileRoutePage() {
  const { data } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const user = useMemo(() => {
    const name = data?.user?.name ?? "Người dùng";
    const email = data?.user?.email ?? "user@example.com";
    const avatarUrl = data?.user?.image ?? "";
    return { name, email, avatarUrl };
  }, [data]);

  const handleUpdateProfile = useCallback(async (values: any) => {
    try {
      setSaving(true);
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name, avatarUrl: values.avatarUrl }),
      });
      
      if (!res.ok) {
        throw new Error("Cập nhật hồ sơ thất bại");
      }
      
      toast({ 
        title: "Thành công", 
        description: "Hồ sơ đã được cập nhật",
        variant: "default"
      });
      
      // Refresh để cập nhật session
      router.refresh();
    } catch (e: any) {
      console.error(e);
      toast({ 
        title: "Lỗi", 
        description: e.message || "Không thể cập nhật hồ sơ",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  }, [router]);

  if (!data?.user) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-2 text-center">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          {/* Profile Card Skeleton */}
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            <CardContent className="relative pt-0 pb-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 md:-mt-12">
                <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
                <div className="flex-1 space-y-3 md:mb-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-3 w-64" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-10 w-32 ml-auto" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-lg text-muted-foreground">
          Quản lý thông tin tài khoản và cài đặt cá nhân của bạn
        </p>
      </div>
      
      <ProfileForm
        defaultValues={user}
        onSubmit={handleUpdateProfile}
        saving={saving}
      />
    </div>
  );
}
