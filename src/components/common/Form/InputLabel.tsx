import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export default function InputLabel({
  label,
  selectedLang,
  isMultiLang,
  toolTip
}: {
  toolTip?: string;
  label: string;
  selectedLang: string;
  isMultiLang: boolean;
}): JSX.Element {
  const displayLabel = isMultiLang ? `${selectedLang} ${label}` : label;
  return (
    <div className="flex items-center  gap-2">
      <span>{displayLabel}</span>
      {toolTip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-pointer">
              <Info className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" align="center">
            <span>{toolTip}</span>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
