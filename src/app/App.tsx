import { Toaster } from "../components/ui/sonner";
import { AgendaPrototypeApp } from "../modules/agenda";

export default function App() {
  return (
    <>
      <AgendaPrototypeApp />
      {/* Toast global configurado uma única vez no layout raiz; sempre no
          canto superior direito, como os toasts do Figma. */}
      <Toaster position="top-right" />
    </>
  );
}
