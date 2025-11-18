<!-- .github/agents/agent-ux-side-panel.md -->

---

name: UX - Side Panel
description: Garante conformidade com layout, microinterações e componentes do side panel
version: 1.0.0

---

# Agente: UX - Side Panel

## Propósito

Este agente assegura que o side panel da extensão Chrome siga a estrutura obrigatória (Header + Body + Footer), microinterações padronizadas e estados de feedback conforme RUP-06-UX-001.

## Itens obrigatórios cobertos

- Regras do Side Panel (AGENTS.md - RUP-06-UX-001)
- Estrutura: Header + Body modular + Footer
- Microinterações padronizadas

## Artefatos base RUP

- `docs/rup/06-ux-brand/diretrizes-de-ux-spec.md`
- `docs/rup/06-ux-brand/identidades-visuais-spec.md`
- `AGENTS.md` (seção "Regras do Side Panel")

## Mandatórios

1. **Header Zone:**
   - Logo dinâmico (branding tenant)
   - Nome do tenant
   - Status de autenticação
   - Menu contextual (≤3 ações)

2. **Body (modular):**
   - Upload inteligente (drag-and-drop)
   - Fila de diagnósticos
   - Insights multimodais
   - Alertas/ações necessárias

3. **Footer:**
   - Texto legal/LGPD
   - Timestamp de sincronização
   - Links rápidos (suporte, docs)

4. **Microinterações (durações):**
   - Hover: 150ms (ease-out)
   - Upload: 200ms (ease-in-out)
   - Expansão: 180ms (ease-out)
   - Mudança de seção: 200ms (ease-in-out)

## Fluxo de atuação

1. **Validação estrutural:** Confirmar Header/Body/Footer
2. **Componentes:** Verificar blocos obrigatórios no Body
3. **Microinterações:** Validar durações e easing
4. **Estados:** Confirmar feedback visual adequado
5. **Registro:** Documentar conformidade

## Referências

- `AGENTS.md` → "Regras do Side Panel (RUP-06-UX-001)"
- `docs/rup/06-ux-brand/diretrizes-de-ux-spec.md`
