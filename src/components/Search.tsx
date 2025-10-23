import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useContentStore from "../store/useContentStore";
import { useDebounce } from "../hooks/useDebounce";

const SearchBar: React.FC = () => {
    const { setKeyword } = useContentStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const [value, setValue] = useState<string>(() => searchParams.get("q") ?? "");
    const debounced = useDebounce(value, 300);


    useEffect(() => {
        setKeyword(debounced);

        const current = searchParams.get("q") ?? "";
        const next = debounced.trim();
        if (next === current) return;

        const params = new URLSearchParams(searchParams);
        if (next) params.set("q", next);
        else params.delete("q");
        setSearchParams(params, { replace: true });
    }, [debounced]);


    const clear = () => setValue("");

    return (
        <div className="relative w-full ml-4">
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Find the items you're looking for"
                className="w-full rounded-md bg-[#151515] outline-none text-sm text-gray-200 placeholder-gray-500 py-3 pl-4 pr-12 focus:ring-1 focus:ring-green-400"
                spellCheck={false}
                aria-label="Keyword search"
            />

            {value && (
                <button
                    type="button"
                    onClick={clear}
                    className="absolute right-10 top-3 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                    aria-label="Clear search"
                    title="Clear"
                >
                    ×
                </button>
            )}

            <div className="absolute right-3 top-3 -translate-y-1/2 text-gray-300">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                    />
                </svg>
            </div>
        </div>
    );
};

export default SearchBar;
