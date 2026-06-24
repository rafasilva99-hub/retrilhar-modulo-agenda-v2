import * as React from "react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Horario = string | null; // "HH:mm" in 24h; null = empty

interface TimeInputProps {
  value: Horario;
  onChange: (value: Horario) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  "aria-label"?: string;
  id?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Strip everything except digits */
function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

/**
 * Normalize a raw string into "HH:mm" or null.
 * Accepts shortcuts: "9" → "09:00", "930" → "09:30", "9:5" → "09:05", "13" → "13:00"
 */
function normalize(raw: string): { value: Horario; error: string | null } {
  const trimmed = raw.trim();
  if (trimmed === "") return { value: null, error: null };

  // Strip noise: keep digits and colons
  const cleaned = trimmed.replace(/[^0-9:]/g, "");
  const digits = digitsOnly(cleaned);

  let hh: number;
  let mm: number;

  if (cleaned.includes(":")) {
    // Explicit separator
    const [hPart = "", mPart = ""] = cleaned.split(":");
    hh = hPart === "" ? 0 : parseInt(hPart, 10);
    mm = mPart === "" ? 0 : parseInt(mPart, 10);
  } else {
    // No separator — infer from digit count
    switch (digits.length) {
      case 0:
        return { value: null, error: null };
      case 1:
        // "9" → 09:00
        hh = parseInt(digits, 10);
        mm = 0;
        break;
      case 2:
        // "13" → 13:00, "09" → 09:00
        hh = parseInt(digits, 10);
        mm = 0;
        break;
      case 3:
        // "930" → 09:30
        hh = parseInt(digits[0]!, 10);
        mm = parseInt(digits.slice(1), 10);
        break;
      case 4:
      default:
        // "0930" → 09:30, "1330" → 13:30
        hh = parseInt(digits.slice(0, 2), 10);
        mm = parseInt(digits.slice(2, 4), 10);
        break;
    }
  }

  if (isNaN(hh) || isNaN(mm)) {
    return { value: null, error: "Horário inválido" };
  }

  if (hh === 24 && mm === 0) {
    return { value: null, error: "Use 00:00 para meia-noite" };
  }

  if (hh < 0 || hh > 23) {
    return { value: null, error: "Hora fora do intervalo (00–23)" };
  }

  if (mm < 0 || mm > 59) {
    return { value: null, error: "Minuto fora do intervalo (00–59)" };
  }

  const formatted = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  return { value: formatted, error: null };
}

/** Clamp a number within [min, max] */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function TimeInput({
  value,
  onChange,
  placeholder = "hh:mm",
  className,
  disabled,
  readOnly,
  required,
  "aria-label": ariaLabel,
  id,
}: TimeInputProps) {
  // Display string — what the user sees while typing (may differ from normalized value)
  const [display, setDisplay] = useState(value ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastCommittedRef = useRef(value);

  // Sync external value changes
  if (!isFocused && value !== lastCommittedRef.current) {
    lastCommittedRef.current = value;
    setDisplay(value ?? "");
    setError(null);
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const { selectionStart } = input;
      const currentDisplay = input.value;

      // Block non-allowed characters
      if (
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.metaKey &&
        !/[0-9:]/.test(e.key)
      ) {
        e.preventDefault();
        return;
      }

      // Arrow up/down: increment/decrement hour or minute segment
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const parsed = normalize(currentDisplay);
        if (!parsed.value) return;

        const parts = parsed.value.split(":");
        let hh = parseInt(parts[0] ?? "0", 10);
        let mm = parseInt(parts[1] ?? "0", 10);
        const delta = e.key === "ArrowUp" ? 1 : -1;

        // Determine which segment based on cursor position
        const colonIdx = currentDisplay.indexOf(":");
        const inMinutes = colonIdx >= 0 && selectionStart !== null && selectionStart > colonIdx;

        if (inMinutes) {
          mm = clamp(mm + delta, 0, 59);
        } else {
          hh = clamp(hh + delta, 0, 23);
        }

        const newVal = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
        setDisplay(newVal);
        setError(null);
        onChange(newVal);
        lastCommittedRef.current = newVal;

        // Restore cursor position after render
        requestAnimationFrame(() => {
          if (inputRef.current) {
            if (inMinutes) {
              inputRef.current.setSelectionRange(3, 5);
            } else {
              inputRef.current.setSelectionRange(0, 2);
            }
          }
        });
      }
    },
    [onChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, "");
      // Validate digit by digit
      let valid = "";
      for (let i = 0; i < digits.length && valid.length < 4; i++) {
        const d = parseInt(digits[i]!, 10);
        const pos = valid.length;
        if (pos === 0) {
          // First hour digit: 0, 1, 2
          if (d > 2) continue;
        } else if (pos === 1) {
          // Second hour digit: 0-9 if first is 0-1, 0-3 if first is 2
          const firstHour = parseInt(valid[0]!, 10);
          if (firstHour === 2 && d > 3) continue;
        } else if (pos === 2) {
          // First minute digit: 0-5
          if (d > 5) continue;
        }
        // pos === 3: second minute digit: 0-9 (always valid)
        valid += digits[i];
      }
      let result: string;
      if (valid.length <= 2) {
        result = valid;
      } else {
        result = valid.slice(0, 2) + ":" + valid.slice(2);
      }
      setDisplay(result);
      if (error) setError(null);
    },
    [error]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text/plain");
      const result = normalize(pasted);
      if (result.error) {
        setError(result.error);
        // Preserve current value
        return;
      }
      if (result.value) {
        setDisplay(result.value);
        setError(null);
        onChange(result.value);
        lastCommittedRef.current = result.value;
      }
    },
    [onChange]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    const trimmed = display.trim();

    // Empty field → null
    if (trimmed === "") {
      setDisplay("");
      setError(required ? "Campo obrigatório" : null);
      onChange(null);
      lastCommittedRef.current = null;
      return;
    }

    const result = normalize(trimmed);
    if (result.error) {
      setError(result.error);
      // Keep the display for correction — don't wipe it
      return;
    }

    setDisplay(result.value ?? "");
    setError(null);
    onChange(result.value);
    lastCommittedRef.current = result.value;
  }, [display, onChange, required]);

  const errorId = id ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        id={id}
        type="text"
        inputMode="numeric"
        data-slot="input"
        className={cn(
          "border-border file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
          className
        )}
        value={display}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        aria-label={ariaLabel}
        aria-invalid={error ? true : undefined}
        aria-describedby={error && errorId ? errorId : undefined}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onPaste={handlePaste}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
      />
      {error && (
        <p
          id={errorId}
          className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] text-[#d92d20] leading-[14px]"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export { TimeInput };
export type { Horario, TimeInputProps };
