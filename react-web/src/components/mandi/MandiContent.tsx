import LoadingSkeleton from "./LoadingSkeleton";
import ErrorState from "./ErrorState";
import MandiGrid from "./MandiGrid";

import { MandiRecord } from "../../types/mandi";
import InitialState from "./InitialState";
import NoDataState from "./NoDataState";

interface Props {
    loading: boolean;
    error: string;
    hasSearched: boolean;
    records: MandiRecord[];
    reload: () => void;
    resetFilters: () => void;
}

export default function MandiContent({
    loading,
    error,
    hasSearched,
    records,
    reload,
    resetFilters,
}: Props) {

    if (loading)
        return <LoadingSkeleton />;

    if (error)
        return (
            <ErrorState
                message={error}
                onRetry={reload}
            />
        );

    if (!hasSearched)
        return <InitialState />;

    if (records.length === 0)
        return (
            <NoDataState
                onReset={resetFilters}
            />
        );

    return (
        <MandiGrid records={records}/>
    );
}