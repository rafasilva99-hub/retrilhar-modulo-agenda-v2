# Todo 14 handoff

QA used Vite on port `51654`. Direct screen links:

- [Afiliados](http://127.0.0.1:51654/#afiliados)
- [Indicações](http://127.0.0.1:51654/#indicacoes)
- [Ganhos](http://127.0.0.1:51654/#ganhos)
- [Produtos e Links](http://127.0.0.1:51654/#produtosLinks)
- [Configurações](http://127.0.0.1:51654/#configuracoes)
- [Ajuda](http://127.0.0.1:51654/#ajuda)

The Vite server was cleaned up after QA, so these links are reproducible by starting it again with:

```sh
npm run dev -- --host 127.0.0.1 --port 51654 --strictPort
```

Evidence: `final-browser.md`, `final-check.txt`, `final-affiliate-tests.txt`, and `final-cleanup.txt` in this directory.
