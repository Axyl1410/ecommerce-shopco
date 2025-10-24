"use client";

import React from "react";
import { ProfileForm, type ProfileFormValues } from "./ProfileForm";
import { AddressBook, type Address, type AddressBookProps } from "./AddressBook";
import { ActivityHistory, type OrderSummary } from "./ActivityHistory";
import type { Review } from "@/types/review.types";

export type ProfilePageProps = {
  user: { name: string; email: string; phone?: string; avatarUrl?: string };
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
    <div className="space-y-6">
      <ProfileForm
        defaultValues={props.user}
        onSubmit={props.onUpdateProfile}
        onAvatarUpload={props.onUploadAvatar}
      />

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

      <ActivityHistory orders={props.orders} reviews={props.reviews} />
    </div>
  );
}
