import InputGroup from "@/components/ui/input-group";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { NavMenu } from "../navbar.types";
import CartBtn from "./CartBtn";
import { MenuItem } from "./MenuItem";
import { MenuList } from "./MenuList";
import ResTopNavbar from "./ResTopNavbar";
import UserAccountDropdown from "./UserAccountDropdown";

const data: NavMenu = [
  {
    id: 1,
    label: "Shop",
    type: "MenuList",
    children: [
      {
        id: 11,
        label: "Men's clothes",
        url: "/shop#men-clothes",
        description: "In attractive and spectacular colors and designs",
      },
      {
        id: 12,
        label: "Women's clothes",
        url: "/shop#women-clothes",
        description: "Ladies, your style and tastes are important to us",
      },
      {
        id: 13,
        label: "Kids clothes",
        url: "/shop#kids-clothes",
        description: "For all ages, with happy and beautiful colors",
      },
      {
        id: 14,
        label: "Bags and Shoes",
        url: "/shop#bag-shoes",
        description: "Suitable for men, women and all tastes and styles",
      },
    ],
  },
  {
    id: 2,
    type: "MenuItem",
    label: "On Sale",
    url: "/shop#on-sale",
    children: [],
  },
  {
    id: 3,
    type: "MenuItem",
    label: "New Arrivals",
    url: "/shop#new-arrivals",
    children: [],
  },
  {
    id: 4,
    type: "MenuItem",
    label: "Brands",
    url: "/shop#brands",
    children: [],
  },
];

const TopNavbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="sticky top-0 z-20 bg-white">
      <div className="relative mx-auto flex max-w-frame items-center justify-between px-4 py-5 md:justify-start md:py-6 xl:px-0">
        <div className="flex items-center">
          <div className="mr-4 block md:hidden">
            <ResTopNavbar data={data} />
          </div>
          <Link
            href="/"
            className={cn([
              integralCF.className,
              "mb-2 mr-3 text-2xl lg:mr-10 lg:text-[32px]",
            ])}
          >
            SHOP.CO
          </Link>
        </div>
        <NavigationMenu className="mr-2 hidden md:flex lg:mr-7">
          <NavigationMenuList>
            {data.map((item) => (
              <React.Fragment key={item.id}>
                {item.type === "MenuItem" && (
                  <MenuItem label={item.label} url={item.url} />
                )}
                {item.type === "MenuList" && (
                  <MenuList data={item.children} label={item.label} />
                )}
              </React.Fragment>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <InputGroup className="mr-3 hidden bg-[#F0F0F0] md:flex lg:mr-10">
          <InputGroup.Text>
            <Image
              priority
              src="/icons/search.svg"
              height={20}
              width={20}
              alt="search"
              className="min-h-5 min-w-5"
            />
          </InputGroup.Text>
          <InputGroup.Input
            type="search"
            name="search"
            placeholder="Search for products..."
            className="bg-transparent placeholder:text-black/40"
          />
        </InputGroup>
        <div className="flex items-center space-x-2">
          <Link
            href={"/search" as any}
            className="block p-1 transition-all duration-200 hover:scale-105 hover:opacity-80 md:hidden"
          >
            <Image
              priority
              src="/icons/search-black.svg"
              height={100}
              width={100}
              alt="Search products"
              className="max-h-[22px] max-w-[22px]"
            />
          </Link>
          <CartBtn />
          <UserAccountDropdown
            isLoggedIn={!!session?.user?.id}
            user={session?.user}
          />
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
