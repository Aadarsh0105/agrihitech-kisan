import {
    DEFAULT_LIMIT,
    GOV_API,
    GOV_API_KEY,
    GOV_RESOURCE,
} from "../constants/mandi";

import {
    buildQuery,
    unique,
} from "../utils/mandi";

import {
    MandiApiResponse,
    MandiFilters,
    MandiRecord,
} from "../types/mandi";

import states from "../../public/data/states.json";
import districts from "../../public/data/districts.json";

class MandiService {
    /**
     * Generic API Request
     */
    private async request(
        params: Record<string, unknown>
    ): Promise<MandiApiResponse> {
        const query = buildQuery({
            "api-key": GOV_API_KEY,
            format: "json",
            limit: DEFAULT_LIMIT,
            offset: 0,
            ...params,
        });

        const response = await fetch(
            `${GOV_API}/${GOV_RESOURCE}?${query}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch mandi data.");
        }

        const data = await response.json();

        return {
            total: data.total ?? 0,
            count: data.count ?? 0,
            limit: data.limit ?? DEFAULT_LIMIT,
            offset: data.offset ?? 0,
            records: data.records ?? [],
        };
    }

    /**
     * Get All States (Local JSON)
     */
    async getStates(): Promise<string[]> {
        return states.map((item) => item.value);
    }

    /**
     * Get Districts (Local JSON)
     */
    async getDistricts(state: string): Promise<string[]> {
        return (
            districts[state as keyof typeof districts] ?? []
        );
    }

    /**
     * Get Markets
     */
    async getMarkets(
        state: string,
        district: string
    ): Promise<string[]> {
        const data = await this.request({
            limit: 10000,
            "filters[state]": state,
            "filters[district]": district,
        });

        return unique(
            data.records.map((item) => item.market)
        );
    }

    /**
     * Get Commodities
     */
    async getCommodities(
        state?: string,
        district?: string,
        market?: string
    ): Promise<string[]> {
        const params: Record<string, unknown> = {
            limit: 10000,
        };

        if (state) {
            params["filters[state]"] = state;
        }

        if (district) {
            params["filters[district]"] = district;
        }

        if (market) {
            params["filters[market]"] = market;
        }

        const data = await this.request(params);

        return unique(
            data.records.map((item) => item.commodity)
        );
    }

    /**
     * Get Prices
     */
    async getPrices(
        filters: MandiFilters = {}
    ): Promise<MandiApiResponse> {
        const params: Record<string, unknown> = {
            limit: filters.limit ?? DEFAULT_LIMIT,
            offset: filters.offset ?? 0,
        };

        if (filters.state) {
            params["filters[state]"] = filters.state;
        }

        if (filters.district) {
            params["filters[district]"] = filters.district;
        }

        if (filters.market) {
            params["filters[market]"] = filters.market;
        }

        if (filters.commodity) {
            params["filters[commodity]"] = filters.commodity;
        }

        return this.request(params);
    }

    /**
     * Commodity List by State
     */
    async getCommodityByState(
        state: string
    ): Promise<string[]> {
        const data = await this.request({
            limit: 10000,
            "filters[state]": state,
        });

        return unique(
            data.records.map((item) => item.commodity)
        );
    }

    /**
     * Commodity List by District
     */
    async getCommodityByDistrict(
        state: string,
        district: string
    ): Promise<string[]> {
        const data = await this.request({
            limit: 10000,
            "filters[state]": state,
            "filters[district]": district,
        });

        return unique(
            data.records.map((item) => item.commodity)
        );
    }

    /**
     * Latest Records
     */
    async getLatestRecords(): Promise<MandiRecord[]> {
        const data = await this.request({
            limit: DEFAULT_LIMIT,
        });

        return data.records;
    }
}

export default new MandiService();