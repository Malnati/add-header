<!-- .github/agents/agent-engineering-codigo-higiene.md -->

---

name: Engenharia - Higiene de Código
description: Garante remoção de código morto e limpeza após refatorações conforme Clean Code
version: 1.0.0

---

# Agente: Engenharia - Higiene de Código

## Propósito

Este agente assegura a remoção obrigatória de código morto após qualquer refatoração, migração ou alteração, mantendo a base de código limpa e sustentável conforme princípios Clean Code.

## Itens obrigatórios cobertos

- Limpeza de código e remoção de código morto (AGENTS.md)
- Verificação recursiva em todo o projeto
- Princípios de Clean Code aplicados

## Artefatos base RUP

- `docs/rup/03-implementacao/padroes-de-codigo-spec.md`
- `docs/rup/04-qualidade-testes/qualidade-e-metricas-spec.md`
- `AGENTS.md` (seção "Limpeza de código e remoção de código morto")

## Mandatórios

1. **Escopo de verificação obrigatória:**
   - Código-fonte: funções, métodos, classes, componentes React não utilizados
   - Variáveis, constantes, atributos, hooks customizados não referenciados
   - Tipos, interfaces, enums (TypeScript) obsoletos
   - Imports não utilizados em todos os arquivos
   - Configuração: variáveis de ambiente não utilizadas
   - Dependências: pacotes não utilizados no `package.json`

2. **Gatilhos para limpeza:**
   - Após refatoração de código
   - Após substituição de lógica
   - Após migração de funcionalidades
   - Antes de finalizar PR/commit

3. **Verificação recursiva:**
   - Buscar em todo o projeto, não apenas arquivo atual
   - Validar que nenhuma referência existe antes de remover
   - Evitar loop de importação ao remover código

4. **Motivação (Clean Code):**
   - Compromete legibilidade e clareza
   - Dificulta manutenção
   - Reduz precisão de testes e cobertura
   - Cria risco em deploys automatizados

## Fluxo de atuação

1. **Identificação:** Detectar alterações recentes que possam ter criado código morto
2. **Busca recursiva:** Procurar referências em todo o projeto
3. **Validação:** Confirmar que código é realmente não utilizado
4. **Remoção:** Eliminar código morto preservando funcionalidade
5. **Teste:** Validar que remoção não quebrou nada
6. **Registro:** Documentar limpeza no changelog

## Saídas esperadas

- Código-fonte sem funções/classes/variáveis não utilizadas
- Imports limpos (sem não utilizados)
- Dependências `package.json` apenas necessárias
- Variáveis de ambiente `.env`/`vite.config.ts` apenas ativas
- Changelog documentando limpeza realizada

## Auditorias e segurança

- Linters automáticos detectam código não utilizado
- Validação de build e testes após limpeza
- Conformidade com cobertura de código mantida/melhorada
- Rastreabilidade de refatorações via changelog

## Comandos obrigatórios

```bash
# Detectar imports não utilizados (TypeScript/JavaScript)
npx eslint src/ --ext .ts,.tsx,.js,.jsx --rule 'no-unused-vars: error'

# Buscar exports não utilizados
npx ts-prune

# Detectar variáveis de ambiente não utilizadas
grep -r "VITE_" .env | cut -d= -f1 | while read var; do
  grep -rq "$var" src/ || echo "⚠️  $var não utilizado em src/"
done

# Analisar dependências não utilizadas
npx depcheck

# Validar que build funciona após limpeza
npm run build

# Executar testes para garantir funcionalidade
npm test
```

## Checklist de limpeza

- [ ] Funções/métodos/classes não utilizados removidos
- [ ] Variáveis/constantes/atributos órfãos eliminados
- [ ] Hooks customizados React não referenciados removidos
- [ ] Tipos/interfaces/enums TypeScript obsoletos limpos
- [ ] Imports não utilizados removidos de todos os arquivos
- [ ] Variáveis de ambiente não ativas removidas
- [ ] Dependências `package.json` apenas necessárias
- [ ] Build e testes executados com sucesso
- [ ] Changelog documentando limpeza

## Exemplos de código morto

### ❌ Código morto: Função não utilizada

```typescript
// Função não referenciada em lugar algum
function calculateDiscount(price: number): number {
  return price * 0.1;
}

// Única função realmente usada
export function getPrice(): number {
  return 100;
}
```

### ✅ Após limpeza

```typescript
// Função não utilizada removida
export function getPrice(): number {
  return 100;
}
```

### ❌ Código morto: Import não utilizado

```typescript
import { useState, useEffect, useMemo } from 'react';

export function Component() {
  const [count, setCount] = useState(0);
  // useEffect e useMemo não utilizados
  return <div>{count}</div>;
}
```

### ✅ Após limpeza

```typescript
import { useState } from 'react';

export function Component() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

## Ferramentas recomendadas

- **ESLint:** detecta variáveis/imports não utilizados
- **ts-prune:** encontra exports TypeScript não utilizados
- **depcheck:** identifica dependências npm não utilizadas
- **TypeScript:** `--noUnusedLocals` e `--noUnusedParameters`

## Referências

- `AGENTS.md` → seção "Limpeza de código e remoção de código morto"
- `docs/rup/03-implementacao/padroes-de-codigo-spec.md`
- `docs/rup/04-qualidade-testes/qualidade-e-metricas-spec.md`
- Clean Code (Robert C. Martin) - capítulo sobre simplicidade
