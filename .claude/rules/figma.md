# Uso do Figma MCP

- Chamar get_metadata (ou verificação equivalente de status/node) antes de
  get_design_context. Nunca get_design_context em frame de fluxo inteiro,
  só em node de componente ou seção.
- Chamar get_code_connect_map antes de criar qualquer componente.
  Se existe import mapeado, usar o existente.
- Cores, spacing e tipografia sempre via token do tema do projeto
  (src/styles/theme.css). Nunca hex, nunca valor arbitrário tipo w-[37px].
- Ícones sempre via HugeIcons (@hugeicons/react + @hugeicons/core-free-icons).
  Nunca inline, nunca lucide.
- Chamar get_screenshot após gerar código e comparar antes de fechar a tarefa.
- File key do projeto Admin: HDCHTF7DCaSZwknQoLHVPQ
- Node ID na URL usa hífen, no MCP usa dois pontos. Converter sempre.
- A coleção de variáveis do arquivo contém apenas a escala Brand (P2);
  o extrato cru fica em design/tokens.json.
