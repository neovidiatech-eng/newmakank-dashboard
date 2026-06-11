import { Input } from "@/components/ui/input";
import React, { useState } from "react";

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
  name?: string;
}

const ColorInput: React.FC<ColorInputProps> = ({ value, onChange, name }) => {
  const [hexValue, setHexValue] = useState(value || "#000000");

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setHexValue(newColor);
    onChange(newColor);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Input
          type="color"
          value={hexValue}
          onChange={handleColorChange}
          name={name}
          className="w-12 h-12 p-1 rounded-md border-input shadow-sm hover:border-ring focus-visible:outline-none focus-visible:ring-1 cursor-pointer bg-background"
          aria-label="Choose color"
        />
        <Input
          type="text"
          value={hexValue}
          onChange={handleColorChange}
          placeholder="#000000"
          className="flex-1 font-mono text-sm"
          pattern="^#([A-Fa-f0-9]{6})$"
        />
        <div
          className="w-12 h-12 rounded-md border border-input shadow-sm"
          style={{
            backgroundColor: hexValue,
            boxShadow: `0 0 0 1px hsl(var(--background)), 0 0 0 2px ${hexValue}20`,
          }}
          aria-label="Color preview"
        />
      </div>
    </div>
  );
};

export default ColorInput;

// "use client"

// import { useState, useCallback } from 'react'
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// export default function ColorPicker() {
//   const [color, setColor] = useState("#000000")

//   const handleColorChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
//     setColor(event.target.value)
//   }, [])

//   const handleHexChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
//     const newColor = event.target.value
//     if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
//       setColor(newColor)
//     }
//   }, [])

//   return (
//     <div className="w-full max-w-md mx-auto p-4 space-y-4">
//       <div className="space-y-2">
//         <Label htmlFor="color-picker">Select Color</Label>
//         <div className="flex items-center space-x-2">
//           <Input
//             type="color"
//             id="color-picker"
//             value={color}
//             onChange={handleColorChange}
//             className="w-12 h-12 p-1 rounded cursor-pointer"
//           />
//           <Input
//             type="text"
//             value={color}
//             onChange={handleHexChange}
//             placeholder="#000000"
//             className="flex-grow"
//             maxLength={7}
//           />
//         </div>
//       </div>
//       <div
//         className="w-full h-32 rounded-md border"
//         style={{ backgroundColor: color }}
//         aria-label={`Color preview: ${color}`}
//       ></div>
//     </div>
//   )
// }
