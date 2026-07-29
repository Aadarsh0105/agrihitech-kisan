import MandiCard from "./MandiCard";
import { MandiRecord } from "../../types/mandi";

interface Props {
    records: MandiRecord[];
}

export default function MandiGrid({
    records,
}: Props) {
    return (
        <section className="mt-10">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {records.map((record, index) => (
                    <MandiCard
                        key={`${record.market}-${record.commodity}-${index}`}
                        record={record}
                    />
                ))}
            </div>
        </section>
    );
}