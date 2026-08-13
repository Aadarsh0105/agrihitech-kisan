import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface LocationContextType {
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  getCurrentLocation: () => void;
}

const LocationContext =
  createContext<LocationContextType | null>(null);

export function LocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [city, setCity] = useState("Select Location");
  const [state, setState] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();

          setCity(
            data.address.city ||
              data.address.town ||
              data.address.village ||
              "Unknown"
          );

          setState(data.address.state || "");
        } catch (err) {
          console.error(err);
        }

        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        city,
        state,
        latitude,
        longitude,
        loading,
        getCurrentLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error(
      "useLocation must be used inside LocationProvider"
    );
  }

  return context;
}
