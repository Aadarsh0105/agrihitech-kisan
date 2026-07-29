// import { useCallback, useEffect, useState } from "react";

// import mandiService from "../services/mandi.service";

// import {
//   DEFAULT_LIMIT,
//   DEFAULT_OFFSET,
// } from "../constants/mandi";

// import {
//   MandiFilters,
//   MandiRecord,
// } from "../types/mandi";

// export function useMandiBhav() {
//   /* ----------------------------- Data ----------------------------- */

//   const [records, setRecords] = useState<MandiRecord[]>([]);
//   const [total, setTotal] = useState(0);

//   /* ---------------------------- Filters --------------------------- */

//   const [filters, setFilters] = useState<MandiFilters>({
//     state: "",
//     district: "",
//     market: "",
//     commodity: "",
//     limit: DEFAULT_LIMIT,
//     offset: DEFAULT_OFFSET,
//   });

//   /* ---------------------------- Dropdowns ------------------------- */

//   const [states, setStates] = useState<string[]>([]);
//   const [districts, setDistricts] = useState<string[]>([]);
//   const [markets, setMarkets] = useState<string[]>([]);
//   const [commodities, setCommodities] = useState<string[]>([]);

//   /* ---------------------------- Status ---------------------------- */

//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState("");

//   /* ================================================================ */

//   const loadPrices = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response =
//         await mandiService.getPrices(filters);

//       setRecords(response.records);
//       setTotal(response.total);
//     } catch (err: any) {
//       setError(err.message || "Unable to load data");
//     } finally {
//       setLoading(false);
//     }
//   }, [filters]);

//   /* ================================================================ */

//   const loadStates = useCallback(async () => {
//     try {
//       const data = await mandiService.getStates();
//       setStates(data);
//     } catch {}
//   }, []);

//   const loadDistricts = useCallback(async () => {
//     if (!filters.state) {
//       setDistricts([]);
//       return;
//     }

//     try {
//       const data =
//         await mandiService.getDistricts(
//           filters.state
//         );

//       setDistricts(data);
//     } catch {}
//   }, [filters.state]);

//   const loadMarkets = useCallback(async () => {
//     if (
//       !filters.state ||
//       !filters.district
//     ) {
//       setMarkets([]);
//       return;
//     }

//     try {
//       const data =
//         await mandiService.getMarkets(
//           filters.state,
//           filters.district
//         );

//       setMarkets(data);
//     } catch {}
//   }, [
//     filters.state,
//     filters.district,
//   ]);

//   const loadCommodities =
//     useCallback(async () => {
//       try {
//         const data =
//           await mandiService.getCommodities();

//         setCommodities(data);
//       } catch {}
//     }, []);

//   /* ================================================================ */

//   const updateFilter = <
//     K extends keyof MandiFilters
//   >(
//     key: K,
//     value: MandiFilters[K]
//   ) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value,
//       offset: DEFAULT_OFFSET,
//     }));
//   };

//   /* ================================================================ */

//   const resetFilters = () => {
//     setFilters({
//       state: "",
//       district: "",
//       market: "",
//       commodity: "",
//       limit: DEFAULT_LIMIT,
//       offset: DEFAULT_OFFSET,
//     });

//     setDistricts([]);
//     setMarkets([]);
//   };

//   /* ================================================================ */

//   const nextPage = () => {
//     setFilters((prev) => ({
//       ...prev,
//       offset:
//         (prev.offset ?? 0) +
//         (prev.limit ?? DEFAULT_LIMIT),
//     }));
//   };

//   const previousPage = () => {
//     setFilters((prev) => ({
//       ...prev,
//       offset: Math.max(
//         0,
//         (prev.offset ?? 0) -
//           (prev.limit ??
//             DEFAULT_LIMIT)
//       ),
//     }));
//   };

//   /* ================================================================ */

//   useEffect(() => {
//     loadStates();
//     loadCommodities();
//   }, []);

//   useEffect(() => {
//     loadDistricts();
//   }, [loadDistricts]);

//   useEffect(() => {
//     loadMarkets();
//   }, [loadMarkets]);

//   useEffect(() => {
//     loadPrices();
//   }, [loadPrices]);

//   /* ================================================================ */

//   return {
//     records,
//     total,

//     loading,
//     error,

//     filters,

//     states,
//     districts,
//     markets,
//     commodities,

//     updateFilter,
//     resetFilters,

//     nextPage,
//     previousPage,

//     reload: loadPrices,
//   };
// }