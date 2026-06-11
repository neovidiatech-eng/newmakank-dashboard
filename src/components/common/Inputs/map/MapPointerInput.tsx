import dynamic from "@/lib/dynamic";

const MapPointerInput = dynamic(() => import("./MapPointerInputInner"), {
  ssr: false,
});

export type { MapPointer, MapPointerInputProps } from "./MapPointerInputInner";
export default MapPointerInput;
