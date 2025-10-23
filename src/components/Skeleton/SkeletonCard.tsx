import React from "react";

const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-[#111] rounded-xl overflow-hidden shadow animate-pulse">
            <div className="w-full aspect-4/3 bg-gray-800" />
            <div className="p-3">
                <div className="h-5 bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-700 rounded w-1/3" />
                <div className="mt-3 flex justify-end">
                    <div className="h-5 bg-gray-700 rounded w-20" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
