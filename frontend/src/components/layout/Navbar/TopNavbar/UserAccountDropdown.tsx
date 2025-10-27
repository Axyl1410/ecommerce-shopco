"use client";

import LogoutButton from "@/components/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/user.types";
import Image from "next/image";
import Link from "next/link";

interface UserAccountDropdownProps {
  isLoggedIn?: boolean;
  user: User | undefined;
}

const UserAccountDropdown = ({
  isLoggedIn = false,
  user,
}: UserAccountDropdownProps) => {
  if (!isLoggedIn) {
    return (
      <div className="flex items-center space-x-1 sm:space-x-2">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="hidden sm:inline-flex"
        >
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button size="sm" asChild className="text-xs sm:text-sm">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
        {/* Mobile fallback - chỉ hiển thị icon user */}
        <Button variant="ghost" size="icon" asChild className="sm:hidden">
          <Link href="/sign-in">
            <Image
              priority
              src="/icons/user.svg"
              height={20}
              width={20}
              alt="Sign in"
              className="h-5 w-5"
            />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="ml-4">
        <Button variant="ghost" size="icon">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.image || "/placeholder-avatar.jpg"}
              alt="User avatar"
            />
            <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={"/profile" as any}
            className="flex cursor-pointer items-center"
          >
            <Image
              src="/icons/user.svg"
              alt="Profile"
              width={16}
              height={16}
              className="mr-2"
            />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={"/orders" as any}
            className="flex cursor-pointer items-center"
          >
            <Image
              src="/icons/order.svg"
              alt="Orders"
              width={16}
              height={16}
              className="mr-2"
            />
            Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={"/wishlist" as any}
            className="flex cursor-pointer items-center"
          >
            <Image
              src="/icons/heart.svg"
              alt="Wishlist"
              width={16}
              height={16}
              className="mr-2"
            />
            Wishlist
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={"/settings" as any}
            className="flex cursor-pointer items-center"
          >
            <Image
              src="/icons/settings.svg"
              alt="Settings"
              width={16}
              height={16}
              className="mr-2"
            />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutButton
            variant="ghost"
            className="h-auto w-full justify-start p-2 font-normal hover:bg-red-50"
          >
            <Image
              src="/icons/logout.svg"
              alt="Logout"
              width={16}
              height={16}
              className="mr-2"
            />
            Logout
          </LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountDropdown;
