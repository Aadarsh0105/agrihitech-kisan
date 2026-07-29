import { CalendarDays, MapPin, Sprout, IndianRupee } from "lucide-react";
import { formatDate, formatPrice } from "../../utils/mandi";
import { MandiRecord } from "../../types/mandi";
interface Props {
    record: MandiRecord;
}

export default function MandiCard({ record }: Props) {
    return (
        <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white
            shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-3 text-white">
                <div className="flex items-center gap-2">
                    <Sprout size={20} />
                    <h3 className="text-lg font-bold">
                        {record.commodity}
                    </h3>
                </div>
                <p className="mt-1 text-sm text-green-100">
                    {record.variety}
                </p>
            </div>
            {/* Body */}
            <div className="space-y-4 p-4">
                <div className="flex items-start gap-3">
                    <MapPin size={18} className="mt-1 text-green-600" />
                    <div>
                        <h4 className="font-semibold">
                            {record.market}
                        </h4>
                        <p className="text-sm text-gray-500">
                            {record.district},{" "}
                            {record.state}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <CalendarDays size={18} className="text-green-600" />
                    <span className="text-sm text-gray-600">
                        {formatDate(record.arrival_date)}
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <PriceBox title="Min" value={record.min_price} />
                    <PriceBox title="Modal" value={record.modal_price} active />
                    <PriceBox title="Max" value={record.max_price} />
                </div>
            </div>
        </div>
    );
}

interface PriceProps {
    title: string;
    value: number;
    active?: boolean;
}

function PriceBox({ title, value, active = false }: PriceProps) {
    return (
        <div className={`rounded-2xl p-3 text-center ${active ? "bg-green-600 text-white" : "bg-green-50"}`}>
            <p className={`text-sm ${active ? "text-green-100" : "text-gray-500"}`}>
                {title}
            </p>
            <h4 className="mt-1 font-bold flex items-center justify-center">
                <IndianRupee size={16} />
                {formatPrice(value)}
            </h4>
        </div>
    );
}