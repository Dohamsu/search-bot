"use client";

interface ColorPaletteProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export default function ColorPalette({ colors, selectedColor, onColorSelect }: ColorPaletteProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {colors.map((color, i) => (
        <button
          key={i}
          onClick={() => onColorSelect(color)}
          className={`w-7 h-7 rounded-md border-2 transition-all hover:scale-110 ${
            selectedColor === color
              ? "border-indigo-500 ring-2 ring-indigo-200"
              : "border-gray-200"
          }`}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
}
