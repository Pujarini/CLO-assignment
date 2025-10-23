import React from "react";
import {
    ContentItem,
    PRICING_LABELS,
    PricingOptionEnum,
} from "../constants/content.types";

interface Props {
    item: ContentItem;
}

const ContentCard: React.FC<Props> = ({ item }) => {
    const { title, creator, imagePath, price, pricingOption } = item;
    const label = PRICING_LABELS[pricingOption];

    const renderPrice = () => {
        switch (pricingOption) {
            case PricingOptionEnum.Free:
                return <span>FREE</span>;
            case PricingOptionEnum.ViewOnly:
                return <span>{label}</span>;
            case PricingOptionEnum.Paid:
                return <span>${price.toFixed(2)}</span>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-[#111] text-white rounded-xl shadow-md overflow-hidden cursor-pointer">
            <img
                src={imagePath}
                alt={title}
                className="w-full h-64 object-cover bg-gray-800"
            />
            <div className="p-3 flex justify-between items-start">
                <div className="flex flex-col justify-between p-1">
                    <h3
                        className="text-lg font-semibold max-w-[150px] truncate"
                        title={title}
                    >
                        {title}
                    </h3>
                    <p className="text-sm text-gray-400">{creator}</p>
                </div>

                <div className="mt-1 text-right text-sm">{renderPrice()}</div>
            </div>
        </div>
    );
};

export default ContentCard;
