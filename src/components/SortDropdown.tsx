import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useContentStore from "../store/useContentStore";
import { SortBy } from "../constants/content.types";

const OPTIONS: { label: string; value: SortBy }[] = [
    { label: "Name(Default)", value: "name" },
    { label: "Price(High to Low)", value: "priceHigh" },
    { label: "Price(Low to High)", value: "priceLow" },
];

const SortDropdown: React.FC = () => {
    const { filters, setSortBy } = useContentStore();
    const [searchParams, setSearchParams] = useSearchParams();

    const [value, setValue] = useState<SortBy>(() => {
        const s = searchParams.get("sort");
        return (s as SortBy) || "name";
    });

    useEffect(() => {
        if (filters.sortBy !== value) setSortBy(value);

        const current = (searchParams.get("sort") as SortBy) || "name";
        if (current !== value) {
            const params = new URLSearchParams(searchParams);
            if (value === "name") params.delete("sort"); // default: keep URL clean
            else params.set("sort", value);
            setSearchParams(params, { replace: true });
        }
    }, [value]);

    return (
        <div className="flex justify-end items-center gap-3">
            <span className="text-sm text-gray-300">Sort by</span>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => setValue(e.target.value as SortBy)}
                    className="appearance-none bg-transparent text-sm text-gray-100 border-b border-gray-600 focus:border-green-400 outline-none pr-6 py-1"
                    aria-label="Sort content"
                >
                    {OPTIONS.map((o) => (
                        <option key={o.value} value={o.value} className="bg-[#0f0f0f]">
                            {o.label}
                        </option>
                    ))}
                </select>
                <svg
                    className="pointer-events-none absolute right-0 top-2 -translate-y-1/2 w-4 h-4 text-gray-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.2l3.71-3.97a.75.75 0 111.08 1.04l-4.25 4.55a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
                </svg>
            </div>
        </div>
    );
};

export default SortDropdown;
