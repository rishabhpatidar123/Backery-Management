import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12",
        align === "center" && "text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-serif font-bold md:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>
      )}
      <div
        className={cn(
          "mt-4 h-1 w-20 rounded-full bg-primary",
          align === "center" && "mx-auto"
        )}
      />
    </div>
  );
}
