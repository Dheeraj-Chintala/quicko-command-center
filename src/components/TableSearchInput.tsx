import { type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TableSearchInputProps = Omit<ComponentProps<typeof Input>, "aria-label"> & {
  "aria-label"?: string;
};

export function TableSearchInput({ className, placeholder = "Search rows…", ...props }: TableSearchInputProps) {
  return (
    <Input
      type="search"
      placeholder={placeholder}
      aria-label="Search table rows"
      className={cn("w-full max-w-none sm:max-w-md brutal-input", className)}
      {...props}
    />
  );
}
