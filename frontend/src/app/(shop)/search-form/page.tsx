"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SearchFormPage() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div className="max-w-frame mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Search Products</h1>
                <p className="text-gray-600">
                    Find your favorite products by name, brand, or category
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mb-8">
                <div className="relative">
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for products..."
                        className="w-full px-6 py-4 pr-14 text-lg border-2 border-gray-200 rounded-full focus:border-black focus:outline-none transition-colors"
                        required
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors"
                    >
                        <Image
                            src="/icons/search.svg"
                            width={24}
                            height={24}
                            alt="Search"
                            className="invert"
                        />
                    </button>
                </div>
            </form>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Search Tips:</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Try using product names or brands</li>
                    <li>Use specific keywords for better results</li>
                    <li>Check spelling if you don't find what you're looking for</li>
                </ul>
            </div>
        </div>
    );
}
