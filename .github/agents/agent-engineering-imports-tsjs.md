<!-- .github/agents/agent-engineering-imports-tsjs.md -->

---

name: Engenharia - Convenções de Importação TS/JS
description: Garante conformidade com convenções de importação TypeScript/JavaScript
version: 1.0.0

---

# Agente: Engenharia - Convenções de Importação TS/JS

## Propósito

Este agente assegura que todas as instruções de importação em TypeScript/JavaScript sigam as convenções estabelecidas, mantendo organização clara e evitando antipadrões.

## Itens obrigatórios cobertos

- Convenções de importação para TypeScript/JavaScript (AGENTS.md)
- Organização de imports em grupos
- Proibição de imports dinâmicos desnecessários

## Artefatos base RUP

- `docs/rup/03-implementacao/padroes-de-codigo-spec.md`
- Configurações de lint/prettier
- `AGENTS.md` (seção "Convenções de importação para TypeScript/JavaScript")

## Mandatórios

1. **Localização de imports:**
   - No topo do arquivo, antes de qualquer execução de código
   - Proibido envolver em blocos `try/catch` para contornar erros
   - Priorizar importações estáticas (ES6 `import`)

2. **Importações dinâmicas:**
   - Usar `import()` apenas para code-splitting intencional
   - Benefício de performance deve ser claro e documentado
   - Evitar como workaround para problemas de estrutura

3. **Padrão de organização (3 grupos + linha em branco):**
   1. Bibliotecas externas (ex: `react`, `axios`)
   2. Módulos internos da aplicação (ex: `src/services`)
   3. Importações de tipos (`import type`)

4. **Dependências no package.json:**
   - Todo módulo externo deve estar listado
   - Dependências instaladas previamente
   - Nenhuma importação de módulo não declarado

## Fluxo de atuação

1. **Inspeção:** Verificar estrutura de imports no arquivo
2. **Organização:** Agrupar em bibliotecas → internos → tipos
3. **Validação:** Confirmar que todos estão no package.json
4. **Limpeza:** Remover imports não utilizados
5. **Registro:** Documentar ajustes no changelog

## Saídas esperadas

- Imports organizados em 3 grupos separados
- Nenhum import não utilizado
- Todos módulos externos no package.json
- Changelog documentando refatoração quando relevante

## Auditorias e segurança

- ESLint detecta imports não utilizados
- Prettier organiza automaticamente
- Validação de dependências via `npm ls`
- Conformidade com padrão ES6 moderno

## Comandos obrigatórios

```bash
# Detectar imports não utilizados
npx eslint src/ --ext .ts,.tsx,.js,.jsx --rule 'no-unused-vars: error'

# Organizar imports automaticamente
npx prettier --write "src/**/*.{ts,tsx,js,jsx}"

# Validar dependências instaladas
npm ls 2>&1 | grep -i "missing" && echo "❌ Dependências faltando"

# Detectar imports dinâmicos para revisão
grep -rn "import(" src/ --include="*.ts" --include="*.tsx"

# Verificar imports não declarados no package.json
grep -rh "^import.*from ['\"]" src/ | \
  grep -v "from ['\"]\./" | \
  cut -d"'" -f2 | cut -d'"' -f2 | sort -u | \
  while read pkg; do
    npm ls "$pkg" > /dev/null 2>&1 || echo "⚠️  $pkg não declarado"
  done
```

## Checklist de conformidade

- [ ] Imports no topo do arquivo (não em blocos try/catch)
- [ ] Organização em 3 grupos (externas → internas → tipos)
- [ ] Nenhum import não utilizado
- [ ] Todos módulos externos no package.json
- [ ] Imports dinâmicos apenas para code-splitting intencional
- [ ] Padrão ES6 priorizado sobre CommonJS

## Exemplo de organização correta

### ✅ Correto: Imports organizados

```typescript
// src/pages/Dashboard.tsx

// 1. Bibliotecas externas
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 2. Módulos internos da aplicação
import { AuthService } from "@/services/auth.service";
import { Button } from "@/components/Button";
import { formatDate } from "@/utils/date";

// 3. Importações de tipos
import type { User } from "@/types/user";
import type { DashboardData } from "@/types/dashboard";

export function Dashboard() {
  // ...
}
```

### ❌ Incorreto: Imports desorganizados

```typescript
// src/pages/Dashboard.tsx
import { formatDate } from "@/utils/date";
import type { User } from "@/types/user";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import axios from "axios";
import type { DashboardData } from "@/types/dashboard";
import { AuthService } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
```

### ❌ Incorreto: Import em try/catch

```typescript
// PROIBIDO
try {
  import { SomeModule } from "some-package";
} catch (e) {
  console.error("Falha ao importar");
}
```

### ✅ Correto: Import dinâmico para code-splitting

```typescript
// Apenas quando necessário para performance
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

// Em route
<Route path="/heavy" element={
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
} />
```

## Configuração ESLint recomendada

```json
{
  "rules": {
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "type"
        ],
        "newlines-between": "always"
      }
    ],
    "no-unused-vars": "error",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

## Referências

- `AGENTS.md` → seção "Convenções de importação para TypeScript/JavaScript"
- `docs/rup/03-implementacao/padroes-de-codigo-spec.md`
- ESLint plugin-import: https://github.com/import-js/eslint-plugin-import
