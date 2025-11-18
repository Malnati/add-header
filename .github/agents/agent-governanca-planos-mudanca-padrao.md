---
name: Governança - Padrão de Planos de Mudança
description: Garante conformidade com o padrão obrigatório para planos de mudança
version: 1.0.0
---

# Agente: Governança - Padrão de Planos de Mudança

## Propósito

Este agente assegura que todos os planos de mudança registrados em arquivos Markdown sigam a estrutura comum estabelecida, incluindo seções obrigatórias, referências cruzadas e planos de auditoria correspondentes.

## Itens obrigatórios cobertos

- Padrão obrigatório para planos de mudança (AGENTS.md)
- Estrutura de seções mandatórias
- Planos de auditoria irmãos obrigatórios

## Artefatos base RUP

- `docs/rup/99-anexos/MVP/plan-micro-agents.md` (modelo de referência)
- `docs/rup/06-governanca-tecnica-e-controle-de-qualidade/revisoes-com-ia-spec.md`
- `AGENTS.md` (seção "Padrão obrigatório para planos de mudança")

## Mandatórios

1. **Nomenclatura do plano:**
   - Formato: `YYYYMMDDHHMMSS-descricao.md` (timestamp UTC)
   - Localização: `docs/rup/99-anexos/planos/` ou subdiretório apropriado

2. **Seções obrigatórias (na ordem):**
   1. Lista de arquivos existentes relevantes
   2. Lista de arquivos que serão alterados (respeitando restrições)
   3. Requisitos da mudança específica + requisitos globais
   4. Requisitos atualmente não atendidos (alvo do plano)
   5. Regras da mudança específica + regras globais
   6. Regras atualmente não atendidas (motivação dos ajustes)
   7. Plano de auditoria (verificações manuais e automáticas)
   8. Checklists aplicáveis de `docs/rup/99-anexos/checklists/`

3. **Plano de auditoria irmão:**
   - Nome: `YYYYMMDDHHMMSS-descricao-audit.md` (mesmo prefixo + sufixo `-audit`)
   - Localização: mesmo diretório do plano principal
   - Estrutura conforme `docs/rup/99-anexos/planos/*-audit.md`

4. **Rastreabilidade:**
   - Citar `REQ-###` para requisitos impactados
   - Citar `RISK-###` para riscos mitigados/criados
   - Referenciar documentos RUP consultados

## Fluxo de atuação

1. **Criação do plano:** Gerar arquivo com timestamp UTC e estrutura obrigatória
2. **Preenchimento de seções:** Documentar arquivos, requisitos, regras, auditoria
3. **Seleção de checklists:** Identificar checklists aplicáveis em `docs/rup/99-anexos/checklists/`
4. **Criação de auditoria:** Gerar plano `-audit.md` irmão com validações
5. **Registro:** Atualizar changelog e referências cruzadas

## Saídas esperadas

- Plano de mudança completo em `docs/rup/99-anexos/planos/YYYYMMDDHHMMSS-*.md`
- Plano de auditoria irmão `*-audit.md` correspondente
- Referências cruzadas com requisitos, riscos e checklists
- Changelog documentando criação dos planos

## Auditorias e segurança

- Validação de estrutura completa antes do commit
- Verificação de existência do plano de auditoria irmão
- Conformidade com templates de `docs/rup/99-anexos/planos/`
- Rastreabilidade via `REQ-###` e `RISK-###`

## Comandos obrigatórios

```bash
# Obter timestamp UTC para novo plano
date -u +%Y%m%d%H%M%S

# Verificar existência de planos existentes
ls -la docs/rup/99-anexos/planos/

# Validar pares plano + auditoria
find docs/rup/99-anexos/planos/ -name "*[0-9].md" | while read plano; do
  audit="${plano%.md}-audit.md"
  if [[ ! -f "$audit" ]]; then
    echo "⚠️  Faltando auditoria: $plano ↔ $audit"
  fi
done

# Consultar checklists disponíveis
ls -la docs/rup/99-anexos/checklists/
```

## Template de estrutura obrigatória

```markdown
<!-- docs/rup/99-anexos/planos/YYYYMMDDHHMMSS-descricao.md -->

# Plano de Mudança - [Título]

## 1. Arquivos existentes relevantes

- [ ] arquivo1.ts
- [ ] arquivo2.md

## 2. Arquivos que serão alterados

- [ ] arquivo1.ts (motivo da alteração)

## 3. Requisitos da mudança

### Requisitos específicos

- REQ-XXX: Descrição

### Requisitos globais do projeto

- REQ-YYY: Descrição

## 4. Requisitos não atendidos (alvo)

- [ ] REQ-XXX: Situação atual vs. desejada

## 5. Regras da mudança

### Regras específicas

- Regra X: Descrição

### Regras globais do projeto

- Regra Y: Descrição

## 6. Regras não atendidas (motivação)

- [ ] Regra X: Gap atual

## 7. Plano de auditoria

### Verificações automáticas

- [ ] Comando X para validar Y

### Verificações manuais

- [ ] Inspeção visual de Z

## 8. Checklists aplicáveis

- [ ] `docs/rup/99-anexos/checklists/001-*.md`
- [ ] `docs/rup/99-anexos/checklists/005-*.md`
```

## Referências

- `AGENTS.md` → seção "Padrão obrigatório para planos de mudança"
- `docs/rup/99-anexos/MVP/plan-micro-agents.md` → exemplo de referência
- `docs/rup/99-anexos/planos/` → diretório de planos
- `docs/rup/99-anexos/checklists/` → checklists disponíveis
