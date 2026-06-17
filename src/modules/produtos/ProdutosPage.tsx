import { useState, useMemo } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  duracao: string;
  capacidade: number;
  status: "Ativo" | "Inativo" | "Rascunho";
  ultimaVenda: string;
  totalVendas: number;
}

const mockProdutos: Produto[] = [
  { id: "prod-001", nome: "Trilha Pico do Itacolomi", categoria: "Trilha", preco: 150, duracao: "3h", capacidade: 30, status: "Ativo", ultimaVenda: "Há 2 dias", totalVendas: 342 },
  { id: "prod-002", nome: "Rapel Cachoeira Alta", categoria: "Aventura", preco: 220, duracao: "2h", capacidade: 15, status: "Ativo", ultimaVenda: "Há 1 dia", totalVendas: 187 },
  { id: "prod-003", nome: "Canoagem Rio das Velhas", categoria: "Aquático", preco: 180, duracao: "4h", capacidade: 20, status: "Ativo", ultimaVenda: "Há 3 dias", totalVendas: 256 },
  { id: "prod-004", nome: "Trilha Cachoeira do Meio", categoria: "Trilha", preco: 90, duracao: "2h30", capacidade: 40, status: "Ativo", ultimaVenda: "Há 5 dias", totalVendas: 489 },
  { id: "prod-005", nome: "Escalada Pedra Grande", categoria: "Aventura", preco: 280, duracao: "5h", capacidade: 10, status: "Inativo", ultimaVenda: "Há 30 dias", totalVendas: 78 },
  { id: "prod-006", nome: "Passeio de Bike Serra do Curral", categoria: "Ciclismo", preco: 120, duracao: "3h", capacidade: 25, status: "Ativo", ultimaVenda: "Há 1 dia", totalVendas: 312 },
  { id: "prod-007", nome: "Observação de Aves - Parque Estadual", categoria: "Contemplação", preco: 75, duracao: "3h", capacidade: 15, status: "Ativo", ultimaVenda: "Há 7 dias", totalVendas: 134 },
  { id: "prod-008", nome: "Tirolesa Vale do Ouro", categoria: "Aventura", preco: 95, duracao: "1h", capacidade: 50, status: "Rascunho", ultimaVenda: "—", totalVendas: 0 },
  { id: "prod-009", nome: "Trekking Noturno Serra da Piedade", categoria: "Trilha", preco: 160, duracao: "4h", capacidade: 20, status: "Ativo", ultimaVenda: "Há 4 dias", totalVendas: 201 },
  { id: "prod-010", nome: "Stand Up Paddle Lagoa Santa", categoria: "Aquático", preco: 110, duracao: "2h", capacidade: 12, status: "Inativo", ultimaVenda: "Há 45 dias", totalVendas: 56 },
];

const statusColors: Record<string, { text: string; bg: string; border: string }> = {
  Ativo: { text: "#079455", bg: "#ecfdf3", border: "#abefc6" },
  Inativo: { text: "#535862", bg: "#f5f5f5", border: "#e9eaeb" },
  Rascunho: { text: "#dc6803", bg: "#fffaeb", border: "#fedf89" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ProdutosPage() {
  const [search, setSearch] = useState("");
  const [statusFilter] = useState<"todos" | "Ativo" | "Inativo" | "Rascunho">("todos");

  const filtered = useMemo(() => {
    let result = mockProdutos;
    if (statusFilter !== "todos") result = result.filter((p) => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.nome.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q));
    }
    return result;
  }, [search, statusFilter]);

  const totalProdutos = mockProdutos.length;
  const ativos = mockProdutos.filter((p) => p.status === "Ativo").length;
  const inativos = mockProdutos.filter((p) => p.status === "Inativo").length;
  const ticketMedio = Math.round(mockProdutos.filter((p) => p.status === "Ativo").reduce((s, p) => s + p.preco, 0) / ativos);

  return (
    <>
      {/* Header */}
      <div className="absolute left-[var(--shell-offset,248px)] right-[24px] top-[112px]">
        <h1 className="font-['Helvetica_Neue:Regular',sans-serif] text-[24px] text-[#0f172b] leading-[normal]">Produtos</h1>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#535862] mt-[4px]">Gerencie seu catálogo de atividades, experiências e pacotes.</p>
      </div>

      {/* Metric Cards */}
      <div className="absolute left-[var(--shell-offset,248px)] right-[24px] top-[178px] grid grid-cols-4 gap-[16px]">
        {[
          { label: "Total Produtos", value: totalProdutos.toString(), trend: "+2", trendUp: true },
          { label: "Ativos", value: ativos.toString(), trend: `${Math.round((ativos / totalProdutos) * 100)}%`, trendUp: true },
          { label: "Inativos", value: inativos.toString(), trend: `${inativos}`, trendUp: false },
          { label: "Ticket Médio", value: `R$ ${ticketMedio}`, trend: "+5%", trendUp: true },
        ].map((card) => (
          <div key={card.label} className="border border-[#e9eaeb] rounded-[12px] p-[20px] bg-white">
            <div className="flex items-center justify-between mb-[8px]">
              <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862]">{card.label}</p>
              <svg className="size-[16px] text-[#a4a7ae]" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[28px] text-[#181d27] leading-[1]">{card.value}</p>
            <div className="flex items-center gap-[6px] mt-[8px]">
              <div className={`flex items-center gap-[2px] px-[6px] py-[2px] rounded-[4px] ${card.trendUp ? "bg-[#ecfdf3] text-[#079455]" : "bg-[#fef3f2] text-[#d92d20]"}`}>
                <svg className={`size-[12px] ${card.trendUp ? "" : "rotate-180"}`} fill="none" viewBox="0 0 12 12"><path d="M6 9V3M6 3l3 3M6 3L3 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px]">{card.trend}</span>
              </div>
              <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">vs. mês anterior</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters + Actions */}
      <div className="absolute left-[var(--shell-offset,248px)] right-[24px] top-[310px] flex items-center gap-[12px]">
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-[8px] border border-[#e9eaeb] flex items-center gap-[10px] px-[14px] h-[40px]">
            <svg className="shrink-0 size-[16px] text-[#a4a7ae]" fill="none" viewBox="0 0 20 20"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M13.5 13.5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar"
              className="flex-1 font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#252b37] bg-transparent outline-none placeholder:text-[#a4a7ae]"
            />
          </div>
        </div>
        <button className="flex items-center gap-[6px] h-[40px] px-[16px] rounded-[8px] border border-[#e9eaeb] bg-white hover:bg-[#f8fafc] transition-colors cursor-pointer">
          <svg className="size-[16px] text-[#414651]" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#414651]">Filtros</span>
        </button>
        <button className="flex items-center gap-[6px] h-[40px] px-[16px] rounded-[8px] border border-[#e9eaeb] bg-white hover:bg-[#f8fafc] transition-colors cursor-pointer">
          <svg className="size-[16px] text-[#414651]" fill="none" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>
          <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#414651]">Ações em lote</span>
        </button>
        <button className="flex items-center gap-[6px] h-[40px] px-[16px] rounded-[8px] bg-[#0b5ed7] hover:bg-[#0a4fb3] transition-colors cursor-pointer">
          <svg className="size-[16px] text-white" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="font-['Helvetica_Neue:Medium',sans-serif] text-[14px] text-white">Novo Produto</span>
        </button>
      </div>

      {/* Table */}
      <div className="absolute left-[var(--shell-offset,248px)] right-[24px] top-[370px]" style={{ paddingBottom: "40px" }}>
        <div className="bg-white border border-[#e9eaeb] rounded-[12px] overflow-hidden">
          {/* Table header */}
          <div className="flex items-center border-b border-[#e9eaeb] bg-[#fafafa] px-[16px] h-[44px]">
            <div className="w-[40px] shrink-0">
              <div className="bg-white border border-[#d5d7da] rounded-[6px] size-[20px]" />
            </div>
            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px] text-[#717680] uppercase tracking-[0.5px] flex-1 min-w-0">Produto</p>
            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px] text-[#717680] uppercase tracking-[0.5px] w-[100px] shrink-0">Categoria</p>
            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px] text-[#717680] uppercase tracking-[0.5px] w-[100px] shrink-0 text-right">Preço</p>
            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px] text-[#717680] uppercase tracking-[0.5px] w-[80px] shrink-0 text-center">Duração</p>
            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px] text-[#717680] uppercase tracking-[0.5px] w-[100px] shrink-0 text-center">Capacidade</p>
            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px] text-[#717680] uppercase tracking-[0.5px] w-[100px] shrink-0">Última venda</p>
            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px] text-[#717680] uppercase tracking-[0.5px] w-[80px] shrink-0 text-center">Status</p>
            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px] text-[#717680] uppercase tracking-[0.5px] w-[60px] shrink-0 text-center">Ações</p>
          </div>

          {/* Table rows */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[48px] gap-[8px]">
              <svg className="size-[32px] text-[#a4a7ae]" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#717680]">Nenhum produto encontrado</p>
            </div>
          ) : filtered.map((produto, idx) => {
            const sc = statusColors[produto.status];
            return (
              <div key={produto.id} className={`flex items-center px-[16px] h-[56px] cursor-pointer hover:bg-[#f8fafc] transition-colors ${idx > 0 ? "border-t border-[#f5f5f5]" : ""}`}>
                <div className="w-[40px] shrink-0">
                  <div className="bg-white border border-[#d5d7da] rounded-[6px] size-[20px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27] truncate">{produto.nome}</p>
                </div>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862] w-[100px] shrink-0">{produto.categoria}</p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#181d27] w-[100px] shrink-0 text-right">R$ {produto.preco}</p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862] w-[80px] shrink-0 text-center">{produto.duracao}</p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862] w-[100px] shrink-0 text-center">{produto.capacidade} pax</p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#535862] w-[100px] shrink-0">{produto.ultimaVenda}</p>
                <div className="w-[80px] shrink-0 flex justify-center">
                  <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] px-[8px] py-[2px] rounded-full" style={{ color: sc?.text, backgroundColor: sc?.bg, border: `1px solid ${sc?.border}` }}>{produto.status}</span>
                </div>
                <div className="w-[60px] shrink-0 flex justify-center">
                  <button className="flex items-center justify-center size-[32px] rounded-[8px] border border-[#e9eaeb] bg-white hover:bg-[#f8fafc] transition-colors cursor-pointer">
                    <svg className="size-[14px]" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="3.5" r="1" fill="#717680"/><circle cx="8" cy="8" r="1" fill="#717680"/><circle cx="8" cy="12.5" r="1" fill="#717680"/></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between mt-[16px] px-[4px]">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#717680]">Nenhum produto selecionado</p>
          <div className="flex items-center gap-[8px]">
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">Página 1 de 1</p>
            <div className="flex items-center gap-[4px]">
              {["«", "‹", "›", "»"].map((arrow, i) => (
                <button key={i} className={`flex items-center justify-center size-[32px] rounded-[6px] border transition-colors ${i < 2 ? "border-[#e9eaeb] bg-white text-[#d0d5dd] cursor-not-allowed" : "border-[#e9eaeb] bg-white text-[#414651] hover:bg-[#f8fafc] cursor-pointer"}`}>
                  <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px]">{arrow}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
