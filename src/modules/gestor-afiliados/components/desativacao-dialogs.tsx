import { DialogCapturaMotivo } from "@/components/blocos";

import { listarMotivos } from "../services/afiliados-service";

export interface AlvoDesativacao {
  readonly nome: string;
  readonly email?: string;
}

interface DesativacaoDialogsProps {
  readonly desativando: AlvoDesativacao | null;
  readonly solicitando: AlvoDesativacao | null;
  readonly aoConfirmarDesativacao: () => void;
  readonly aoConfirmarSolicitacao: () => void;
  readonly aoCancelarDesativacao: () => void;
  readonly aoCancelarSolicitacao: () => void;
}

// Overlays AFI-02.a (16215:99149) e AFI-02.b (16215:99529), compartilhados
// entre a linha da lista e o menu Mais ações da ficha. Mesma anatomia; o .b
// troca o tom do botão e o texto do aviso.
export function DesativacaoDialogs({
  desativando,
  solicitando,
  aoConfirmarDesativacao,
  aoConfirmarSolicitacao,
  aoCancelarDesativacao,
  aoCancelarSolicitacao,
}: DesativacaoDialogsProps) {
  return (
    <>
      <DialogCapturaMotivo
        aberto={desativando !== null}
        titulo="Desativar filiação"
        entidade={{
          titulo: desativando?.nome ?? "",
          subtitulo: desativando?.email,
          // [PROPOSTA §4.1] Informação de maior consequência financeira da
          // tela, com destaque no card da entidade.
          alerta: "Possui comissões pendentes",
        }}
        motivos={listarMotivos("desativacao_filiacao")}
        avisoTexto="Esta ação encerra a filiação, desativa os links de divulgação e move o afiliado para o histórico. Comissões pendentes permanecem devidas."
        tomAcao="destrutivo"
        motivoObrigatorio
        rotuloConfirmar="Desativar filiação"
        rotuloMotivo="Motivo da desativação (visível para o afiliado)"
        rotuloDescricao="Descreva a razão da desativação"
        placeholderDescricao="Ex.: O afiliado não registra vendas há mais de seis meses e não respondeu aos contatos."
        aoConfirmar={aoConfirmarDesativacao}
        aoCancelar={aoCancelarDesativacao}
      />

      <DialogCapturaMotivo
        aberto={solicitando !== null}
        titulo="Solicitar desativação"
        entidade={{
          titulo: solicitando?.nome ?? "",
          subtitulo: solicitando?.email,
        }}
        motivos={listarMotivos("desativacao_filiacao")}
        avisoTexto="A filiação segue ativa enquanto a autorização estiver em análise. Um administrador precisa aprovar a desativação antes de ela ser executada."
        tomAcao="neutro"
        motivoObrigatorio
        rotuloConfirmar="Enviar solicitação"
        rotuloMotivo="Motivo da desativação (visível para o afiliado)"
        rotuloDescricao="Descreva a razão da desativação"
        placeholderDescricao="Ex.: O afiliado não registra vendas há mais de seis meses e não respondeu aos contatos."
        aoConfirmar={aoConfirmarSolicitacao}
        aoCancelar={aoCancelarSolicitacao}
      />
    </>
  );
}
