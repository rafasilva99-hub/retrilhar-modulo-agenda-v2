import { useState } from "react";
import { MoneyBag02Icon, UserCheck01Icon } from "@hugeicons/core-free-icons";

import {
  CodigoCopiavel,
  type ColunaTabela,
  DialogCapturaMotivo,
  FiltroSegmentado,
  HeaderEntidade,
  ItemAfiliado,
  ItemPendencia,
  KpiCard,
  PainelSecao,
  ResumoNegociacao,
  TabelaBase,
  TimelineAtividade,
} from "@/components/blocos";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatarMoeda } from "@/lib/formatadores";
import {
  motivosRecusa,
  pendenciasCheio,
  pendenciasExtremos,
  resumoAfiliadosCheio,
  resumoAfiliadosExtremos,
  topAfiliadosCheio,
  topAfiliadosExtremos,
  vendasCheio,
  vendasExtremos,
} from "@/mocks/gestor-afiliados";

// Vitrine de desenvolvimento (#devBlocos): todos os blocos da Etapa 01 em
// todos os estados, lado a lado. Não faz parte do fluxo do teste.

const colunasDemo: readonly ColunaTabela[] = [
  { id: "afiliado", titulo: "Nome afiliado" },
  { id: "pedido", titulo: "Nº pedido" },
  { id: "valor", titulo: "Valor pedido", alinhamento: "direita" },
];

export function DevBlocos() {
  const [filtro, setFiltro] = useState("todas");
  const [dialogMotivo, setDialogMotivo] = useState<"destrutivo" | "neutro" | null>(null);

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Blocos da Etapa 01</h1>
        <p className="text-muted-foreground text-sm">
          Cada bloco em todos os seus estados: padrão, vazio, carregando e valores extremos.
        </p>
      </header>

      <Secao titulo="KpiCard">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            titulo="Total de vendas dos afiliados"
            valor={formatarMoeda(resumoAfiliadosCheio.totalVendas)}
            complemento="Últimos 30 dias"
            icone={MoneyBag02Icon}
          />
          <KpiCard
            titulo="Com tendência de alta"
            valor={formatarMoeda(resumoAfiliadosCheio.valorComissoes)}
            icone={MoneyBag02Icon}
            tendencia={{ rotulo: "12% acima do mês anterior", direcao: "alta" }}
          />
          <KpiCard
            titulo="Valor extremo"
            valor={formatarMoeda(resumoAfiliadosExtremos.totalVendas)}
            complemento="Cenário de estresse"
            icone={UserCheck01Icon}
            tendencia={{ rotulo: "8% abaixo do mês anterior", direcao: "baixa" }}
          />
          <KpiCard titulo="Carregando" valor="" icone={MoneyBag02Icon} carregando />
        </div>
      </Secao>

      <Secao titulo="PainelSecao">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <PainelSecao
            titulo="Com ação e rodapé"
            descricao="Descrição curta da seção."
            acao={
              <Button variant="outline" size="sm">
                Ação
              </Button>
            }
            rodape={{ rotulo: "Ver todas" }}
          >
            <p className="text-muted-foreground text-sm">Conteúdo livre do painel.</p>
          </PainelSecao>
          <PainelSecao titulo="Somente título">
            <p className="text-muted-foreground text-sm">Sem descrição, ação ou rodapé.</p>
          </PainelSecao>
        </div>
      </Secao>

      <Secao titulo="CodigoCopiavel">
        <div className="flex flex-wrap items-center gap-3">
          <CodigoCopiavel codigo="EDRETRILHAR26" />
          <CodigoCopiavel codigo="ISA2026" />
          <CodigoCopiavel codigo="MARIAAUXILIADORARETRILHAR2026" />
        </div>
      </Secao>

      <Secao titulo="FiltroSegmentado">
        <div className="max-w-md">
          <FiltroSegmentado
            opcoes={[
              { id: "todas", rotulo: "Todas", contador: 7 },
              { id: "solicitacoes", rotulo: "Solicitações", contador: 4 },
              { id: "propostas", rotulo: "Propostas" },
            ]}
            valor={filtro}
            aoMudar={setFiltro}
          />
        </div>
      </Secao>

      <Secao titulo="ItemPendencia">
        <div className="divide-border max-w-2xl divide-y">
          {[
            ...pendenciasCheio.slice(0, 2),
            ...pendenciasCheio.slice(3, 4),
            ...pendenciasExtremos,
          ].map((pendencia) => (
            <ItemPendencia key={pendencia.id} pendencia={pendencia} onAbrir={() => undefined} />
          ))}
        </div>
      </Secao>

      <Secao titulo="ItemAfiliado">
        <div className="max-w-2xl space-y-3">
          {topAfiliadosCheio.slice(0, 3).map((afiliado, indice) => (
            <ItemAfiliado
              key={afiliado.id}
              afiliado={afiliado}
              posicao={indice + 1}
              onAbrir={() => undefined}
            />
          ))}
          {topAfiliadosExtremos.map((afiliado) => (
            <ItemAfiliado key={afiliado.id} afiliado={afiliado} posicao={9} />
          ))}
        </div>
      </Secao>

      <Secao titulo="TabelaBase">
        <div className="space-y-6">
          <TabelaBase
            colunas={colunasDemo}
            rodape={
              <>
                <span>2 itens selecionados</span>
                <span>Mostrando 1 a 3 de 8</span>
              </>
            }
          >
            {[...vendasCheio.slice(0, 2), ...vendasExtremos].map((venda) => (
              <TableRow key={venda.id}>
                <TableCell>{venda.nomeAfiliado}</TableCell>
                <TableCell>{venda.numeroPedido}</TableCell>
                <TableCell className="text-right">{formatarMoeda(venda.valorPedido)}</TableCell>
              </TableRow>
            ))}
          </TabelaBase>
          <TabelaBase
            colunas={colunasDemo}
            estaVazia
            vazio={<p className="text-muted-foreground text-center text-sm">Nenhum registro.</p>}
          />
          <TabelaBase colunas={colunasDemo} carregando linhasEsqueleto={3} />
        </div>
      </Secao>

      <Secao titulo="TimelineAtividade">
        <div className="max-w-xl">
          <TimelineAtividade
            eventos={[
              {
                id: "ev-1",
                titulo: "Comissão disponível para saque",
                descricao: "Após a liberação da comissão",
                dataHora: "2026-05-10T09:30:00-03:00",
                tom: "neutro",
              },
              {
                id: "ev-2",
                titulo: "Comissão liberada",
                descricao: "Aguardando condições de liberação",
                dataHora: "2026-04-20T14:10:00-03:00",
                tom: "alerta",
              },
              {
                id: "ev-3",
                titulo: "Venda realizada",
                descricao: "Pelo seu link de divulgação",
                dataHora: "2026-04-15T10:46:00-03:00",
                tom: "info",
              },
            ]}
          />
        </div>
      </Secao>

      <Secao titulo="HeaderEntidade">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card className="rounded-2xl p-5 shadow-none">
            <HeaderEntidade
              nome="Maria Eduarda Costa Albuquerque"
              descricao="Criadora de conteúdo"
              handle="@mariaeduarda.viaja"
              termosAceitosEm="2026-03-27T09:00:00-03:00"
              afiliadoDesde="2026-03-27T09:00:00-03:00"
            />
          </Card>
          <Card className="rounded-2xl p-5 shadow-none">
            <HeaderEntidade
              nome="Maria Auxiliadora dos Santos Albuquerque de Oliveira Cavalcanti"
              termosAceitosEm={null}
              afiliadoDesde={null}
            />
          </Card>
        </div>
      </Secao>

      <Secao titulo="ResumoNegociacao">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card className="rounded-2xl p-5 shadow-none">
            <ResumoNegociacao
              linhas={[
                {
                  id: "produto",
                  rotulo: "O afiliado busca divulgar",
                  valor: "Cavalgada ao pôr do sol",
                },
                { id: "preco", rotulo: "Preço por pessoa", valor: formatarMoeda(450) },
                { id: "media", rotulo: "Comissão média do produto", valor: "8%" },
                {
                  id: "solicitada",
                  rotulo: "Comissão solicitada pelo afiliado",
                  valor: "10%",
                  enfase: "primario",
                },
              ]}
            />
          </Card>
          <Card className="rounded-2xl p-5 shadow-none">
            <ResumoNegociacao
              linhas={[
                {
                  id: "produto",
                  rotulo: "O afiliado busca divulgar",
                  valor: "Cavalgada ao pôr do sol",
                },
                { id: "preco", rotulo: "Preço por pessoa", valor: formatarMoeda(450) },
                { id: "media", rotulo: "Comissão média do produto", valor: "8%" },
                {
                  id: "anterior",
                  rotulo: "Comissão solicitada pelo afiliado anteriormente",
                  valor: "12%",
                },
                {
                  id: "contraproposta",
                  rotulo: "Contraproposta do afiliado",
                  valor: "10%",
                  enfase: "primario",
                },
              ]}
            />
          </Card>
        </div>
      </Secao>

      <Secao titulo="DialogCapturaMotivo">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setDialogMotivo("destrutivo")}>
            Abrir com tom destrutivo
          </Button>
          <Button variant="outline" onClick={() => setDialogMotivo("neutro")}>
            Abrir com tom neutro
          </Button>
        </div>
        <DialogCapturaMotivo
          aberto={dialogMotivo !== null}
          titulo={dialogMotivo === "destrutivo" ? "Recusar proposta" : "Remover produto do escopo"}
          entidade={{
            titulo: "Maria Eduarda Costa Albuquerque",
            subtitulo: "Cavalgada ao pôr do sol",
          }}
          motivos={motivosRecusa}
          avisoTexto="O afiliado será notificado com o motivo selecionado e a descrição."
          tomAcao={dialogMotivo ?? "neutro"}
          motivoObrigatorio
          rotuloConfirmar={dialogMotivo === "destrutivo" ? "Recusar proposta" : "Remover produto"}
          aoConfirmar={() => setDialogMotivo(null)}
          aoCancelar={() => setDialogMotivo(null)}
        />
      </Secao>
    </div>
  );
}

function Secao({
  titulo,
  children,
}: {
  readonly titulo: string;
  readonly children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
        {titulo}
      </h2>
      {children}
    </section>
  );
}
