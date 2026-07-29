import { useState } from "react";

import MandiHero from "../components/mandi/MandiHero";
import MandiStats from "../components/mandi/MandiStats";
import MandiFilters from "../components/mandi/MandiFilters";
import MandiGrid from "../components/mandi/MandiGrid";

import { useMandiBhav } from "../hooks/useMandiBhav";
import { useMandiOptions } from "../hooks/useMandiOptions";

import { MandiFilters as MandiFiltersType } from "../types/mandi";
import MandiContent from "../components/mandi/MandiContent";

export default function MandiBhav() {
    const [hasSearched, setHasSearched] = useState(false);
    const [filters, setFilters] = useState<MandiFiltersType>({
        state: "",
        district: "",
        market: "",
        commodity: "",
        limit: 20,
        offset: 0,
    });

    const {
        loading,
        error,
        records,
        total,
        search,
        clear,
    } = useMandiBhav();

    const {
        states,
        districts,
        markets,
        commodities,
    } = useMandiOptions(filters);

    const updateFilter = (
        key: keyof MandiFiltersType,
        value: string
    ) => {
        setFilters(prev => {
            const updated = {
                ...prev,
                [key]: value,
                offset: 0,
            };

            if (key === "state") {
                updated.district = "";
                updated.market = "";
                updated.commodity = "";
            }

            if (key === "district") {
                updated.market = "";
                updated.commodity = "";
            }

            if (key === "market") {
                updated.commodity = "";
            }

            return updated;
        });

        setHasSearched(false);
        clear();
    };
    const resetFilters = () => {
        setFilters({
            state: "",
            district: "",
            market: "",
            commodity: "",
            limit: 20,
            offset: 0,
        });

        setHasSearched(false);
        clear();
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="container mx-auto px-4 pt-4">
                <MandiHero total={total} />
            </section>

            {/* <section className="container mx-auto px-4">
                <MandiStats total={total} />
            </section> */}

            <section className="container mx-auto px-4">
                <MandiFilters
                    filters={filters}
                    loading={loading}
                    states={states}
                    districts={districts}
                    markets={markets}
                    commodities={commodities}
                    updateFilter={updateFilter}
                    resetFilters={resetFilters}
                    onSearch={async () => { setHasSearched(true); await search(filters); }}
                />
            </section>

            <section className="container mx-auto px-4 pb-16">
                {/* <MandiGrid
                    loading={loading}
                    error={error}
                    records={records}
                    reload={() => search(filters)}
                /> */}
                <MandiContent
                    loading={loading}
                    error={error}
                    hasSearched={hasSearched}
                    records={records}
                    reload={() => search(filters)}
                    resetFilters={resetFilters}
                />
            </section>
        </main>
    );
}