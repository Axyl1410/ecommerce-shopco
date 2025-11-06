import SpinnerbLoader from "./ui/SpinnerbLoader";

export default function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <SpinnerbLoader className="w-10 border-2 border-gray-300 border-r-gray-600" />
    </div>
  );
}
