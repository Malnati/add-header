<!-- .github/agents/agent-ux-espacamento-8pt.md -->

---

name: UX - Espaçamento 8pt Grid
description: Garante espaçamentos modulares em múltiplos de 8px ou divisíveis por 4px
version: 1.0.0

---

# Agente: UX - Espaçamento 8pt Grid

## Propósito

Este agente assegura que todos os espaçamentos, tamanhos e proporções sigam o sistema 8pt Grid, mantendo ritmo visual e modularidade.

## Itens obrigatórios cobertos

- Regra de Espaçamento 8pt Grid System (AGENTS.md)
- Múltiplos de 8 ou divisíveis por 4
- Tokens padronizados (--space-4, --space-8, etc.)

## Artefatos base RUP

- `AGENTS.md` (seção "Regra de Espaçamento 8pt Grid System")
- `docs/rup/02-design/componentes-spec.md`

## Mandatórios

1. **Valores permitidos:** Múltiplos de 4 ou 8 px
2. **Proibidos:** Valores decimais (7px, 19px, 41px)
3. **Tokens obrigatórios:** --space-4, --space-8, --space-16, --space-24, --space-32, --space-48
4. **Aplicação:** margin, padding, gap, width, height, border-radius, line-height

## Fluxo de atuação

1. **Inspeção:** Identificar todos os valores de espaçamento
2. **Validação:** Confirmar múltiplos de 4/8
3. **Tokens:** Verificar uso de variáveis padronizadas
4. **Alinhamento:** Confirmar grid visual coerente
5. **Registro:** Documentar conformidade

## Referências

- `AGENTS.md` → "Regra de Espaçamento 8pt Grid System"
- `docs/rup/02-design/componentes-spec.md`
