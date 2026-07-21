import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { gestorTerm } from "@/mocks/gestor-afiliados";

export function GestorTermPage() {
  const [text, setText] = useState(gestorTerm.text);
  const [version, setVersion] = useState(gestorTerm.version);
  const [message, setMessage] = useState<string | null>(null);

  const handleReset = () => {
    setText(gestorTerm.text);
    setMessage("Texto padrão restaurado.");
  };

  const handleSave = () => {
    setVersion("v1.5");
    setMessage("Nova versão salva. Reaceite dos afiliados existentes segue a validar.");
  };

  return (
    <Card className="rounded-2xl p-5 shadow-none">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Termo de afiliação</h2>
          <p className="text-muted-foreground text-sm">
            {version} · atualizado em {gestorTerm.updatedAt} · termo personalizado
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Restaurar padrão
          </Button>
          <Button onClick={handleSave}>Salvar nova versão</Button>
        </div>
      </div>
      <Textarea
        className="mt-5 min-h-[260px]"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <p className="text-muted-foreground mt-3 text-xs">
        O aceite aparece nas candidaturas, convites e contrapropostas. O reaceite após alteração
        permanece marcado como decisão de produto.
      </p>
      {message ? (
        <p
          role="status"
          className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
        >
          {message}
        </p>
      ) : null}
    </Card>
  );
}
