import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Autocomplete,
    DrawingManager,
    GoogleMap,
    Polygon,
    useJsApiLoader
} from "@react-google-maps/api";
import { useTranslations } from "@/lib/i18n";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type ZonePoint = { lat: number; lng: number };

export type GoogleMapZoneInputProps = {
    name?: string;
    value?: ZonePoint[];
    onChange?: (points: ZonePoint[]) => void;
    placeholder?: string;
    className?: string;
    defaultCenter?: ZonePoint;
    hideActions?: boolean;
    defaultZoom?: number;
};

const LIBRARIES: ("places" | "drawing" | "geometry")[] = ["places", "drawing", "geometry"];

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

export default function GoogleMapZoneInput({
    name,
    value,
    onChange,
    placeholder,
    hideActions = false,
    className,
    defaultCenter = { lat: 30.0444, lng: 31.2357 },
    defaultZoom = 12,
}: GoogleMapZoneInputProps) {
    const t = useTranslations();
    const isDark = useHtmlDarkClass();

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY || "",
        libraries: LIBRARIES,
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const polygonRef = useRef<google.maps.Polygon | null>(null);

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
            }
        }
    }, [autocomplete, map]);

    const handlePolygonComplete = useCallback((poly: google.maps.Polygon) => {
        if (hideActions) return;
        const path = poly.getPath();
        const points = path.getArray().map(p => ({ lat: p.lat(), lng: p.lng() }));

        onChange?.(points);
        // Remove the drawn polygon as we will render a controlled one based on value
        poly.setMap(null);
    }, [hideActions, onChange]);

    // Update listeners when the polygon instance changes
    const onPolygonLoad = useCallback((poly: google.maps.Polygon) => {
        polygonRef.current = poly;
        // Bind listeners to path
        const path = poly.getPath();

        const update = () => {
            const newPath = poly.getPath();
            const points = newPath.getArray().map(p => ({ lat: p.lat(), lng: p.lng() }));
            onChange?.(points);
        };

        // Listen for vertex changes
        path.addListener("set_at", update);
        path.addListener("insert_at", update);
        path.addListener("remove_at", update);

        // Listen for drag end
        poly.addListener("dragend", update);
    }, [onChange]);

    const polygonOptions = useMemo(() => ({
        fillColor: "#3388ff",
        fillOpacity: 0.2,
        strokeColor: "#3388ff",
        strokeWeight: 2,
        editable: !hideActions,
        draggable: !hideActions,
        clickable: true,
    }), [hideActions]);

    const mapOptions = useMemo<google.maps.MapOptions>(() => ({
        disableDefaultUI: false,
        zoomControl: true,
        styles: isDark ? DARK_MAP_STYLES : [],
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
    }), [isDark]);

    if (loadError) return <div className="text-destructive">Error loading Google Maps</div>;
    if (!isLoaded) return <div className="h-[420px] w-full bg-muted animate-pulse rounded-md" />;

    const hasValue = value && value.length > 0;

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
                        center={value?.[0] || defaultCenter}
                        zoom={defaultZoom}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        options={mapOptions}
                    >
                        {/* Render Polygon via props */}
                        {hasValue && (
                            <Polygon
                                path={value}
                                options={polygonOptions}
                                onLoad={onPolygonLoad}
                            />
                        )}

                        {/* Drawing Manager - only if no polygon (or maybe allow replacing?) 
                            Standard practice: if editable, let them edit the existing one. 
                            If they want to draw new, they usually delete first. 
                            But drawing manager also has a delete button if configured.
                            For simplicity, show DrawingManager always but maybe restrict mode?
                            Actually, if we have a polygon, we probably want to hide 'POLYGON' drawing tool so they don't draw overlapping ones.
                        */}
                        {!hideActions && !hasValue && (
                            <DrawingManager
                                onPolygonComplete={handlePolygonComplete}
                                options={{
                                    drawingControl: true,
                                    drawingControlOptions: {
                                        position: google.maps.ControlPosition.TOP_CENTER,
                                        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
                                    },
                                    polygonOptions: polygonOptions,
                                }}
                            />
                        )}

                        {/* Provide a clear button if there is a value? Or rely on external clearing? 
                            MapZoneInput had no clear button logic visible in UI besides 'deleted' event from EditControl.
                            We can add a 'clear' button or implement 'rightclick to delete'
                        */}
                    </GoogleMap>
                </div>
            </Card>
        </div>
    );
}
