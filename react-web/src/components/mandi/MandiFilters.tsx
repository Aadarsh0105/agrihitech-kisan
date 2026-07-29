import { Search, RotateCcw, Filter } from "lucide-react";

interface Props {
    filters: {
        state?: string;
        district?: string;
        market?: string;
        commodity?: string;
    };

    states: string[];
    districts: string[];
    markets: string[];
    commodities: string[];
    loading: boolean;
    onSearch: () => void;
    updateFilter: (
        key: "state" | "district" | "market" | "commodity",
        value: string
    ) => void;
    resetFilters: () => void;
}

export default function MandiFilters({
    filters,
    states,
    districts,
    markets,
    commodities,
    loading,
    onSearch,
    updateFilter,
    resetFilters,
}: Props) {
    return (
        <section className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                        <Filter className="text-green-600" size={22} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Find Mandi Prices
                        </h2>
                        <p className="text-sm text-gray-500">
                            Search prices by location
                        </p>
                    </div>
                </div>
            </div>
            {/* Filters */}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {/* State */}
                <select value={filters.state} disabled={loading} onChange={(e) => updateFilter("state", e.target.value)}
                    className="h-12 rounded-2xl border border-gray-200 px-4">
                    <option value="">Select State</option>
                    {states.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
                {/* District */}
                <select value={filters.district} disabled={!filters.state || loading} onChange={(e) =>
                    updateFilter("district", e.target.value)} className="h-12 rounded-2xl border border-gray-200 px-4">
                    <option value="">Select District</option>
                    {districts.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
                {/* Market */}
                <select value={filters.market} disabled={!filters.district || loading} onChange={(e) =>
                    updateFilter("market", e.target.value)} className="h-12 rounded-2xl border border-gray-200 px-4">
                    <option value="">Select Market</option>
                    {markets.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
                {/* Commodity */}
                <select value={filters.commodity} disabled={!filters.market || loading} onChange={(e) =>
                    updateFilter("commodity", e.target.value)} className="h-12 rounded-2xl border border-gray-200 px-4">
                    <option value="">Select Commodity</option>
                    {commodities.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
            </div>
            <div className="mt-8 flex justify-end gap-3">
                <button onClick={resetFilters} className="flex items-center gap-2 rounded-xl border border-gray-200
                    px-4 py-2 text-sm font-medium transition hover:bg-green-600 hover:text-white">
                    <RotateCcw size={16} />
                    Reset
                </button>

                <button onClick={onSearch} disabled={loading} className="flex items-center gap-2 rounded-xl bg-green-600
                    px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50">
                    <Search size={18} />
                    {loading ? "Searching..." : "Search Prices"}
                </button>
            </div>
        </section>
    );
}