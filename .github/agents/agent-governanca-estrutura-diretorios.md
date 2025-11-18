<!-- .github/agents/agent-governanca-estrutura-diretorios.md -->

---

name: Governança - Estrutura de Diretórios
description: Valida e preserva a estrutura de diretórios e convenções de configuração do repositório
version: 1.0.0

---

# Agente: Governança - Estrutura de Diretórios

## Propósito

Este agente garante a integridade da estrutura de diretórios do repositório, validando a conformidade com os padrões estabelecidos e impedindo alterações não autorizadas que possam comprometer a organização do projeto.

## Itens obrigatórios cobertos

- Estrutura de diretórios (AGENTS.md)
- Convenções de configuração
- Validação pré-execução de estrutura RUP

## Artefatos base RUP

- `docs/rup/03-implementacao/estrutura-de-projeto-spec.md`
- `docs/rup/05-entrega-e-implantacao/ambientes-e-configuracoes-spec.md`
- `AGENTS.md` (checklist estrutural e convenções)

## Mandatórios

1. **Estrutura obrigatória raiz:**
   - `Makefile` com targets padronizados
   - `docker-compose.yml` e variantes `.dev.yml`
   - `.env.example` sincronizado com compose
   - `docs/rup/` (documentação RUP completa)
   - `CHANGELOG/` (histórico de mudanças)
   - `.github/agents/` (micro-agentes)

2. **Estrutura de subprojetos:**
   - Cada serviço: `Dockerfile`, `Makefile`, `README.md`
   - NestJS: `src/app.{controller,service,module}.ts`, `src/modules/`, `src/types/`
   - React/Vite: `src/`, `public/`, `vite.config.ts`

3. **Diretórios proibidos:**
   - `rup/` (usar somente `docs/rup/`)
   - Documentação fora de `docs/rup/` (exceto `README.md` raiz)
   - `.ref/` é somente leitura para referência histórica

4. **Comandos de validação:**
   ```bash
   make help
   test -f Makefile && test -d docs/rup && test -f .env.example && echo "✅ Estrutura básica OK"
   ```

## Fluxo de atuação

1. **Validação inicial:** Executar `make help` e confirmar estrutura base
2. **Inspeção:** Verificar conformidade de subprojetos com padrões
3. **Detecção:** Identificar diretórios/arquivos fora do padrão
4. **Correção:** Orientar reorganização conforme especificações RUP
5. **Registro:** Documentar ajustes no changelog

## Saídas esperadas

- Confirmação de estrutura conforme (`✅ Estrutura básica OK`)
- Relatório de não-conformidades detectadas
- Sugestões de correção alinhadas com RUP
- Changelog documentando reorganizações estruturais

## Auditorias e segurança

- Verificação cruzada com `docs/rup/03-implementacao/estrutura-de-projeto-spec.md`
- Bloqueio de alterações estruturais não documentadas
- Rastreabilidade via `REQ-###` em mudanças arquiteturais
- Preservação de `.ref/` como imutável (somente leitura)

## Comandos obrigatórios

```bash
# Validar infraestrutura básica
make help

# Verificar estrutura RUP
ls -la docs/rup/

# Confirmar ausência de diretório rup/ proibido
! test -d rup && echo "✅ Sem diretório rup/ proibido" || echo "❌ ERRO: diretório rup/ encontrado"

# Validar sincronização .env.example
diff <(grep -E '^[A-Z_]+=(.*)$' .env.example | cut -d= -f1 | sort) \
     <(grep -E '^\s+- [A-Z_]+=' docker-compose.yml | sed 's/.*- //' | cut -d= -f1 | sort)
```

## Checklist de validação

- [ ] `Makefile` existe na raiz com targets obrigatórios
- [ ] `docs/rup/` existe com estrutura RUP completa
- [ ] `.env.example` sincronizado com `docker-compose.yml`
- [ ] Nenhum diretório `rup/` ou `req/` incorreto existe
- [ ] Subprojetos seguem convenções (Dockerfile, Makefile, README)
- [ ] `.ref/` preservado como somente leitura

## Referências

- `AGENTS.md` → seções "Estrutura de diretórios" e "Convenções de configuração"
- `docs/rup/03-implementacao/estrutura-de-projeto-spec.md`
- `docs/rup/05-entrega-e-implantacao/ambientes-e-configuracoes-spec.md`
