import dynamic from "@/lib/dynamic";

const MapZoneInput = dynamic(() => import("./MapZoneInputInner"), {
  ssr: false,
});

export type { ZonePoint, MapZoneInputProps } from "./MapZoneInputInner";
export default MapZoneInput;
