import retrilharIcon from "@/assets/retrilhar-icon.png";
import retrilharLogo from "@/assets/retrilhar-logo.png";

interface LogoProps {
  variant?: "icon" | "full";
}

export function Logo({ variant = "full" }: LogoProps) {
  if (variant === "icon") {
    return <img src={retrilharIcon} alt="Retrilhar" className="size-9 rounded-xl object-contain" />;
  }

  return <img src={retrilharLogo} alt="Retrilhar" className="h-10 w-[161px] object-contain" />;
}
