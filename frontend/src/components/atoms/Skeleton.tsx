import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading content"
      className={clsx('skeleton-shimmer rounded-xl', className)}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="surface-card rounded-2xl p-4 flex flex-col gap-4" aria-hidden="true">
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-12 w-full" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
