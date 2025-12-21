import React from "react";
import ProductDetails from "./ProductDetails";

type ProductData = {
  id: string;
  title: string;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  brandName?: string;
  variants?: any[];
  reviews?: any[];
  tags?: string[];
};

const ProductDetailsContent = ({ productData }: { productData: ProductData }) => {
  return (
    <section>
      <h3 className="text-xl sm:text-2xl font-bold text-black mb-5 sm:mb-6">
        Product specifications
      </h3>
      <ProductDetails productData={productData} />
    </section>
  );
};

export default ProductDetailsContent;
