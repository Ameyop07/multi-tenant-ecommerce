export default function Skeleton({ className = "" }) {
  return <div aria-hidden="true" className={`skeleton ${className}`} />;
}

// Mirrors the shape of ProductCard so grids don't jump when data lands.
export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function StoreCardSkeleton() {
  return (
    <div className="card space-y-3 p-6">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function ListRowSkeleton() {
  return (
    <div className="card space-y-3 p-5">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card space-y-3 p-5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-7 w-28" />
    </div>
  );
}

export function ChartSkeleton({ height = 280 }) {
  return (
    <div className="card p-5">
      <Skeleton className="mb-4 h-4 w-40" />
      <Skeleton style={{ height }} className="w-full" />
    </div>
  );
}

export function GridSkeleton({ count = 8, Item = ProductCardSkeleton, className = "" }) {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, i) => (
        <Item key={i} />
      ))}
    </div>
  );
}
