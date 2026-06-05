import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SaveButtonProps = Omit<React.ComponentProps<typeof Button>, "type"> & {
  readonly loading?: boolean;
  readonly requireDirty?: boolean;
};

function SaveButton({
  loading = false,
  requireDirty = true,
  disabled,
  children = "Salvar",
  className,
  ...props
}: SaveButtonProps) {
  const form = useFormContext();
  const isDirty = form?.formState?.isDirty ?? true;

  return (
    <Button
      type="submit"
      disabled={disabled || (requireDirty && !isDirty)}
      loading={loading}
      className={cn(className)}
      {...props}
    >
      {children}
    </Button>
  );
}

export { SaveButton };
