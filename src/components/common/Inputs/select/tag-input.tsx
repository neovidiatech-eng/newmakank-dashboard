// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
// import { Input } from "@/components/ui/input";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { Plus, X } from "lucide-react";
// import { useTranslations } from "@/lib/i18n";
// import type React from "react";
// import { useRef, useState, type KeyboardEvent } from "react";

// interface TagInputProps {
//   value?: string[];
//   onChange: (values: string[]) => void;
//   name: string;
//   placeholder?: string;
//   className?: string;
//   suggestions?: string[];
//   maxTags?: number;
//   disabled?: boolean;
// }

// const TagInput: React.FC<TagInputProps> = ({
//   value = [],
//   onChange,
//   name,
//   placeholder = "Type and press enter to add...",
//   className = "",
//   suggestions = [],
//   maxTags,
//   disabled = false
// }) => {
//   const [inputValue, setInputValue] = useState("");
//   const safeValue = typeof value == "string" ? [value] : value || [];
//   const [open, setOpen] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleAddTag = (tag: string) => {
//     const trimmedTag = tag.trim();
//     if (!trimmedTag) return;

//     // Don't add if it already exists
//     if (safeValue.includes(trimmedTag)) {
//       setInputValue("");
//       return;
//     }

//     // Don't add if we've reached the maximum number of tags
//     if (maxTags !== undefined && safeValue.length >= maxTags) return;

//     onChange([...safeValue, trimmedTag]);
//     setInputValue("");
//     setOpen(false);
//   };

//   const handleRemoveTag = (tagToRemove: string) => {
//     onChange(safeValue.filter(tag => tag !== tagToRemove));
//   };

//   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && inputValue) {
//       e.preventDefault();
//       handleAddTag(inputValue);
//     } else if (e.key === "Backspace" && !inputValue && safeValue.length > 0) {
//       handleRemoveTag(safeValue[safeValue.length - 1]);
//     }
//   };

//   const filteredSuggestions = suggestions.filter(
//     suggestion =>
//       !safeValue.includes(suggestion) && suggestion.toLowerCase().includes(inputValue.toLowerCase())
//   );
//   const t = useTranslations();
//   return (
//     <div
//       role="button"
//       tabIndex={0}
//       onKeyDown={e => {
//         if (e.key === "Enter" || e.key === " ") {
//           // Only prevent default if the input isn't already focused
//           if (document.activeElement !== inputRef.current) {
//             e.preventDefault();
//             !disabled && inputRef.current?.focus();
//           }
//         }
//       }}
//       className={cn(
//         "flex flex-wrap gap-1.5 p-1.5 rounded-md border border-input bg-background min-h-10 focus-within:ring-1 focus-within:ring-ring",
//         disabled && "opacity-50 cursor-not-allowed",
//         className
//       )}
//       onClick={() => !disabled && inputRef.current?.focus()}
//     >
//       {safeValue?.map(tag => (
//         <Badge
//           key={tag}
//           variant="secondary"
//           className="h-7 px-2 text-sm font-normal gap-1 truncate max-w-[200px]"
//         >
//           {tag}
//           {!disabled && (
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-4 w-4 p-0 ml-1 rounded-full hover:bg-muted"
//               onClick={e => {
//                 e.stopPropagation();
//                 handleRemoveTag(tag);
//               }}
//               aria-label={`Remove ${tag}`}
//             >
//               <X className="h-3 w-3" />
//             </Button>
//           )}
//         </Badge>
//       ))}

//       <Popover open={open && filteredSuggestions.length > 0} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <div className="flex-1 min-w-[120px] relative">
//             <Input
//               ref={inputRef}
//               type="text"
//               name={name}
//               value={inputValue}
//               onChange={e => {
//                 setInputValue(e.target.value);
//                 if (e.target.value) setOpen(true);
//               }}
//               onKeyDown={handleKeyDown}
//               placeholder={safeValue.length === 0 ? placeholder : t("Type and press enter to add")}
//               className="shadow-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7 text-sm placeholder:text-muted-foreground pr-6"
//               disabled={disabled || (maxTags !== undefined && safeValue.length >= maxTags)}
//             />
//             {inputValue && (
//               <Plus
//                 className={cn(
//                   "h-4 w-4 absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground",
//                   !disabled && "cursor-pointer hover:text-foreground transition-colors",
//                   disabled && "opacity-50"
//                 )}
//                 onClick={() => !disabled && handleAddTag(inputValue)}
//               />
//             )}
//           </div>
//         </PopoverTrigger>
//         <PopoverContent className="p-0 w-[200px]" align="start">
//           <Command>
//             <CommandGroup>
//               {filteredSuggestions.map(suggestion => (
//                 <CommandItem
//                   key={suggestion}
//                   onSelect={() => handleAddTag(suggestion)}
//                   className="flex items-center gap-2 text-sm"
//                 >
//                   <Plus className="h-3 w-3" />
//                   {suggestion}
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// };

// export default TagInput;
