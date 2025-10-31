import type { Address, OrderSummary, ReviewSummary, UpdateProfilePayload, UserProfile, UpsertAddressPayload } from "@/types/profile.types";

class ProfileService {
  private base = "/api/profile";

  async getProfile(): Promise<UserProfile> {
    const res = await fetch(this.base, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load profile");
    const data = await res.json();
    return data.user ?? data; // support both {user} and direct dto
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const res = await fetch(this.base, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    const data = await res.json();
    return data.user ?? data;
  }

  // Addresses
  async listAddresses(): Promise<Address[]> {
    const res = await fetch(`/api/addresses`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load addresses");
    const data = await res.json();
    return data.addresses ?? data;
  }

  async createAddress(payload: UpsertAddressPayload): Promise<Address> {
    const res = await fetch(`/api/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create address");
    const data = await res.json();
    return data.address;
  }

  async updateAddress(id: string, payload: UpsertAddressPayload): Promise<Address> {
    const res = await fetch(`/api/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update address");
    const data = await res.json();
    return data.address;
  }

  async deleteAddress(id: string): Promise<void> {
    const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete address");
  }

  async setDefaultAddress(id: string): Promise<Address> {
    const res = await fetch(`/api/addresses/default`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Failed to set default address");
    const data = await res.json();
    return data.address;
  }

  async getActivity(): Promise<{ orders: OrderSummary[]; reviews: ReviewSummary[] }> {
    const res = await fetch(`${this.base}/activity`, { cache: "no-store" });
    if (!res.ok) return { orders: [], reviews: [] };
    const data = await res.json();
    return data;
  }
}

export const profileService = new ProfileService();
