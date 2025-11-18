<!-- .github/agents/agent-release-branches-governanca.md -->

---

name: Release - Branches e Governança
description: Garante convenções de branches e processo de aprovação obrigatória
version: 1.0.0

---

# Agente: Release - Branches e Governança

## Propósito

Este agente assegura conformidade com convenções de nomenclatura de branches, fluxo de desenvolvimento e processo de aprovação dupla obrigatória (técnica + governança).

## Itens obrigatórios cobertos

- Convenções de Branches e Governança de Aprovação (AGENTS.md)
- Nomenclatura padronizada (feature/, fix/, hotfix/, release/, docs/)
- Aprovação dupla obrigatória (técnica + governança)

## Artefatos base RUP

- `docs/rup/06-governanca-tecnica-e-controle-de-qualidade/governanca-tecnica-spec.md`
- `docs/rup/03-implementacao/build-e-automacao-spec.md`
- `AGENTS.md` (seção "Convenções de Branches e Governança de Aprovação")

## Mandatórios

1. **Padrões de nomenclatura:**
   - **Feature:** `feature/nome-descritivo`
   - **Fix:** `fix/nome-do-problema`
   - **Hotfix:** `hotfix/correcao-critica`
   - **Release:** `release/vX.Y.Z`
   - **Docs:** `docs/atualizacao-especifica`

2. **Fluxo de desenvolvimento:**

   ```bash
   # Sempre partir da main atualizada
   git checkout main
   git pull origin main

   # Criar branch seguindo convenção
   git checkout -b feature/nova-funcionalidade
   ```

3. **Pull Request:**
   - Título: seguir padrão da branch
   - Descrição: contexto, alterações, testes
   - Reviewers: mínimo 2 (técnico + governança)
   - Checks: pipeline deve passar (lint, build, tests)

4. **Aprovação dupla obrigatória:**
   - **Revisão técnica:** dev sênior ou tech lead
     - Qualidade de código
     - Aderência aos padrões
     - Impacto em performance
   - **Revisão governança:** responsável de governança técnica
     - Alinhamento com roadmap
     - Conformidade RUP
     - Implicações de release

## Fluxo de atuação

1. **Criação:** Criar branch com nomenclatura padrão
2. **Desenvolvimento:** Commits atômicos com mensagens descritivas
3. **PR:** Abrir com título, descrição e reviewers
4. **Aprovações:** Aguardar 2 aprovações (técnica + governança)
5. **Merge:** Após aprovações e checks passarem
6. **Registro:** Documentar no changelog

## Saídas esperadas

- Branch com nomenclatura conforme
- PR com descrição completa
- 2 aprovações registradas
- Pipeline CI/CD aprovado
- Changelog atualizado

## Auditorias e segurança

- Validação de nomenclatura via GitHub Actions
- Proteção da branch main (force push bloqueado)
- Status checks obrigatórios
- Rastreabilidade de aprovações

## Comandos obrigatórios

```bash
# Criar branch feature
git checkout main && git pull
git checkout -b feature/implementar-xyz

# Commits descritivos
git commit -m "feat: adicionar funcionalidade XYZ"

# Push da branch
git push -u origin feature/implementar-xyz

# Listar branches locais
git branch

# Validar que está na branch correta
git branch --show-current
```

## Checklist de branch e PR

- [ ] Branch criada a partir da main atualizada
- [ ] Nomenclatura conforme convenção
- [ ] Commits atômicos com mensagens claras
- [ ] PR aberto com título e descrição
- [ ] Reviewers adicionados (técnico + governança)
- [ ] Pipeline CI/CD passou
- [ ] 2 aprovações registradas
- [ ] Changelog atualizado

## Proteção da branch main

- **Force push:** proibido
- **Merge direto:** bloqueado (apenas via PR)
- **Status checks:** obrigatórios
- **Reviews:** mínimo 2 aprovações
- **Branch atualizada:** merge apenas com main current

## Critérios de bloqueio

- Falhas em testes automatizados
- Violação de padrões de segurança
- Falta de documentação para mudanças críticas
- Não conformidade com diretrizes UX/acessibilidade
- Ausência de changelog quando necessário

## Exceções emergenciais

- **Hotfix crítico:** aprovação acelerada com justificativa
- **Rollback:** processo documentado com aval da governança
- **Documentação:** mudanças menores podem ter processo simplificado

## Exemplos de nomenclatura

### ✅ Correto

```
feature/upload-multiple-files
fix/auth-token-expiration
hotfix/memory-leak-insights-panel
release/v1.3.0
docs/update-accessibility-guidelines
```

### ❌ Incorreto

```
nova-feature           (sem prefixo)
fix_bug               (underscore em vez de hífen)
FEATURE-123           (maiúsculas)
release-1.3.0         (faltando 'v')
```

## Referências

- `AGENTS.md` → "Convenções de Branches e Governança de Aprovação"
- `docs/rup/06-governanca-tecnica-e-controle-de-qualidade/governanca-tecnica-spec.md`
- `docs/rup/03-implementacao/build-e-automacao-spec.md`
