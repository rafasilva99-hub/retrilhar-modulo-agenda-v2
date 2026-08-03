import { ArrowDown01Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { type Filiacao, PODE, type Usuario } from "@/lib/afiliados/permissoes";
import { rotuloDaFiliacao } from "@/lib/afiliados/rotulos";

export type AcaoAfiliado =
  | "ver-detalhes"
  | "editar-filiacoes"
  | "pausar"
  | "retomar"
  | "desativar"
  | "solicitar-desativacao"
  | "reativar"
  | "reenviar-convite";

interface AfiliadoAcoesProps {
  // Um componente, dois contextos (§1.3): o menu da linha e o "Mais ações"
  // da ficha têm os mesmos itens; a ficha só omite "Ver detalhes".
  readonly contexto: "linha" | "ficha";
  readonly filiacao: Filiacao;
  readonly usuario: Usuario;
  readonly nomeAfiliado: string;
  readonly aoAcionar: (acao: AcaoAfiliado) => void;
}

// Todos os itens passam pelo guarda PODE (§5.1). Nenhuma condicional de
// permissão é escrita inline aqui: o JSX só consome o resultado do guarda.
export function AfiliadoAcoes({
  contexto,
  filiacao,
  usuario,
  nomeAfiliado,
  aoAcionar,
}: AfiliadoAcoesProps) {
  const exibeVerDetalhes = contexto === "linha" && PODE.verDetalhes();
  const exibeEditar = PODE.editarFiliacoes(filiacao);
  // [DECISÃO] O toggle espelha o estado, não a ação, e não é renderizado no
  // estado desativada (o guarda já nega alternarPausa fora de vinculada).
  const exibeToggle = PODE.alternarPausa(filiacao);
  const exibeDesativar = PODE.desativarFiliacao(filiacao, usuario);
  const exibeSolicitar = PODE.solicitarDesativacao(filiacao, usuario);
  const exibeReativar = PODE.reativarFiliacao(filiacao);
  const exibeReenviar = PODE.reenviarConvite(filiacao);
  // [PROPOSTA] Evita que dois gestores solicitem a mesma desativação.
  const exibeEmAnalise = filiacao.temSolicitacaoPendente;

  const pausada = filiacao.estado === "inativa";
  const temSecaoDestrutiva = exibeDesativar || exibeSolicitar || exibeEmAnalise;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {contexto === "linha" ? (
          <Button variant="ghost" size="icon" aria-label={`Ações de ${nomeAfiliado}`}>
            <HugeiconsIcon icon={MoreVerticalIcon} size={18} aria-hidden="true" />
          </Button>
        ) : (
          <Button variant="outline" className="gap-2" aria-label={`Ações de ${nomeAfiliado}`}>
            Mais ações
            <HugeiconsIcon icon={ArrowDown01Icon} size={16} aria-hidden="true" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-2xl">
        {exibeVerDetalhes ? (
          <DropdownMenuItem onClick={() => aoAcionar("ver-detalhes")}>
            Ver detalhes
          </DropdownMenuItem>
        ) : null}
        {exibeEditar ? (
          <DropdownMenuItem onClick={() => aoAcionar("editar-filiacoes")}>
            Editar filiações
          </DropdownMenuItem>
        ) : null}
        {exibeToggle ? (
          <DropdownMenuItem
            className="justify-between gap-3"
            onClick={() => aoAcionar(pausada ? "retomar" : "pausar")}
          >
            {rotuloDaFiliacao(filiacao.estado)}
            <Switch
              checked={!pausada}
              aria-label={pausada ? "Retomar filiação" : "Pausar filiação"}
              tabIndex={-1}
            />
          </DropdownMenuItem>
        ) : null}
        {exibeReenviar ? (
          <DropdownMenuItem onClick={() => aoAcionar("reenviar-convite")}>
            Reenviar convite
          </DropdownMenuItem>
        ) : null}
        {exibeReativar ? (
          <DropdownMenuItem
            className="text-primary focus:text-primary"
            onClick={() => aoAcionar("reativar")}
          >
            Reativar filiação
          </DropdownMenuItem>
        ) : null}
        {temSecaoDestrutiva ? <DropdownMenuSeparator /> : null}
        {exibeDesativar ? (
          <DropdownMenuItem variant="destructive" onClick={() => aoAcionar("desativar")}>
            Desativar filiação
          </DropdownMenuItem>
        ) : null}
        {exibeSolicitar ? (
          <DropdownMenuItem
            variant="destructive"
            onClick={() => aoAcionar("solicitar-desativacao")}
          >
            Solicitar desativação
          </DropdownMenuItem>
        ) : null}
        {exibeEmAnalise ? (
          <DropdownMenuItem disabled>Solicitação em análise</DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
