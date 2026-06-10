import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function DataTableToolbar({
  search,
  onSearchChange,
  placeholder = "Search...",
  children,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-sm flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="rounded-xl pl-10"
        />
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
