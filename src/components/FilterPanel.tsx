import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useContentStore from "../store/useContentStore";
import PriceSlider from "./PriceSlider";

const FILTER_OPTIONS = ["Paid", "Free", "View Only"];
type FilterOption = (typeof FILTER_OPTIONS)[number];

const FilterPanel: React.FC = () => {
    const { setPricingFilter, resetFilters, filters } = useContentStore();
    const [searchParams, setSearchParams] = useSearchParams();

    const [selected, setSelected] = useState<string[]>(filters.pricing);

    const isSelected = useCallback(
        (opt: FilterOption) => selected.includes(opt),
        [selected]
    );

    const toggleOption = useCallback(
        (option: FilterOption) => {
            const updated = isSelected(option)
                ? selected.filter((o) => o !== option)
                : [...selected, option];

            setSelected(updated);
            setPricingFilter(updated);
            const params = new URLSearchParams(searchParams);
            params.set("pricing", updated.join(","));
            setSearchParams(params);
        },
        [isSelected, selected, setPricingFilter, searchParams, setSearchParams]
    );

    const handleReset = useCallback(() => {
        setSelected([]);
        resetFilters();

        const params = new URLSearchParams(searchParams);
        params.delete("pricing");
        params.delete("q");
        params.delete("min");
        params.delete("max");
        params.delete("sort");
        setSearchParams(params, { replace: true });
    }, [resetFilters, searchParams, setSearchParams]);


    useEffect(() => {
        const pricingFromURL = searchParams.get("pricing");
        if (pricingFromURL) {
            const opts = pricingFromURL.split(",").filter(Boolean);
            setSelected(opts);
            setPricingFilter(opts);
        }
    }, []);

    const showReset =
        selected.length > 0 || filters.priceMin !== 0 || filters.priceMax !== 999;

    return (
        <div className="mt-6 p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="text-gray-400 text-sm">Pricing Option</span>
                    {FILTER_OPTIONS.map((opt) => (
                        <label
                            key={opt}
                            className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(opt)}
                                onChange={() => toggleOption(opt)}
                                className="accent-green-400 cursor-pointer"
                            />
                            {opt}
                        </label>
                    ))}
                </div>

                {selected.includes("Paid") && <PriceSlider />}
                {showReset && (
                    <button
                        onClick={handleReset}
                        className="text-sm text-gray-300 hover:text-white px-3 py-1 transition cursor-pointer"
                    >
                        RESET
                    </button>
                )}
            </div>


        </div>
    );
};

export default FilterPanel;
