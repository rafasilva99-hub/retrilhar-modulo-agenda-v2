# Todo 12: browser QA da Ajuda

Data: 2026-07-20
Rota alvo: `http://127.0.0.1:5175/#ajuda`

## Servidor

Invocação:

```text
npm run dev -- --host 127.0.0.1
```

Resultado: exit 0. As portas 5173 e 5174 já estavam ocupadas; o Vite subiu em 5175.

Probe HTTP:

```text
curl -fsS -I http://127.0.0.1:5175/#ajuda
```

Resultado: exit 0, `HTTP/1.1 200 OK`, `Content-Type: text/html`.

## Cenários pedidos

Não executados em navegador real. A sessão não expõe `agent-browser`, Chromium/Chrome,
Playwright instalado ou endpoint CDP nas portas 9222/9223. Probes registrados:

```text
command -v agent-browser chromium google-chrome safari
```

Resultado: nenhum binário encontrado.

```text
curl -fsS http://127.0.0.1:9222/json/version
curl -fsS http://127.0.0.1:9223/json/version
```

Resultado: exit 7 em ambas, conexão recusada.

Assim, não há screenshot ou interação browser para alegar. Os mesmos fluxos foram cobertos
com DOM real no Vitest em `src/modules/afiliados/AjudaPage.test.tsx`:

- busca `comissões`, expande a pergunta "Quando recebo minhas comissões?" e confirma a resposta;
- busca `semresultadozz` e confirma "Nenhum resultado encontrado";
- aciona `Voltar para Afiliados` e `Fechar`, confirmando `window.location.hash === "#afiliados"`.

Artefato de teste: `.omo/evidence/afiliados-front-plan/task-12-ajuda.txt`.

Status de browser QA: BLOCKED_BY_TOOLING, sem mudança de produto necessária.
