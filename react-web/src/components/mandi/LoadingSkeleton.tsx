export default function LoadingSkeleton() {
  return (
    <section
      className="
        mt-10
        grid
        gap-6
        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="
            overflow-hidden
            rounded-3xl
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >
          {/* Header */}

          <div className="h-28 animate-pulse bg-gray-200" />

          {/* Body */}

          <div className="space-y-4 p-5">

            <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />

            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />

            <div className="grid grid-cols-3 gap-3">

              <div className="h-24 animate-pulse rounded-2xl bg-gray-200" />

              <div className="h-24 animate-pulse rounded-2xl bg-gray-200" />

              <div className="h-24 animate-pulse rounded-2xl bg-gray-200" />

            </div>

          </div>

        </div>
      ))}
    </section>
  );
}