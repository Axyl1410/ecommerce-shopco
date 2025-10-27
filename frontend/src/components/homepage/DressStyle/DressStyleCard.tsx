import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

type DressStyleCardProps = {
  title: string;
  url: string;
  className?: string;
};

const DressStyleCard = ({ title, url, className }: DressStyleCardProps) => {
  return (
    <Link
      href={url as any}
      className={cn([
        "w-full rounded-[20px] bg-white bg-cover bg-top bg-no-repeat px-6 py-4 text-left text-2xl font-bold md:h-full md:px-9 md:py-[25px] md:text-4xl",
        className,
      ])}
    >
      {title}
    </Link>
  );
};

export default DressStyleCard;
