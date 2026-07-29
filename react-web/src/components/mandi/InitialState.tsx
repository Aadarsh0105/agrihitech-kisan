import { SearchX, Wheat, RotateCcw } from "lucide-react";

interface Props {
  hasSearched?: boolean;
  onReset?: () => void;
}

export default function EmptyState({ hasSearched = false, onReset }: Props) {
  return (
    <section className="mt-8 rounded-[32px] border border-dashed border-green-200 bg-gradient-to-br from-white to-green-50 px-8 py-20 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">

        {hasSearched ? (
          <SearchX
            size={46}
            className="text-green-600"
          />
        ) : (
          <Wheat
            size={46}
            className="text-green-600"
          />
        )}

      </div>

      <h2 className="mt-8 text-3xl font-bold text-gray-900">

        {hasSearched
          ? "No Prices Found"
          : "Find Today's Mandi Prices"}

      </h2>

      <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-gray-600">

        {hasSearched
          ? "No mandi prices are available for the selected filters. Try another market or commodity."
          : "Choose your State, District, Market and Commodity to view today's verified wholesale prices from AGMARKNET."}

      </p>

      {hasSearched && (
        <button
          onClick={onReset}
          className="
            mt-8
            inline-flex
            items-center
            gap-2
            rounded-2xl
            bg-green-600
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-green-700
          "
        >
          <RotateCcw size={18} />

          Reset Filters
        </button>
      )}

    </section>
  );
}