"use client";

import React, { useMemo, useCallback, useState, useEffect, lazy, Suspense } from "react";
import { ProfileForm } from "@/components/profile-page/ProfileForm";
import { useSession } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, Package } from "lucide-react";

// Lazy load heavy components
const AddressBook = lazy(() => 
  import("@/components/profile-page/AddressBook").then(mod => ({ default: mod.AddressBook }))
);
const ActivityHistory = lazy(() => 
  import("@/components/profile-page/ActivityHistory").then(mod => ({ default: mod.ActivityHistory }))
);

export default function ProfileRoutePage() {
  const { data } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("personal");
  
  // Separate loading states for each tab
  const [profileLoading, setProfileLoading] = useState(true);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  
  // Track which data has been loaded
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set(["personal"]));

  const user = useMemo(() => {
    // Prioritize profile data from API over session data
    const source = profileData || data?.user;
    const name = source?.name ?? "User";
    const email = source?.email ?? "user@example.com";
    const phone = source?.phone ?? "";
    const avatarUrl = source?.image ?? "";
    return { name, email, phone, avatarUrl };
  }, [data, profileData]);

  // Fetch profile data only on initial load
  useEffect(() => {
    if (data?.user && !profileData) {
      fetchProfile();
    }
  }, [data]);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const profileRes = await fetch("/api/profile");

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfileData(profileData.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  // Lazy load addresses when tab is clicked
  const fetchAddresses = useCallback(async () => {
    if (loadedTabs.has("addresses")) return; // Already loaded
    
    try {
      setAddressesLoading(true);
      const addressesRes = await fetch("/api/addresses");

      if (addressesRes.ok) {
        const addressesData = await addressesRes.json();
        setAddresses(addressesData.addresses || []);
        setLoadedTabs(prev => new Set([...prev, "addresses"]));
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setAddressesLoading(false);
    }
  }, [loadedTabs]);

  // Lazy load activity data when tab is clicked
  const fetchActivity = useCallback(async () => {
    if (loadedTabs.has("activity")) return; // Already loaded
    
    try {
      setActivityLoading(true);
      const [ordersRes, reviewsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/reviews"),
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews || []);
      }
      
      setLoadedTabs(prev => new Set([...prev, "activity"]));
    } catch (error) {
      console.error("Error fetching activity:", error);
    } finally {
      setActivityLoading(false);
    }
  }, [loadedTabs]);

  // Handle tab change with lazy loading
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    
    if (value === "addresses" && !loadedTabs.has("addresses")) {
      fetchAddresses();
    } else if (value === "activity" && !loadedTabs.has("activity")) {
      fetchActivity();
    }
  }, [loadedTabs, fetchAddresses, fetchActivity]);

  const handleUpdateProfile = useCallback(async (values: any) => {
    try {
      setSaving(true);
      
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: values.name, 
          phone: values.phone,
          avatarUrl: values.avatarUrl 
        }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await res.json();
      
      // Optimistic update - update UI immediately
      if (result.user) {
        setProfileData(result.user);
      }
      
      toast({ 
        title: "Success", 
        description: "Your profile has been updated",
        variant: "default"
      });
      
      // No need to refresh router - optimistic update already done
    } catch (e: any) {
      console.error(e);
      toast({ 
        title: "Error", 
        description: e.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  }, []);

  if (!data?.user) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-2 text-center">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto max-w-full" />
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
              <Skeleton className="h-4 w-96 mt-2 max-w-full" />
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
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Profile</h1>
        <p className="text-lg text-muted-foreground">
          Manage your account information, addresses, and activity
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px] mx-auto">
          <TabsTrigger value="personal" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="addresses" className="gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Addresses</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          {profileLoading ? (
            <Card>
              <CardContent className="space-y-6 pt-6">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </CardContent>
            </Card>
          ) : (
            <ProfileForm
              defaultValues={user}
              onSubmit={handleUpdateProfile}
              saving={saving}
            />
          )}
        </TabsContent>

        <TabsContent value="addresses" className="space-y-6">
          <Suspense fallback={
            <Card>
              <CardContent className="space-y-4 pt-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          }>
            {addressesLoading ? (
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ) : (
              <AddressBook 
                addresses={addresses}
                onCreate={async (payload) => {
                  const res = await fetch("/api/addresses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  if (res.ok) {
                    const data = await res.json();
                    // Optimistic update
                    setAddresses(prev => [...prev, data.address]);
                    toast({ title: "Success", description: "Address created" });
                    return data.address;
                  } else {
                    throw new Error("Failed to create address");
                  }
                }}
                onUpdate={async (id, payload) => {
                  // Optimistic update
                  const oldAddresses = [...addresses];
                  setAddresses(prev => prev.map(a => a.id === id ? { ...a, ...payload } : a));
                  
                  const res = await fetch(`/api/addresses/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  if (res.ok) {
                    const data = await res.json();
                    setAddresses(prev => prev.map(a => a.id === id ? data.address : a));
                    toast({ title: "Success", description: "Address updated" });
                  } else {
                    // Rollback on error
                    setAddresses(oldAddresses);
                    throw new Error("Failed to update address");
                  }
                  }
                }}
                onDelete={async (id) => {
                  const res = await fetch(`/api/addresses/${id}`, {
                    method: "DELETE",
                  });
                  if (res.ok) {
                    await fetchData();
                    toast({ title: "Success", description: "Address deleted" });
                  } else {
                    throw new Error("Failed to delete address");
                  }
                }}
                onSetDefault={async (id) => {
                  const res = await fetch(`/api/addresses/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isDefault: true }),
                  });
                  if (res.ok) {
                    await fetchData();
                    toast({ title: "Success", description: "Default address updated" });
                  } else {
                    throw new Error("Failed to set default address");
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivityHistory 
            orders={orders.map(order => ({
              id: order.id,
              code: order.orderNo || order.id,
              createdAt: order.createdAt,
              total: Number(order.finalAmount || 0),
              status: order.orderStatus?.toLowerCase() || "pending",
              itemsCount: order.items?.length || 0,
            }))} 
            reviews={reviews.map(review => ({
              id: Number(review.id) || 0,
              user: user.name,
              content: review.body || review.title || "",
              rating: review.rating,
              date: new Date(review.createdAt).toISOString(),
            }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
