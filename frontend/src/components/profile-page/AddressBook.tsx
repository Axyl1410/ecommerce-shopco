"use client";

import React, { useMemo, useState } from "react";
import { z } from "zod";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type Address = {
  id: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  district: string;
  province: string;
  postalCode?: string | null;
  isDefault?: boolean; // According to current schema there is a single default flag
};

export type AddressUpsertFormValues = {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  district: string;
  province: string;
  postalCode?: string;
  isDefault: boolean;
};

const addressSchema = z.object({
  name: z.string().min(2, "Recipient name must be at least 2 characters"),
  phone: z.string().min(8, "Invalid phone number"),
  addressLine: z.string().min(3, "Address is too short"),
  city: z.string().min(1),
  district: z.string().min(1),
  province: z.string().min(1),
  postalCode: z.string().optional().or(z.literal("")),
  isDefault: z.boolean().default(false),
});

export type AddressBookProps = {
  addresses: Address[];
  onCreate: (payload: AddressUpsertFormValues) => Promise<Address> | Address | void;
  onUpdate: (id: string, payload: AddressUpsertFormValues) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onSetDefault: (id: string) => Promise<void> | void; // Single default flag
  creating?: boolean;
  updatingId?: string | null;
  deletingId?: string | null;
};

export function AddressBook({
  addresses,
  onCreate,
  onUpdate,
  onDelete,
  onSetDefault,
  creating,
  updatingId,
  deletingId,
}: AddressBookProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const defaultId = useMemo(() => addresses.find(a => a.isDefault)?.id, [addresses]);

  const form = useForm<AddressUpsertFormValues, any, AddressUpsertFormValues>({
    resolver: zodResolver(addressSchema) as Resolver<AddressUpsertFormValues, any, AddressUpsertFormValues>,
    defaultValues: {
      name: "",
      phone: "",
      addressLine: "",
      city: "",
      district: "",
      province: "",
      postalCode: "",
      isDefault: false,
    },
  });

  const startCreate = () => {
    setEditing(null);
    form.reset({ name: "", phone: "", addressLine: "", city: "", district: "", province: "", postalCode: "" });
    setOpen(true);
  };

  const startEdit = (a: Address) => {
    setEditing(a);
    form.reset({
      name: a.name,
      phone: a.phone,
      addressLine: a.addressLine,
      city: a.city,
      district: a.district,
      province: a.province,
      postalCode: a.postalCode || "",
      isDefault: !!a.isDefault,
    });
    setOpen(true);
  };

  const submit = form.handleSubmit(async (values) => {
    if (editing) {
      await onUpdate?.(editing.id, values);
    } else {
      await onCreate?.(values);
    }
    setOpen(false);
  });

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">My Addresses</h2>
          <p className="text-sm text-muted-foreground">
            Manage multiple addresses and set your default shipping/payment address
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startCreate}>Add address</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[540px]">
            <DialogHeader>
              <DialogTitle>{editing ? "Update address" : "Add address"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={submit}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input placeholder="0901234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="addressLine"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Street address..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal code</FormLabel>
                      <FormControl>
                        <Input placeholder="(optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Set as default address</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-3">
                          <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                          <span className="text-sm text-muted-foreground">
                            Use this address as your default
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editing ? "Save changes" : creating ? "Adding..." : "Add"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((a) => (
          <div
            key={a.id}
            className={cn(
              "rounded-md border p-4 space-y-2",
              a.isDefault && "border-primary"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">
                {a.name} · {a.phone}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => startEdit(a)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => onDelete?.(a.id)}
                  disabled={deletingId === a.id}
                >
                  Delete
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {a.addressLine}, {a.district}, {a.city}, {a.province}
              {a.postalCode ? `, ${a.postalCode}` : ""}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant={a.isDefault ? "default" : "outline"}
                onClick={() => onSetDefault?.(a.id)}
                disabled={defaultId === a.id}
              >
                {a.isDefault ? "Default address" : "Set as default"}
              </Button>
            </div>
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="text-sm text-muted-foreground">No addresses yet. Add a new address.</div>
        )}
      </div>
    </Card>
  );
}
