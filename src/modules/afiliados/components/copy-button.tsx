import { useState } from "react";
import { Copy02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

type CopyFeedback = "idle" | "copied" | "error";

type CopyButtonProps = Omit<ComponentProps<typeof Button>, "children" | "onClick"> & {
  readonly value: string;
  readonly copyLabel?: string;
  readonly copiedLabel?: string;
  readonly errorLabel?: string;
  readonly onCopied?: () => void;
};

function CopyButton({
  value,
  copyLabel = "Copiar",
  copiedLabel = "Copiado",
  errorLabel = "Tentar novamente",
  onCopied,
  ...props
}: CopyButtonProps) {
  const [feedback, setFeedback] = useState<CopyFeedback>("idle");
  const label = feedback === "copied" ? copiedLabel : feedback === "error" ? errorLabel : copyLabel;

  const handleCopy = () => {
    const writePromise = navigator.clipboard?.writeText(value);

    if (!writePromise) {
      setFeedback("error");
      return;
    }

    void writePromise.then(
      () => {
        setFeedback("copied");
        onCopied?.();
      },
      () => {
        setFeedback("error");
      }
    );
  };

  return (
    <Button
      {...props}
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      variant={props.variant ?? "ghost"}
    >
      <HugeiconsIcon icon={Copy02Icon} size={14} aria-hidden="true" />
      {label}
    </Button>
  );
}

export { CopyButton };
export type { CopyButtonProps };
