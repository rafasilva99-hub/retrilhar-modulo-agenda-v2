import { useState } from "react";
import { Search01Icon, Sent02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  type ColunaTabela,
  FiltroSegmentado,
  mostrarToastConfirmacao,
  TabelaBase,
} from "@/components/blocos";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ProdutoDivulgavel } from "@/types/api/afiliados";

import {
  listarCategoriasProdutos,
  listarProdutosDivulgaveis,
  obterSugestaoConvite,
} from "../services/afiliados-service";

import { FaixaSecao } from "./faixa-secao";

// Drawer AFI-01.b (frame 16057:159988), habilitado por decisão de produto em
// 31/07/2026, antes do fechamento formal de P4 e P6. As variantes .b2 (seleção
// de produtos) e .b3 (comissão individual por produto) seguem o frame
// 16062:163414.

type EscopoProdutos = "todos" | "selecionados";
type AplicacaoComissao = "lote" | "individual";
type TipoComissao = "percentual" | "fixo";
type TipoRecebimento = "split" | "pix" | "conta";

interface ComissaoIndividual {
  readonly tipo: TipoComissao;
  readonly valor: string;
}

const comissaoIndividualPadrao: ComissaoIndividual = { tipo: "percentual", valor: "" };

const colunasComissaoIndividual: readonly ColunaTabela[] = [
  { id: "produto", titulo: "Produto selecionado" },
  { id: "tipo", titulo: "Tipo de comissão" },
  { id: "valor", titulo: "Valor" },
];

const todasCategorias = "todas";

interface ConvidarAfiliadoDrawerProps {
  readonly aberto: boolean;
  readonly aoFechar: () => void;
}

export function ConvidarAfiliadoDrawer({ aberto, aoFechar }: ConvidarAfiliadoDrawerProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  // Escopo começa sem escolha: o envio só é liberado após o gestor definir
  // os produtos do convite (roteiro do teste de usabilidade).
  const [escopo, setEscopo] = useState<EscopoProdutos | null>(null);
  const [buscaProduto, setBuscaProduto] = useState("");
  const [categoriaProduto, setCategoriaProduto] = useState(todasCategorias);
  const [produtosSelecionados, setProdutosSelecionados] = useState<readonly string[]>([]);
  const [aplicacao, setAplicacao] = useState<AplicacaoComissao>("lote");
  const [tipoComissao, setTipoComissao] = useState<TipoComissao>("percentual");
  const [valorComissao, setValorComissao] = useState("");
  const [comissoesIndividuais, setComissoesIndividuais] = useState<
    Readonly<Record<string, ComissaoIndividual>>
  >({});
  const [recebimento, setRecebimento] = useState<TipoRecebimento>("split");

  const categorias = listarCategoriasProdutos();
  const produtosFiltrados = listarProdutosDivulgaveis(
    buscaProduto,
    categoriaProduto === todasCategorias ? "" : categoriaProduto
  );
  // Escopo efetivo da comissão individual: todos os produtos divulgáveis ou
  // apenas os marcados na seleção, na ordem do catálogo.
  const produtosEscopo =
    escopo === "todos"
      ? listarProdutosDivulgaveis()
      : listarProdutosDivulgaveis().filter((produto) => produtosSelecionados.includes(produto.id));

  // Preenchimento guiado do teste de usabilidade: focar um campo vazio
  // aplica a sugestão do roteiro, mantendo o campo editável.
  const sugestao = obterSugestaoConvite();
  const preencherSeVazio = (valor: string, definir: (novo: string) => void, sugerido: string) => {
    if (valor.trim().length === 0) definir(sugerido);
  };

  const produtosDefinidos =
    escopo === "todos" || (escopo === "selecionados" && produtosSelecionados.length > 0);
  const podeEnviar = nome.trim().length > 0 && email.trim().length > 0 && produtosDefinidos;

  const alternarProduto = (id: string) => {
    setProdutosSelecionados((atual) =>
      atual.includes(id) ? atual.filter((outro) => outro !== id) : [...atual, id]
    );
  };

  const obterComissaoIndividual = (id: string): ComissaoIndividual =>
    comissoesIndividuais[id] ?? comissaoIndividualPadrao;

  const definirComissaoIndividual = (id: string, mudanca: Partial<ComissaoIndividual>) => {
    setComissoesIndividuais((atual) => ({
      ...atual,
      [id]: { ...(atual[id] ?? comissaoIndividualPadrao), ...mudanca },
    }));
  };

  const limpar = () => {
    setNome("");
    setEmail("");
    setEscopo(null);
    setBuscaProduto("");
    setCategoriaProduto(todasCategorias);
    setProdutosSelecionados([]);
    setAplicacao("lote");
    setTipoComissao("percentual");
    setValorComissao("");
    setComissoesIndividuais({});
    setRecebimento("split");
  };

  // Toast de conclusão do convite conforme o frame 15998:136576.
  const enviar = () => {
    mostrarToastConfirmacao({
      titulo: "Convite enviado com sucesso",
      descricao: `Enviamos o convite para ${email.trim()}. A filiação será ativa assim que a conta for criada.`,
    });
    limpar();
    aoFechar();
  };

  return (
    <Sheet open={aberto} onOpenChange={(abrir) => (abrir ? undefined : aoFechar())}>
      <SheetContent
        side="right"
        className="gap-0 overflow-y-auto rounded-l-xl p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-[720px]"
      >
        <SheetHeader className="px-6 py-4">
          <SheetTitle className="text-lg font-semibold">Convidar afiliado</SheetTitle>
          <SheetDescription className="sr-only">
            Envie um convite de afiliação com escopo de produtos, comissão e recebimento.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col">
          <FaixaSecao>Dados do convidado (a)</FaixaSecao>
          <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="convite-nome">Nome do afiliado (a)</Label>
              <Input
                id="convite-nome"
                value={nome}
                placeholder="Insira o nome"
                onFocus={() => preencherSeVazio(nome, setNome, sugestao.nome)}
                onChange={(event) => setNome(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="convite-email">E-mail do afiliado (a)</Label>
              <Input
                id="convite-email"
                type="email"
                value={email}
                placeholder="Insira o e-mail"
                onFocus={() => preencherSeVazio(email, setEmail, sugestao.email)}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <FaixaSecao>Configurações de produto</FaixaSecao>
          <div className="space-y-4 px-6 py-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <CartaoEscopo
                titulo="Todos os produtos"
                descricao="Produtos novos da organização serão vinculados automaticamente para esse usuário."
                selecionado={escopo === "todos"}
                aoSelecionar={() => setEscopo("todos")}
              />
              <CartaoEscopo
                titulo="Produtos selecionados"
                descricao="Escolha quais produtos esse afiliado poderá divulgar."
                selecionado={escopo === "selecionados"}
                aoSelecionar={() => setEscopo("selecionados")}
              />
            </div>
            {escopo === "selecionados" ? (
              <div className="border-border bg-card overflow-hidden rounded-xl border">
                <div className="bg-muted/40 border-border flex flex-wrap items-center gap-3 border-b px-4 py-3">
                  <div className="relative min-w-48 flex-1">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={16}
                      className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <Input
                      value={buscaProduto}
                      placeholder="Buscar produto"
                      aria-label="Buscar produto"
                      className="bg-card pl-9"
                      onChange={(event) => setBuscaProduto(event.target.value)}
                    />
                  </div>
                  <Select value={categoriaProduto} onValueChange={setCategoriaProduto}>
                    <SelectTrigger className="bg-card w-44" aria-label="Filtrar por categoria">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={todasCategorias}>Todas as categorias</SelectItem>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="max-h-72 space-y-3 overflow-y-auto p-4">
                  {produtosFiltrados.length === 0 ? (
                    <p className="text-muted-foreground py-6 text-center text-sm">
                      Nenhum produto encontrado para a busca atual.
                    </p>
                  ) : (
                    produtosFiltrados.map((produto) => (
                      <ItemProdutoSelecionavel
                        key={produto.id}
                        produto={produto}
                        selecionado={produtosSelecionados.includes(produto.id)}
                        aoAlternar={() => alternarProduto(produto.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <FaixaSecao>Configurações de comissão</FaixaSecao>
          <div className="space-y-4 px-6 py-5">
            <div className="space-y-2">
              <Label>Aplicação</Label>
              <FiltroSegmentado
                opcoes={[
                  { id: "lote", rotulo: "Em lote (todos os produtos do escopo)" },
                  { id: "individual", rotulo: "Individual (definir por produto)" },
                ]}
                valor={aplicacao}
                aoMudar={(id) => setAplicacao(id as AplicacaoComissao)}
              />
            </div>
            {/* [PENDENTE P4] Regra percentual vs valor fixo ainda é do Matheus;
                o formulário registra a escolha sem cálculo derivado. */}
            {aplicacao === "lote" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="convite-tipo-comissao">Tipo de comissão</Label>
                  <Select
                    value={tipoComissao}
                    onValueChange={(valor) => setTipoComissao(valor as TipoComissao)}
                  >
                    <SelectTrigger id="convite-tipo-comissao" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentual">Percentual (%)</SelectItem>
                      <SelectItem value="fixo">Valor fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="convite-valor-comissao">Valor da comissão</Label>
                  <Input
                    id="convite-valor-comissao"
                    value={valorComissao}
                    placeholder="Insira o valor da comissão"
                    onFocus={() =>
                      preencherSeVazio(valorComissao, setValorComissao, sugestao.valorComissao)
                    }
                    onChange={(event) => setValorComissao(event.target.value)}
                  />
                </div>
              </div>
            ) : (
              <TabelaBase
                colunas={colunasComissaoIndividual}
                estaVazia={produtosEscopo.length === 0}
                vazio={
                  <p className="border-border text-muted-foreground rounded-xl border border-dashed px-4 py-6 text-center text-sm">
                    Nenhum produto no escopo. Marque produtos em Configurações de produto para
                    definir a comissão de cada um.
                  </p>
                }
              >
                {produtosEscopo.map((produto) => {
                  const comissao = obterComissaoIndividual(produto.id);
                  return (
                    <TableRow key={produto.id} className="hover:bg-transparent">
                      <TableCell className="font-medium">{produto.nome}</TableCell>
                      <TableCell>
                        <Select
                          value={comissao.tipo}
                          onValueChange={(valor) =>
                            definirComissaoIndividual(produto.id, {
                              tipo: valor as TipoComissao,
                            })
                          }
                        >
                          <SelectTrigger
                            className="w-40"
                            aria-label={`Tipo de comissão de ${produto.nome}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentual">Percentual (%)</SelectItem>
                            <SelectItem value="fixo">Valor fixo (R$)</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={comissao.valor}
                          placeholder="Insira o valor da comissão"
                          aria-label={`Valor da comissão de ${produto.nome}`}
                          className="min-w-52"
                          onFocus={() =>
                            preencherSeVazio(
                              comissao.valor,
                              (novo) => definirComissaoIndividual(produto.id, { valor: novo }),
                              sugestao.valorComissao
                            )
                          }
                          onChange={(event) =>
                            definirComissaoIndividual(produto.id, {
                              valor: event.target.value,
                            })
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TabelaBase>
            )}
          </div>

          <FaixaSecao>Tipo de recebimento</FaixaSecao>
          <div className="px-6 py-5">
            <FiltroSegmentado
              opcoes={[
                { id: "split", rotulo: "Split de pagamento" },
                { id: "pix", rotulo: "Via PIX" },
                { id: "conta", rotulo: "Conta bancária" },
              ]}
              valor={recebimento}
              aoMudar={(id) => setRecebimento(id as TipoRecebimento)}
            />
          </div>

          <div className="border-border mt-auto flex flex-wrap justify-end gap-3 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={aoFechar}>
              Cancelar
            </Button>
            <Button type="button" className="gap-2" disabled={!podeEnviar} onClick={enviar}>
              <HugeiconsIcon icon={Sent02Icon} size={16} aria-hidden="true" />
              Enviar convite
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ItemProdutoSelecionavel({
  produto,
  selecionado,
  aoAlternar,
}: {
  readonly produto: ProdutoDivulgavel;
  readonly selecionado: boolean;
  readonly aoAlternar: () => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
        selecionado ? "border-primary/30 bg-primary/5" : "border-border bg-card hover:bg-muted/50"
      )}
    >
      <Checkbox
        checked={selecionado}
        onCheckedChange={aoAlternar}
        aria-label={`Selecionar ${produto.nome}`}
      />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{produto.nome}</span>
        <span className="text-muted-foreground block truncate text-xs">
          {produto.categoria} · {produto.modalidade}
        </span>
      </span>
    </label>
  );
}

function CartaoEscopo({
  titulo,
  descricao,
  selecionado,
  aoSelecionar,
}: {
  readonly titulo: string;
  readonly descricao: string;
  readonly selecionado: boolean;
  readonly aoSelecionar: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selecionado}
      className={cn(
        "flex flex-col items-start justify-start rounded-xl border p-4 text-left transition-colors",
        selecionado ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50 bg-card"
      )}
      onClick={aoSelecionar}
    >
      <p className={cn("text-sm font-medium", selecionado && "text-primary")}>{titulo}</p>
      <p className="text-muted-foreground mt-1 text-xs">{descricao}</p>
    </button>
  );
}
