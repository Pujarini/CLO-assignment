import React, { useEffect, useMemo } from "react";
import useContentStore from "../store/useContentStore";
import InfiniteScroll from "react-infinite-scroll-component";
import ContentCard from "./Contentcard";
import SkeletonGrid from "./Skeleton/SkeleonGrid";

const GRID_CLASSES =
    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6";

const ContentList: React.FC = () => {
    const {
        filteredContents,
        visibleCount,
        fetchContents,
        loadMore,
        loadingMore,
        loading,
        error,
    } = useContentStore();

    const visibleItems = useMemo(
        () => filteredContents.slice(0, visibleCount),
        [filteredContents, visibleCount]
    );

    useEffect(() => {
        fetchContents();
    }, []);

    if (loading) {
        return (
            <div className="p-4">
                <SkeletonGrid count={12} />
            </div>
        );
    }

    if (error) {
        return <p className="text-center mt-10 text-red-400">{error}</p>;
    }




    const hasMore = visibleItems.length < filteredContents.length;

    const loader = loadingMore ? (
        <div className="mt-6">
            <SkeletonGrid count={4} />
        </div>
    ) : null;

    if (!visibleItems.length) {
        return (
            <div className="p-8 text-center text-gray-400">
                No content found.
            </div>
        );
    }

    return (
        <div className="p-4">
            <InfiniteScroll
                dataLength={visibleItems.length}
                next={loadMore}
                hasMore={hasMore}
                loader={loader}
                scrollThreshold={0.9}
            >
                <div className={GRID_CLASSES} aria-busy={loadingMore ? "true" : "false"}>
                    {visibleItems.map((item) => (
                        <ContentCard key={item.id} item={item} />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default ContentList;
