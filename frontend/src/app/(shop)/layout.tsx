import TopBanner from "@/components/layout/Banner/TopBanner";
import Footer from "@/components/layout/Footer";
import TopNavbar from "@/components/layout/Navbar/TopNavbar";
import ComparisonFloatingButton from "@/components/comparison/ComparisonFloatingButton";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBanner />
      <TopNavbar />
      {children}
      <Footer />
      <ComparisonFloatingButton />
    </>
  );
}
