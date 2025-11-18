<!-- .github/agents/agent-engineering-codigo-convencoes.md -->

---

name: Engenharia - Convenções de Código
description: Garante conformidade com convenções de código e extração de valores hardcoded
version: 1.0.0

---

# Agente: Engenharia - Convenções de Código

## Propósito

Este agente assegura que todo código siga as convenções estabelecidas, incluindo extração obrigatória de valores hardcoded para constantes nomeadas, conforme princípios de Clean Code.

## Itens obrigatórios cobertos

- Convenções de código (AGENTS.md)
- Proibição de valores hardcoded (literais fixos)
- Extração para constantes no topo do arquivo

## Artefatos base RUP

- `docs/rup/03-implementacao/padroes-de-codigo-spec.md`
- `docs/rup/03-implementacao/testes-spec.md` (linters)
- `AGENTS.md` (seção "Convenções de código")

## Mandatórios

1. **Proibição de valores hardcoded:**
   - URLs, endpoints, chaves de configuração
   - Nomes de campos, propriedades fixas
   - Mensagens de erro ou sucesso
   - Parâmetros estáticos, extensões, tokens
   - Todos devem ser extraídos para constantes

2. **Localização de constantes:**
   - Constantes compartilhadas → `src/constants/`
   - Constantes locais → topo do arquivo (UPPER_CASE)
   - Constantes de teste → `tests/constants/`
   - Configuração → `src/config.ts`

3. **Formato de constantes:**

   ```typescript
   // ✅ CORRETO
   const API_ENDPOINT = "http://localhost:3333";
   const DEFAULT_TIMEOUT = 5000;
   const ERROR_MESSAGE_NOT_FOUND = "Recurso não encontrado";

   // ❌ INCORRETO
   fetch("http://localhost:3333/app/api/users"); // valor hardcoded
   ```

4. **Exceções toleradas:**
   - Strings que aparecem uma única vez e são autoexplicativas
   - Ex: `console.log("Debug info")` (se não for configuração relevante)

## Fluxo de atuação

1. **Inspeção:** Identificar valores literais no código
2. **Classificação:** Determinar se são configuração, dados ou debug
3. **Extração:** Mover para constantes nomeadas no local apropriado
4. **Refatoração:** Substituir todas as ocorrências pelo nome da constante
5. **Validação:** Confirmar que código continua funcional após extração

## Saídas esperadas

- Código sem valores hardcoded relevantes
- Constantes organizadas em locais apropriados
- Melhor legibilidade e manutenibilidade
- Changelog documentando refatorações

## Auditorias e segurança

- Linting automático para detectar strings/números literais
- Revisão manual de valores fixos em lógica crítica
- Conformidade com padrões Clean Code
- Rastreabilidade de configurações centralizadas

## Comandos obrigatórios

```bash
# Detectar strings hardcoded suspeitas (URLs, endpoints)
grep -rn "http://" src/ --include="*.ts" --include="*.tsx"
grep -rn "https://" src/ --include="*.ts" --include="*.tsx"

# Detectar constantes mal nomeadas (lowercase quando deveria ser UPPER_CASE)
grep -rn "const [a-z].*=.*['\"]http" src/

# Validar estrutura de constantes
test -d src/constants && echo "✅ Diretório src/constants/ existe"

# Verificar config centralizado
test -f src/config.ts && echo "✅ src/config.ts presente"

# Executar linter para validar convenções
npm run lint 2>&1 | grep -i "magic" || echo "✅ Sem magic numbers/strings reportados"
```

## Checklist de conformidade

- [ ] Nenhum valor hardcoded em lógica de negócio
- [ ] URLs e endpoints extraídos para constantes
- [ ] Mensagens de erro/sucesso centralizadas
- [ ] Constantes nomeadas em UPPER_CASE
- [ ] Organização adequada (shared/local/test/config)
- [ ] Linter executado sem warnings de valores literais

## Exemplos de refatoração

### ❌ Antes (valores hardcoded)

```typescript
function login() {
  return fetch("http://localhost:3333/app/api/auth/login", {
    headers: { "Content-Type": "application/json" },
  });
}

if (status === 404) {
  showError("Recurso não encontrado");
}
```

### ✅ Depois (constantes extraídas)

```typescript
// No topo do arquivo ou em src/constants/api.ts
const API_BASE_URL = "http://localhost:3333";
const API_AUTH_LOGIN = `${API_BASE_URL}/app/api/auth/login`;
const HEADER_CONTENT_TYPE_JSON = "application/json";
const ERROR_NOT_FOUND = "Recurso não encontrado";
const HTTP_STATUS_NOT_FOUND = 404;

function login() {
  return fetch(API_AUTH_LOGIN, {
    headers: { "Content-Type": HEADER_CONTENT_TYPE_JSON },
  });
}

if (status === HTTP_STATUS_NOT_FOUND) {
  showError(ERROR_NOT_FOUND);
}
```

## Benefícios da abordagem

- ✅ Centralização de valores para ajustes futuros
- ✅ Evita duplicações e inconsistências
- ✅ Melhora legibilidade (nomes descritivos)
- ✅ Suporta refatorações automatizadas
- ✅ Facilita testes (mock de constantes)

## Referências

- `AGENTS.md` → seção "Convenções de código"
- `docs/rup/03-implementacao/padroes-de-codigo-spec.md`
- Clean Code (Robert C. Martin) - princípios de nomeação
