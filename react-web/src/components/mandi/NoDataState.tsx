import { SearchX, RotateCcw, MapPinned } from "lucide-react";

interface Props {
    onReset: () => void;
}

export default function NoDataState({
    onReset,
}: Props) {
    return (
        <section
            className="
                mt-10
                overflow-hidden
                rounded-3xl
                border
                border-green-100
                bg-gradient-to-br
                from-white
                via-green-50/40
                to-white
                p-12
                text-center
            "
        >
            {/* Icon */}

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <SearchX
                    size={48}
                    className="text-green-600"
                />
            </div>

            {/* Heading */}

            <h2 className="mt-8 text-3xl font-bold text-gray-900">
                No Mandi Prices Available
            </h2>

            {/* Description */}

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-600">
                We couldn't find any wholesale price data for your selected
                location or commodity. This usually means there are no prices
                published for the selected market today.
            </p>

            {/* Suggestions */}

            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-green-100 bg-white p-6 text-left shadow-sm">
                <div className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                    <MapPinned
                        size={20}
                        className="text-green-600"
                    />
                    Try the following
                </div>

                <ul className="space-y-3 text-gray-600">
                    <li>• Select a different Market.</li>
                    <li>• Choose another Commodity.</li>
                    <li>• Try a nearby District.</li>
                    <li>• Check again later after the next market update.</li>
                </ul>
            </div>

            {/* Action */}

            <button
                onClick={onReset}
                className="
                    mt-10
                    inline-flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-green-600
                    px-6
                    py-3
                    font-semibold
                    text-white
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-green-700
                    hover:shadow-lg
                "
            >
                <RotateCcw size={18} />

                Reset Filters
            </button>
        </section>
    );
}