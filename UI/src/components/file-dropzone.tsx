import { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export default function FileDropzone({
  value,
  onChange,
  className,
}: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") onChange(reader.result);
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30 hover:border-primary/50"
        )}
        onClick={() => document.getElementById("file-drop-input")?.click()}
      >
        <Upload className="mb-2 h-8 w-8 text-primary" />
        <p className="text-sm font-medium">Drag & drop image or click to browse</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Stored as URL / data URL for API compatibility
        </p>
        <input
          id="file-drop-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      {value && (
        <img
          src={value}
          alt="Preview"
          className="h-24 w-24 rounded-lg object-cover border border-border"
        />
      )}
    </div>
  );
}
