import { useEffect, useState } from "react";
import mandiService from "../services/mandi.service";
import { MandiFilters } from "../types/mandi";

export function useMandiOptions(filters: MandiFilters) {
    const [states, setStates] = useState<string[]>([]);
    const [districts, setDistricts] = useState<string[]>([]);
    const [markets, setMarkets] = useState<string[]>([]);
    const [commodities, setCommodities] = useState<string[]>([]);

    useEffect(() => {
        mandiService
            .getStates()
            .then(setStates)
            .catch(() => { });
    }, []);

    useEffect(() => {
        if (!filters.state) {
            setDistricts([]);
            return;
        }

        mandiService
            .getDistricts(filters.state)
            .then(setDistricts)
            .catch(() => setDistricts([]));
    }, [filters.state]);

    useEffect(() => {
        if (!filters.state || !filters.district) {
            setMarkets([]);
            return;
        }

        mandiService
            .getMarkets(
                filters.state,
                filters.district
            )
            .then(setMarkets)
            .catch(() => setMarkets([]));
    }, [
        filters.state,
        filters.district,
    ]);

    useEffect(() => {
        if (
            !filters.state ||
            !filters.district ||
            !filters.market
        ) {
            setCommodities([]);
            return;
        }

        mandiService
            .getCommodities(
                filters.state,
                filters.district,
                filters.market
            )
            .then(setCommodities)
            .catch(() => setCommodities([]));
    }, [
        filters.state,
        filters.district,
        filters.market,
    ]);

    return {
        states,
        districts,
        markets,
        commodities,
    };
}