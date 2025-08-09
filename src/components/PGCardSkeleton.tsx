export default function PGCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 aspect-square flex flex-col animate-pulse">
      {/* Image Section Skeleton */}
      <div className="relative h-48 bg-gray-200 flex-shrink-0">
        {/* Badges Skeleton */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <div className="bg-gray-300 h-6 w-16 rounded-full"></div>
          <div className="bg-gray-300 h-6 w-12 rounded-full"></div>
        </div>
        {/* Rating Skeleton */}
        <div className="absolute top-3 right-3 bg-gray-300 h-6 w-12 rounded-lg"></div>
      </div>

      {/* Content Section Skeleton */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Header Skeleton */}
        <div className="mb-3">
          <div className="bg-gray-300 h-6 w-3/4 rounded mb-2"></div>
          <div className="bg-gray-200 h-4 w-full rounded mb-1"></div>
          <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
        </div>

        {/* Pricing Skeleton */}
        <div className="mb-3 text-center">
          <div className="bg-gray-300 h-6 w-20 rounded mx-auto mb-1"></div>
          <div className="bg-gray-200 h-3 w-16 rounded mx-auto"></div>
        </div>

        {/* Facilities Skeleton */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
            <div className="bg-gray-200 h-6 w-12 rounded-full"></div>
            <div className="bg-gray-200 h-6 w-14 rounded-full"></div>
            <div className="bg-gray-200 h-6 w-10 rounded-full"></div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex gap-2 mt-auto">
          <div className="flex-1 bg-gray-200 h-10 rounded-lg"></div>
          <div className="flex-1 bg-gray-300 h-10 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}