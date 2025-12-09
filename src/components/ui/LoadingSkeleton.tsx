import { Skeleton } from "@/components/ui/skeleton";

export function CardAnnouncementSkeleton({ imageHeight = "h-48" }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-card animate-pulse">
      <Skeleton className={`w-full ${imageHeight}`} />

      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />

        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-28" />
          <div className="flex space-x-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnnouncementListSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardAnnouncementSkeleton key={i} />
      ))}
    </div>
  );
}
