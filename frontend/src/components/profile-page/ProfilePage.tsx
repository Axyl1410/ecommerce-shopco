"use client";

import React from "react";
import { ProfileForm, type ProfileFormValues } from "./ProfileForm";
import { AddressBook, type Address, type AddressBookProps } from "./AddressBook";
import { ActivityHistory, type OrderSummary } from "./ActivityHistory";
import type { Review } from "@/types/review.types";

export type ProfilePageProps = {
  user: { name: string; email: string; avatarUrl?: string };
  addresses: Address[];
  orders: OrderSummary[];
  reviews: Review[];
  onUpdateProfile: (values: ProfileFormValues) => Promise<void> | void;
  onUploadAvatar?: (file: File) => Promise<string> | string;
} & Pick<
  AddressBookProps,
  "onCreate" | "onUpdate" | "onDelete" | "onSetDefault" | "creating" | "updatingId" | "deletingId"
>;

export default function ProfilePage(props: ProfilePageProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 space-y-10">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Profile</h2>
        <ProfileForm
          defaultValues={props.user}
          onSubmit={props.onUpdateProfile}
          onAvatarUpload={props.onUploadAvatar}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Addresses</h2>
        <AddressBook
          addresses={props.addresses}
          onCreate={props.onCreate}
          onUpdate={props.onUpdate}
          onDelete={props.onDelete}
          onSetDefault={props.onSetDefault}
          creating={props.creating}
          updatingId={props.updatingId}
          deletingId={props.deletingId}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Activity</h2>
        <ActivityHistory orders={props.orders} reviews={props.reviews} />
      </section>
    </div>
  );
}
