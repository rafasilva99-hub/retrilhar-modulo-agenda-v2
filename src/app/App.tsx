import { Toaster } from "../components/ui/sonner";
import { AgendaPrototypeApp } from "../modules/agenda";

export default function App() {
  return (
    <>
      <AgendaPrototypeApp />
      {/* Toast global configurado uma única vez no layout raiz. */}
      <Toaster position="bottom-right" />
    </>
  );
}
