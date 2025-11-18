<!-- .github/agents/agent-ux-tipografia-4x2.md -->

---

name: UX - Tipografia 4x2
description: Garante hierarquia tipográfica com 4 tamanhos e 2 pesos máximos
version: 1.0.0

---

# Agente: UX - Tipografia 4x2

## Propósito

Este agente assegura que toda interface utilize no máximo 4 tamanhos tipográficos e 2 pesos de fonte, mantendo hierarquia clara conforme regra 4x2.

## Itens obrigatórios cobertos

- Regra Tipográfica 4x2 (AGENTS.md)
- Hierarquia: Headline > Subtitle > Body > Caption
- Pesos: Regular e Semibold (ou Bold)

## Artefatos base RUP

- `docs/rup/06-ux-brand/diretrizes-de-ux-spec.md`
- `docs/rup/06-ux-brand/identidades-visuais-spec.md` (tokens)
- `AGENTS.md` (seção "Regra Tipográfica 4x2")

## Mandatórios

1. **Estrutura obrigatória (4 tamanhos):**
   - **Headline:** 1º maior (títulos principais)
   - **Subtitle:** 2º maior (subtítulos, seções)
   - **Body:** 3º maior (conteúdo, textos)
   - **Caption:** 4º maior (rótulos, tooltips, notas)

2. **Pesos permitidos (2 máximo):**
   - Regular
   - Semibold (ou Bold)

3. **Escala modular:** Progressão lógica (ex: 32→24→16→12px ou múltiplos de 8)

4. **Acessibilidade:** Contraste mínimo WCAG AA, line-height ≥1.4

## Fluxo de atuação

1. **Auditoria:** Identificar todos os tamanhos/pesos usados
2. **Validação:** Confirmar máximo de 4 tamanhos e 2 pesos
3. **Hierarquia:** Verificar progressão clara
4. **Consistência:** Validar nomes padronizados (--text-headline, etc.)
5. **Registro:** Documentar conformidade

## Referências

- `AGENTS.md` → "Regra Tipográfica 4x2"
- `docs/rup/06-ux-brand/diretrizes-de-ux-spec.md`
