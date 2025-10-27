import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import type { PaymentBadge, SocialNetworks } from "./footer.types";
import LayoutSpacing from "./LayoutSpacing";
import LinksSection from "./LinksSection";
import NewsLetterSection from "./NewsLetterSection";

const socialsData: SocialNetworks[] = [
  {
    id: 1,
    icon: <FaTwitter />,
    url: "https://twitter.com",
  },
  {
    id: 2,
    icon: <FaFacebookF />,
    url: "https://facebook.com",
  },
  {
    id: 3,
    icon: <FaInstagram />,
    url: "https://instagram.com",
  },
  {
    id: 4,
    icon: <FaGithub />,
    url: "https://github.com/mohammadoftadeh",
  },
];

const paymentBadgesData: PaymentBadge[] = [
  {
    id: 1,
    srcUrl: "/icons/Visa.svg",
  },
  {
    id: 2,
    srcUrl: "/icons/mastercard.svg",
  },
  {
    id: 3,
    srcUrl: "/icons/paypal.svg",
  },
  {
    id: 4,
    srcUrl: "/icons/applePay.svg",
  },
  {
    id: 5,
    srcUrl: "/icons/googlePay.svg",
  },
];

const Footer = () => {
  return (
    <footer className="mt-10">
      <div className="relative">
        <div className="absolute bottom-0 h-1/2 w-full bg-[#F0F0F0]"></div>
        <div className="px-4">
          <NewsLetterSection />
        </div>
      </div>
      <div className="bg-[#F0F0F0] px-4 pb-4 pt-8 md:pt-[50px]">
        <div className="mx-auto max-w-frame">
          <nav className="mb-8 lg:grid lg:grid-cols-12">
            <div className="flex flex-col lg:col-span-3 lg:max-w-[248px]">
              <h1
                className={cn([
                  integralCF.className,
                  "mb-6 text-[28px] lg:text-[32px]",
                ])}
              >
                SHOP.CO
              </h1>
              <p className="mb-9 text-sm text-black/60">
                We have clothes that suits your style and which you’re proud to
                wear. From women to men.
              </p>
              <div className="flex items-center">
                {socialsData.map((social) => (
                  <Link
                    href={social.url as any}
                    key={social.id}
                    className="mr-3 flex h-7 w-7 items-center justify-center rounded-full border border-black/20 bg-white p-1.5 transition-all hover:bg-black hover:text-white"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
            <div className="col-span-9 hidden lg:grid lg:grid-cols-4 lg:pl-10">
              <LinksSection />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:hidden">
              <LinksSection />
            </div>
          </nav>

          <hr className="mb-6 h-[1px] border-t-black/10" />
          <div className="mb-2 flex flex-col items-center justify-center sm:flex-row sm:justify-between">
            <p className="mb-4 text-center text-sm text-black/60 sm:mb-0 sm:mr-1 sm:text-left">
              Shop.co © Made by{" "}
              <Link
                href="https://github.com/mohammadoftadeh"
                className="font-medium text-black"
              >
                Mohammad Oftadeh
              </Link>
              {", "}
              Designed by{" "}
              <Link
                href="https://www.figma.com/@hamzauix"
                className="font-medium text-black"
              >
                Hamza Naeem
              </Link>
            </p>
            <div className="flex items-center">
              {paymentBadgesData.map((badge, _, arr) => (
                <span
                  key={badge.id}
                  className={cn([
                    arr.length !== badge.id && "mr-3",
                    "flex h-[30px] w-[46px] items-center justify-center rounded-[5px] border-[#D6DCE5] bg-white",
                  ])}
                >
                  <Image
                    priority
                    src={badge.srcUrl}
                    width={33}
                    height={100}
                    alt="user"
                    className="max-h-[15px]"
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
        <LayoutSpacing />
      </div>
    </footer>
  );
};

export default Footer;
