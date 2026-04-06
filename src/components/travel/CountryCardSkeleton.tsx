const CountryCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-card shadow-card">
      {/* Image Skeleton */}
      <div className="aspect-[4/5] animate-pulse bg-muted">
        <div className="h-full w-full bg-gradient-to-r from-muted via-background to-muted animate-shimmer bg-[length:200%_100%]" />
      </div>

      {/* Badge Skeleton */}
      <div className="absolute right-4 top-4 h-7 w-24 animate-pulse rounded-full bg-muted" />

      {/* Content Skeleton */}
      <div className="absolute inset-x-0 bottom-0 p-6 space-y-3">
        <div className="h-4 w-20 animate-pulse rounded bg-muted/50" />
        <div className="h-8 w-40 animate-pulse rounded bg-muted/50" />
      </div>
    </div>
  );
};

export default CountryCardSkeleton;
