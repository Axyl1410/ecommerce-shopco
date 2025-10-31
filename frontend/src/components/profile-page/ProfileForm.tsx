"use client";

import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

export type ProfileFormValues = z.infer<typeof profileSchema>;

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên quá dài"),
  email: z.string().email("Email không hợp lệ"),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export type ProfileFormProps = {
  defaultValues: Partial<ProfileFormValues> & { email: string };
  onSubmit: (values: ProfileFormValues) => Promise<void> | void;
  onAvatarUpload?: (file: File) => Promise<string> | string; // should return new url
  saving?: boolean;
};

export function ProfileForm({
  defaultValues,
  onSubmit,
  onAvatarUpload,
  saving,
}: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultValues.name ?? "",
      email: defaultValues.email,
      avatarUrl: defaultValues.avatarUrl ?? "",
    },
    mode: "onTouched",
  });

  // When parent passes new defaultValues (e.g., after refresh hydration), sync the form
  useEffect(() => {
    form.reset({
      name: defaultValues.name ?? "",
      email: defaultValues.email,
      avatarUrl: defaultValues.avatarUrl ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.name, defaultValues?.email, defaultValues?.avatarUrl]);

  const avatarUrl = form.watch("avatarUrl");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!onAvatarUpload) return;
    // Guard: only allow jpeg/png/webp and <= 2MB
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
    if (!ALLOWED.includes(file.type)) {
      toast({ title: "Ảnh không hợp lệ", description: "Chỉ hỗ trợ JPG/PNG/WEBP" });
      return;
    }
    if (file.size > MAX_SIZE) {
      toast({ title: "Ảnh quá lớn", description: "Kích thước tối đa 2MB" });
      return;
    }
    const url = await onAvatarUpload(file);
    if (url) form.setValue("avatarUrl", url, { shouldDirty: true });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Hồ sơ người dùng</h2>
          <p className="text-sm text-muted-foreground">Cập nhật tên hiển thị, email và ảnh đại diện</p>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-56 flex flex-col items-center gap-3">
          <Avatar className="h-28 w-28 ring-1 ring-border">
            <AvatarImage src={avatarUrl || undefined} alt="avatar" />
            <AvatarFallback>
              {defaultValues.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
          <p className="text-xs text-muted-foreground">JPG/PNG/WEBP • Tối đa 2MB</p>
        </div>

        <div className="flex-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (vals) => onSubmit(vals))}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" disabled {...field} />
                    </FormControl>
                    <FormDescription>
                      Email dùng để đăng nhập, không thể thay đổi.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              

              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Card>
  );
}
