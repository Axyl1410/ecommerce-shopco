import React from "react";

export type SpecItem = {
  label: string;
  value: string;
};

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

const ProductDetails = ({ productData }: { productData: ProductData }) => {
  // Generate specs from product data
  const specsData: SpecItem[] = [];

  if (productData.brandName) {
    specsData.push({ label: "Brand", value: productData.brandName });
  }

  if (productData.categoryName) {
    specsData.push({ label: "Category", value: productData.categoryName });
  }

  if (productData.description) {
    specsData.push({ label: "Description", value: productData.description });
  }

  // Add variant specs if available
  if (productData.variants && productData.variants.length > 0) {
    const variant = productData.variants[0];
    if (variant.attributes) {
      try {
        const attributes = JSON.parse(variant.attributes);
        Object.entries(attributes).forEach(([key, value]) => {
          specsData.push({ label: key, value: String(value) });
        });
      } catch (e) {
        // If attributes is not valid JSON, skip
      }
    }
  }

  // Fallback specs if no data
  if (specsData.length === 0) {
    specsData.push(
      { label: "Material composition", value: "100% Cotton" },
      { label: "Care instructions", value: "Machine wash warm, tumble dry" },
      { label: "Fit type", value: "Classic Fit" },
      { label: "Pattern", value: "Solid" }
    );
  }

  return (
    <>
      {specsData.map((item, i) => (
        <div className="grid grid-cols-3" key={i}>
          <div>
            <p className="text-sm py-3 w-full leading-7 lg:py-4 pr-2 text-neutral-500">
              {item.label}
            </p>
          </div>
          <div className="col-span-2 py-3 lg:py-4 border-b">
            <p className="text-sm w-full leading-7 text-neutral-800 font-medium">{item.value}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductDetails;
