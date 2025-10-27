import Link from "next/link";
import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type DressStyle = {
  title: string;
  slug: string;
};

const dressStylesData: DressStyle[] = [
  {
    title: "Casual",
    slug: "/shop?style=casual",
  },
  {
    title: "Formal",
    slug: "/shop?style=formal",
  },
  {
    title: "Party",
    slug: "/shop?style=party",
  },
  {
    title: "Gym",
    slug: "/shop?style=gym",
  },
];

const DressStyleSection = () => {
  return (
    <Accordion type="single" collapsible defaultValue="filter-style">
      <AccordionItem value="filter-style" className="border-none">
        <AccordionTrigger className="p-0 py-0.5 text-xl font-bold text-black hover:no-underline">
          Dress Style
        </AccordionTrigger>
        <AccordionContent className="pb-0 pt-4">
          <div className="flex flex-col space-y-0.5 text-black/60">
            {dressStylesData.map((dStyle, idx) => (
              <Link
                key={idx}
                href={dStyle.slug as any}
                className="flex items-center justify-between py-2"
              >
                {dStyle.title} <MdKeyboardArrowRight />
              </Link>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DressStyleSection;
