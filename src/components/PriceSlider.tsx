import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useContentStore from "../store/useContentStore";

const MIN = 0;
const MAX = 999;
const STEP = 1;

const clamp = (v: number, min = MIN, max = MAX) => Math.max(min, Math.min(max, v));

const PriceSlider: React.FC = () => {
    const { filters, setPriceRange, clearPriceRange } = useContentStore();
    const [params, setParams] = useSearchParams();

    const isEnabled = useMemo(() => filters.pricing.includes("Paid"), [filters.pricing]);
    const [minVal, setMinVal] = useState<number>(filters.priceMin ?? MIN);
    const [maxVal, setMaxVal] = useState<number>(filters.priceMax ?? MAX);

    useEffect(() => {
        const urlMin = Number(params.get("min"));
        const urlMax = Number(params.get("max"));

        if (!Number.isNaN(urlMin) || !Number.isNaN(urlMax)) {
            const m1 = clamp(Number.isNaN(urlMin) ? MIN : urlMin);
            const m2 = clamp(Number.isNaN(urlMax) ? MAX : urlMax);
            const a = Math.min(m1, m2);
            const b = Math.max(m1, m2);
            setMinVal(a);
            setMaxVal(b);
            if (isEnabled) setPriceRange(a, b);
        } else {
            setMinVal(filters.priceMin ?? MIN);
            setMaxVal(filters.priceMax ?? MAX);
        }
    }, []);

    useEffect(() => {
        if (!isEnabled) {
            clearPriceRange();
            const p = new URLSearchParams(params);
            p.delete("min");
            p.delete("max");
            setParams(p, { replace: true });
        }
    }, [isEnabled]);


    const commit = () => {
        if (!isEnabled) return;
        const a = clamp(Math.min(minVal, maxVal - 1));
        const b = clamp(Math.max(maxVal, minVal + 1));
        setMinVal(a);
        setMaxVal(b);
        setPriceRange(a, b);

        const p = new URLSearchParams(params);
        if (a !== MIN) p.set("min", String(a)); else p.delete("min");
        if (b !== MAX) p.set("max", String(b)); else p.delete("max");
        setParams(p, { replace: true });
    };


    const handleMinChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const next = Number(e.target.value);
            setMinVal(Math.min(next, maxVal - 1));
        },
        [maxVal]
    );

    const handleMaxChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const next = Number(e.target.value);
            setMaxVal(Math.max(next, minVal + 1));
        },
        [minVal]
    );

    const leftPercent = useMemo(
        () => ((minVal - MIN) / (MAX - MIN)) * 100,
        [minVal]
    );
    const rightPercent = useMemo(
        () => ((maxVal - MIN) / (MAX - MIN)) * 100,
        [maxVal]
    );

    return (
        <div className={`mt-3 px-2 ${isEnabled ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                <span>{MIN}</span>
                <div className="flex-1 h-px bg-gray-700" />
                <span>{MAX}</span>
            </div>

            <div className="relative h-8">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded bg-gray-700" />

                <div
                    className="absolute top-1/2 -translate-y-1/2 h-1 rounded bg-emerald-500"
                    style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }}
                />

                <input
                    type="range"
                    min={MIN}
                    max={MAX}
                    step={STEP}
                    value={minVal}
                    onChange={handleMinChange}
                    onMouseUp={commit}
                    onTouchEnd={commit}
                    className="absolute pointer-events-auto appearance-none w-full h-8 bg-transparent top-0"
                />


                <input
                    type="range"
                    min={MIN}
                    max={MAX}
                    step={STEP}
                    value={maxVal}
                    onChange={handleMaxChange}
                    onMouseUp={commit}
                    onTouchEnd={commit}
                    className="absolute pointer-events-auto appearance-none w-full h-8 bg-transparent top-0"
                />
            </div>

            <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-200">${minVal}</span>
                <span className="text-gray-200">${maxVal}</span>
            </div>
        </div>
    );
};

export default PriceSlider;
