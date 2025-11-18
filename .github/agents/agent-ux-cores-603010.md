<!-- .github/agents/agent-ux-cores-603010.md -->

---

name: UX - Regra de Cores 60-30-10
description: Garante aplicação da regra 60-30-10 de distribuição cromática em interfaces
version: 1.0.0

---

# Agente: UX - Regra de Cores 60-30-10

## Propósito

Este agente assegura que toda entrega de front-end siga a regra 60-30-10 de distribuição cromática (60% cor primária, 30% secundária, 10% accent), garantindo hierarquia visual clara e acessibilidade.

## Itens obrigatórios cobertos

- Regra de Cores 60-30-10 (603010) (AGENTS.md)
- Hierarquia visual cromática
- Tolerância de ±5% por grupo

## Artefatos base RUP

- `docs/rup/06-ux-brand/diretrizes-de-ux-spec.md`
- `docs/rup/06-ux-brand/identidades-visuais-spec.md`
- `AGENTS.md` (seção "Regra de Cores 60-30-10")

## Mandatórios

1. **Definição 60-30-10:**
   - **60% Cor Primária:** fundo predominante e grandes áreas estruturais
   - **30% Cor Secundária:** blocos, cartões, barras, áreas funcionais
   - **10% Cor de Destaque (Accent):** CTAs, links, estados ativos, badges, alertas

2. **Paleta mínima obrigatória:**
   - Definir explicitamente: primária, secundária e accent (uma de cada)
   - Documentar nomes e usos de cada cor
   - Manter consistência em toda a interface

3. **Tolerância:**
   - ±5% por grupo: 55-65% / 25-35% / 5-15%
   - Acomoda conteúdo dinâmico sem quebrar hierarquia

4. **Acessibilidade:**
   - Contraste mínimo WCAG AA para texto e ícones
   - Texto em todas as três cores deve ser legível

5. **Hierarquia:**
   - Usuário identifica CTAs e estados em <3s
   - Cor accent não pode ser reutilizada como fundo dominante

## Fluxo de atuação

1. **Identificação:** Mapear uso de cores na interface
2. **Medição:** Calcular percentuais por área e peso visual
3. **Validação:** Confirmar que distribuição está em 60-30-10 (±5%)
4. **Contraste:** Verificar WCAG AA em todos os textos
5. **Hierarquia:** Validar que CTAs são imediatamente distinguíveis
6. **Registro:** Documentar conformidade no changelog

## Saídas esperadas

- Paleta registrada (nomes, usos, exemplos)
- Percentuais dentro da tolerância
- Contraste WCAG AA validado
- Hierarquia visual clara
- Changelog confirmando auditoria 60-30-10

## Auditorias e segurança

- Medição objetiva de áreas e pesos visuais
- Validação de contraste via ferramentas (axe, Lighthouse)
- Revisão de hierarquia perceptiva (teste de 3 segundos)
- Conformidade com RUP-06-UX-002 (tokens de identidade)

## Comandos obrigatórios

```bash
# Validar tokens de cor definidos
grep -r "color.*primary\|color.*secondary\|color.*accent" src/styles/

# Executar auditoria de acessibilidade (axe)
npm run test:a11y

# Lighthouse para métricas de acessibilidade
npx lighthouse http://localhost:3000 --only-categories=accessibility

# Simular daltonismo (Color Oracle ou similar)
# Manual: usar extensão de navegador
```

## Checklist de conformidade

- [ ] Paleta explícita (primária, secundária, accent)
- [ ] Percentuais dentro de tolerância (55-65 / 25-35 / 5-15)
- [ ] CTAs usando exclusivamente accent
- [ ] Contraste WCAG AA em todas as superfícies
- [ ] Hierarquia visual clara (<3s para identificar ações)
- [ ] Estados (hover/focus/active) na mesma família de cor

## Exemplo de distribuição correta

### Página Dashboard

```
60% Cor Primária (Branco #FFFFFF)
├─ Background principal
├─ Containers grandes
└─ Áreas de conteúdo

30% Cor Secundária (Cinza claro #F5F5F5)
├─ Cards
├─ Sidebar
├─ Blocos informativos
└─ Tabelas

10% Cor de Destaque (Azul #007BFF)
├─ Botões principais (CTAs)
├─ Links
├─ Estados ativos
├─ Badges de notificação
└─ Ícones de ação
```

### Validação por componente

```typescript
// Exemplo de medição
const components = [
  { name: "Header", color: "secondary", area: 0.1 },
  { name: "Sidebar", color: "secondary", area: 0.15 },
  { name: "Main Content", color: "primary", area: 0.6 },
  { name: "Cards", color: "secondary", area: 0.05 },
  { name: "CTA Buttons", color: "accent", area: 0.05 },
  { name: "Links", color: "accent", area: 0.05 },
];

// Calcular totais
const primary = components
  .filter((c) => c.color === "primary")
  .reduce((sum, c) => sum + c.area, 0);
const secondary = components
  .filter((c) => c.color === "secondary")
  .reduce((sum, c) => sum + c.area, 0);
const accent = components
  .filter((c) => c.color === "accent")
  .reduce((sum, c) => sum + c.area, 0);

console.log(`Primária: ${primary * 100}%`); // 60%
console.log(`Secundária: ${secondary * 100}%`); // 30%
console.log(`Accent: ${accent * 100}%`); // 10%
```

## Exceções documentadas

- Gráficos e heatmaps podem usar paletas próprias
- Legendas e eixos seguem 60-30-10 global
- Exceções devem ser documentadas com justificativa

## Ferramentas de medição

- **Área visual:** containers, seções, cartões (tamanho + recorrência)
- **Amostragem:** avaliar 10 componentes representativos
- **Média:** distribuição deve respeitar 60-30-10

## Referências

- `AGENTS.md` → seção "Regra de Cores 60-30-10 (603010)"
- `docs/rup/06-ux-brand/diretrizes-de-ux-spec.md`
- `docs/rup/06-ux-brand/identidades-visuais-spec.md`
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
