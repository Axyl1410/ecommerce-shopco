"use client";

import React, { useState, useEffect } from "react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, User, Mail, Calendar } from "lucide-react";

export type ProfileFormValues = z.infer<typeof profileSchema>;

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên quá dài"),
  email: z.string().email("Email không hợp lệ"),
  avatarUrl: z.string().optional().or(z.literal("")),
});

export type ProfileFormProps = {
  defaultValues: Partial<ProfileFormValues> & { email: string };
  onSubmit: (values: ProfileFormValues) => Promise<void> | void;
  onAvatarUpload?: (file: File) => Promise<string> | string;
  saving?: boolean;
};

export function ProfileForm({
  defaultValues,
  onSubmit,
  onAvatarUpload,
  saving,
}: ProfileFormProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultValues.name ?? "",
      email: defaultValues.email,
      avatarUrl: defaultValues.avatarUrl ?? "",
    },
    mode: "onTouched",
  });

  const avatarUrl = form.watch("avatarUrl");

  // Load avatar từ defaultValues khi component mount hoặc khi defaultValues thay đổi
  useEffect(() => {
    const avatarFromDefault = defaultValues.avatarUrl;
    if (avatarFromDefault) {
      // Chấp nhận cả URL http/https và path local /uploads/...
      // Không chấp nhận blob: URL vì sẽ mất sau refresh
      if (!avatarFromDefault.startsWith('blob:')) {
        setPreviewUrl(avatarFromDefault);
        form.setValue("avatarUrl", avatarFromDefault, { shouldValidate: false });
      }
    }
  }, [defaultValues.avatarUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB');
      return;
    }
    
    try {
      setUploading(true);
      
      // Upload file to server
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      const data = await response.json();
      const uploadedUrl = data.url;
      
      if (uploadedUrl) {
        form.setValue("avatarUrl", uploadedUrl, { shouldDirty: true });
        setPreviewUrl(uploadedUrl);
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      alert(error.message || 'Không thể upload ảnh');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 md:-mt-12">
            {/* Avatar Section */}
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage 
                  src={previewUrl || avatarUrl || undefined} 
                  alt={defaultValues.name || "User avatar"}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-400 to-purple-600 text-white">
                  {defaultValues.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              {/* Upload Button Overlay */}
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {uploading ? (
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-white" />
                )}
              </label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={saving || uploading}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-2 md:mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-bold">{defaultValues.name}</h2>
                <Badge variant="secondary" className="hidden md:inline-flex">
                  <User className="h-3 w-3 mr-1" />
                  Thành viên
                </Badge>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {defaultValues.email}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa thông tin</CardTitle>
          <CardDescription>
            Cập nhật thông tin cá nhân của bạn. Email không thể thay đổi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (vals) => onSubmit(vals))}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Họ và tên</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nhập họ và tên của bạn" 
                        {...field}
                        disabled={saving}
                        className="h-11"
                      />
                    </FormControl>
                    <FormDescription>
                      Tên này sẽ được hiển thị công khai trên tài khoản của bạn
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        disabled 
                        {...field} 
                        className="bg-muted/50 h-11"
                      />
                    </FormControl>
                    <FormDescription>
                      Email dùng để đăng nhập và không thể thay đổi
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">URL Avatar (Tùy chọn)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/avatar.jpg hoặc /uploads/avatars/image.jpg" 
                        {...field}
                        disabled={saving}
                        className="h-11"
                        onChange={(e) => {
                          field.onChange(e);
                          const value = e.target.value;
                          // Preview nếu là URL hợp lệ hoặc path local
                          if (value && (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/'))) {
                            setPreviewUrl(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Nhập URL của ảnh đại diện hoặc upload file ở trên
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <div className="flex flex-col-reverse md:flex-row gap-3 md:justify-end">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={saving || !form.formState.isDirty}
                  className="w-full md:w-auto"
                >
                  Hủy bỏ
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving || !form.formState.isDirty || uploading}
                  className="w-full md:w-auto min-w-[150px]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
