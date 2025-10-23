import React from "react";
import SkeletonCard from "./SkeletonCard";

const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 12 }) => {
    return (
        <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
            role="status"
        >
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
};

export default SkeletonGrid;
