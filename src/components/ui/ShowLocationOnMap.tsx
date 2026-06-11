import { cn } from "@/lib/utils";
import React from "react";

function ShowLocationOnMap({
  lat,
  long,
  children,
  className
}: {
  lat: number | string;
  long: number | string;
  children?: React.ReactNode;
  className?: string;
}): JSX.Element {
  const openMap = () => {
    window.open(`https://www.google.com/maps?q=${lat},${long}`, "_blank");
  };

  return (
    <button className={cn(" text-primary border-b border-b-primary w-fit", className)} onClick={openMap}>
      {children}
    </button>
  );
}

export default ShowLocationOnMap;
