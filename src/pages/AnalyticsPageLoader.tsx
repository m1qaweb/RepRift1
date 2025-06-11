import Skeleton from "../components/UI/Skeleton";

const AnalyticsPageLoader: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-3">
          <Skeleton className="h-12 w-48 mb-6" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-96 rounded-xl" />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPageLoader; 