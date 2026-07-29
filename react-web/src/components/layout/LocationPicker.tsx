import { useState } from "react";
import {
  MapPin,
  ChevronDown,
  Navigation,
  Loader2,
} from "lucide-react";

import { useLocation } from "../../context/LocationContext";

interface Props {
  mobile?: boolean;
}

export function LocationPicker({ mobile = false }: Props) {
  const {
    city,
    state,
    loading,
    getCurrentLocation,
  } = useLocation();

  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={getCurrentLocation}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`
        group
        w-full
        transition-all
        duration-300
        ${
          mobile
            ? "rounded-xl border border-gray-200 bg-white p-2"
            : "h-11 rounded-lg border border-gray-200 bg-white px-1 shadow-sm hover:shadow-md"
        }
      `}
    >
      <div className="flex items-center">

        {/* Icon */}

        <div
          className="
          mr-3
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          bg-primary/10
          transition
          group-hover:bg-primary/20
          "
        >
          {loading ? (
            <Loader2
              size={18}
              className="animate-spin text-primary"
            />
          ) : hover ? (
            <Navigation
              size={18}
              className="text-primary"
            />
          ) : (
            <MapPin
              size={18}
              className="text-primary"
            />
          )}
        </div>

        {/* Text */}

        <div className="flex-1 text-left">

          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Deliver To
          </p>

          <p className="truncate text-sm font-semibold text-gray-900">
            {loading
              ? "Detecting location..."
              : city
              ? `${city}${state ? ", " + state : ""}`
              : "Select Location"}
          </p>

        </div>

        {/* Arrow */}

        <ChevronDown
          size={18}
          className="
          text-gray-500
          transition-transform
          group-hover:rotate-180
          "
        />

      </div>
    </button>
  );
}