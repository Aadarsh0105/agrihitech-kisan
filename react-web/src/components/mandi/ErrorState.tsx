import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({message, onRetry}: Props) {
  return (
    <section className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50 px-6 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle size={42} className="text-red-600"/>
      </div>
      <h2 className="mt-6 text-2xl font-bold text-gray-900">
        Something Went Wrong
      </h2>
      <p className="mt-3 max-w-xl text-gray-600">
        {message || "Unable to load mandi prices. Please try again."}
      </p>
      <button onClick={onRetry} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700">
        <RefreshCw size={18} />
        Retry
      </button>
    </section>
  );
}