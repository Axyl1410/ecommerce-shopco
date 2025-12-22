import ComparisonTable from "@/components/comparison/ComparisonTable";

export const metadata = {
  title: "So sánh sản phẩm | Shopco",
  description: "So sánh các sản phẩm bạn đã chọn",
};

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ComparisonTable />
    </div>
  );
}


