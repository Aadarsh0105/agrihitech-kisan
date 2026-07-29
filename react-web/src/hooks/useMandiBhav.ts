// import {
//   useEffect,
//   useState,
// } from "react";

// import mandiService from "../services/mandi.service";

// import {
//   MandiFilters,
//   MandiRecord,
// } from "../types/mandi";

// export function useMandiBhav(
//   filters: MandiFilters,
// ) {

//   const [
//     loading,
//     setLoading,
//   ] = useState(true);

//   const [
//     error,
//     setError,
//   ] = useState("");

//   const [
//     records,
//     setRecords,
//   ] = useState<MandiRecord[]>([]);

//   const [
//     total,
//     setTotal,
//   ] = useState(0);

//   async function load() {

//     try {

//       setLoading(true);

//       setError("");

//       const data =
//         await mandiService.getPrices(
//           filters,
//         );

//       setRecords(
//         data.records,
//       );

//       setTotal(
//         data.total,
//       );

//     } catch (e: any) {

//       setError(
//         e.message,
//       );

//     } finally {

//       setLoading(false);

//     }

//   }

//   useEffect(() => {

//     load();

//   }, [JSON.stringify(filters)]);

//   return {

//     loading,

//     error,

//     records,

//     total,

//     reload: load,

//   };

// }
import { useState } from "react";

import mandiService from "../services/mandi.service";

import {
  MandiFilters,
  MandiRecord,
} from "../types/mandi";

export function useMandiBhav() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [records, setRecords] = useState<MandiRecord[]>([]);

  const [total, setTotal] = useState(0);

  const load = async (filters: MandiFilters) => {
    try {
      setLoading(true);

      setError("");

      const data = await mandiService.getPrices(filters);

      setRecords(data.records);

      setTotal(data.total);
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setRecords([]);
    setTotal(0);
    setError("");
  };

  return {
    loading,
    error,
    records,
    total,
    search: load,
    clear,
  };
}