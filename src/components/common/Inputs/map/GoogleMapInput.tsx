import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useTranslations } from "@/lib/i18n";
import { useCallback, useEffect, useMemo, useState } from "react";

export type MapPointer = { lat: number; lng: number };

export type GoogleMapInputProps = {
    name?: string;
    value?: MapPointer | null;
    onChange?: (point: MapPointer | null) => void;
    placeholder?: string;
    className?: string;
    defaultCenter?: MapPointer;
    hideActions?: boolean;
    defaultZoom?: number;
};

const LIBRARIES: ("places")[] = ["places"];

function useHtmlDarkClass() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const el = document.documentElement;
        const read = () => setIsDark(el.classList.contains("dark"));
        read();
        const obs = new MutationObserver(read);
        obs.observe(el, { attributes: true, attributeFilter: ["class"] });
        return () => obs.disconnect();
    }, []);

    return isDark;
}

const DARK_MAP_STYLES = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

export default function GoogleMapInput({
    name,
    value,
    onChange,
    placeholder,
    hideActions = false,
    className,
    defaultCenter = { lat: 30.0444, lng: 31.2357 },
    defaultZoom = 12,
}: GoogleMapInputProps) {
    const t = useTranslations();
    const isDark = useHtmlDarkClass();

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY || "",
        libraries: LIBRARIES,
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

    // Keep local search value to controlled input
    const [searchValue, setSearchValue] = useState("");

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const onAutocompleteLoad = useCallback((ac: google.maps.places.Autocomplete) => {
        setAutocomplete(ac);
    }, []);

    const onPlaceChanged = useCallback(() => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();

                map?.panTo({ lat, lng });
                map?.setZoom(15);
                onChange?.({ lat, lng });
            } else {
                console.warn("No geometry for selected place");
            }
        }
    }, [autocomplete, map, onChange]);

    const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (hideActions) return;
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            onChange?.({ lat, lng });
        }
    }, [hideActions, onChange]);

    // Sync map center if value changes externally (and map is ready)
    useEffect(() => {
        // Logic: If value changes, maybe pan map? 
        // Often you only pan if it's vastly different or on first load.
        // But for inputs, usually if value is set, we show it.
    }, [value]);

    const mapOptions = useMemo<google.maps.MapOptions>(() => ({
        disableDefaultUI: false,
        zoomControl: true,
        styles: isDark ? DARK_MAP_STYLES : [],
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
    }), [isDark]);

    if (loadError) {
        return <div className="text-destructive">Error loading Google Maps</div>;
    }

    if (!isLoaded) {
        return <div className="h-[420px] w-full bg-muted animate-pulse rounded-md" />;
    }

    return (
        <div className={className}>
            {!hideActions && (
                <div className="flex gap-2 mb-2.5">
                    <Autocomplete
                        onLoad={onAutocompleteLoad}
                        onPlaceChanged={onPlaceChanged}
                        className="flex-1"
                    >
                        <Input
                            name={name ? `${name}_search` : undefined}
                            placeholder={placeholder || t("SearchPlacePlaceholder")}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => {
                                // Prevent form submission if inside a form
                                if (e.key === 'Enter') e.preventDefault();
                            }}
                        />
                    </Autocomplete>
                </div>
            )}

            <Card className="p-0 overflow-hidden">
                <div className="h-[420px] w-full">
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={value || defaultCenter}
                        zoom={defaultZoom}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        onClick={handleMapClick}
                        options={mapOptions}
                    >
                        {value && (
                            <Marker
                                position={value}
                                draggable={!hideActions}
                                onDragEnd={handleMapClick} // Reuse click handler logic for drag end
                            />
                        )}
                    </GoogleMap>
                </div>
            </Card>
        </div>
    );
}
