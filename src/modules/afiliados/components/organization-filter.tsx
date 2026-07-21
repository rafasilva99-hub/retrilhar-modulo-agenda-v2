import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { AfiliadoOrganization } from "@/mocks/afiliados";

type OrganizationOption = Pick<AfiliadoOrganization, "id" | "name">;

type OrganizationFilterProps = {
  readonly organizations: readonly OrganizationOption[];
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly allLabel?: string;
  readonly allValue?: string;
  readonly label?: string;
  readonly placeholder?: string;
  readonly className?: string;
  readonly disabled?: boolean;
};

function OrganizationFilter({
  organizations,
  value,
  onValueChange,
  allLabel = "Todas as organizações",
  allValue = "all",
  label,
  placeholder = allLabel,
  className,
  disabled,
}: OrganizationFilterProps) {
  return (
    <div className={cn("flex min-w-0 flex-wrap items-center gap-2", className)}>
      {label ? <span className="text-muted-foreground text-sm">{label}</span> : null}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          className="h-8 w-full max-w-[220px] min-w-0 text-xs"
          aria-label={label ?? "Organização"}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={allValue}>{allLabel}</SelectItem>
          {organizations.map((organization) => (
            <SelectItem key={organization.id} value={organization.id}>
              {organization.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const OrganizationFilterSelect = OrganizationFilter;

export { OrganizationFilter, OrganizationFilterSelect };
export type { OrganizationFilterProps, OrganizationOption };
