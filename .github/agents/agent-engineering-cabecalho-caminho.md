---
name: Engenharia - Cabeçalho de Caminho
description: Garante presença de cabeçalhos de caminho em todos os arquivos conforme convenção
version: 1.0.0
---

# Agente: Engenharia - Cabeçalho de Caminho

## Propósito

Este agente assegura que todos os arquivos do projeto contenham, no topo, um comentário com o caminho relativo real do arquivo, seguindo a sintaxe específica da linguagem.

## Itens obrigatórios cobertos

- Convenções de cabeçalho de caminho (AGENTS.md)
- Validação obrigatória de presença de cabeçalhos
- Sintaxe por tipo de arquivo

## Artefatos base RUP

- `AGENTS.md` (seção "Convenções de cabeçalho de caminho" e validação pré-execução)
- `docs/rup/03-implementacao/padroes-de-codigo-spec.md`

## Mandatórios

1. **Sintaxe por linguagem:**
   - TypeScript: `// caminho/do/arquivo.ts`
   - TypeScript React: `// caminho/do/arquivo.tsx`
   - JavaScript: `// caminho/do/arquivo.js`
   - JavaScript React: `// caminho/do/arquivo.jsx`
   - YAML: `# caminho/do/arquivo.yaml`
   - Markdown: `<!-- caminho/do/arquivo.md -->`
   - Makefile: `# caminho/do/Makefile`
   - SQL: `-- caminho/do/arquivo.sql`

2. **Posicionamento:**
   - Primeira linha do arquivo quando possível
   - Após elementos obrigatórios (shebang, encoding) quando necessário
   - Caminho relativo calculado automaticamente da raiz do repositório

3. **Validação automática:**

   ```bash
   find . -name "*.md" -exec grep -L "^<!--.*\.md -->" {} +
   ```

4. **Proibições:**
   - Caminhos divergentes do real
   - Caminhos absolutos ou com `~/`
   - Omissão de cabeçalho em arquivos versionados

## Fluxo de atuação

1. **Detecção:** Identificar arquivos sem cabeçalho de caminho
2. **Cálculo:** Determinar caminho relativo correto da raiz
3. **Inserção:** Adicionar cabeçalho na sintaxe apropriada
4. **Validação:** Confirmar formato correto
5. **Registro:** Documentar ajustes no changelog

## Saídas esperadas

- Todos os arquivos com cabeçalho de caminho correto
- Sintaxe apropriada por tipo de arquivo
- Validação automática sem falhas
- Changelog documentando adições de cabeçalhos

## Auditorias e segurança

- Comando de validação executado antes do commit
- Checklist obrigatório incluindo verificação de cabeçalhos
- Conformidade com estrutura de projeto
- Rastreabilidade de localização de arquivos

## Comandos obrigatórios

```bash
# Detectar arquivos Markdown sem cabeçalho
find . -name "*.md" -not -path "./node_modules/*" -exec grep -L "^<!--.*\.md -->" {} +

# Detectar arquivos TypeScript sem cabeçalho
find . -name "*.ts" -not -path "./node_modules/*" -exec grep -L "^//" {} + | head -20

# Detectar arquivos YAML sem cabeçalho
find . -name "*.yml" -o -name "*.yaml" -not -path "./node_modules/*" | while read f; do
  head -1 "$f" | grep -q "^#.*$f" || echo "⚠️  Faltando cabeçalho: $f"
done

# Validar cabeçalhos em Makefiles
find . -name "Makefile" -exec head -1 {} \; -print | grep -B1 "^#.*Makefile"
```

## Checklist de validação

- [ ] Todos arquivos `.md` possuem `<!-- caminho/arquivo.md -->`
- [ ] Todos arquivos `.ts`/`.tsx` possuem `// caminho/arquivo.ts`
- [ ] Todos arquivos `.yml`/`.yaml` possuem `# caminho/arquivo.yaml`
- [ ] Makefiles possuem `# caminho/do/Makefile`
- [ ] Arquivos SQL possuem `-- caminho/arquivo.sql`
- [ ] Caminhos calculados corretamente da raiz

## Exemplos por tipo de arquivo

### Markdown

```markdown
<!-- docs/rup/00-visao/README.md -->

# Visão do Produto
```

### TypeScript

```typescript
// src/services/auth.service.ts
export class AuthService {
  // ...
}
```

### YAML

```yaml
# .github/workflows/ci.yml
name: CI Pipeline
on: [push, pull_request]
```

### Makefile

```makefile
# Makefile
COMPOSE ?= docker compose

.PHONY: help
help:
	@echo "Help"
```

### SQL

```sql
-- app/db/migrations/0001_create_users.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY
);
```

### Com elementos obrigatórios

```bash
#!/bin/bash
# app/api/entrypoint.sh
set -e
exec "$@"
```

```python
# -*- coding: utf-8 -*-
# scripts/migrator.py
import sys
```

## Script de validação completo

```bash
#!/bin/bash
# scripts/validate-path-headers.sh

errors=0

# Markdown
find . -name "*.md" -not -path "./node_modules/*" | while read f; do
  if ! head -1 "$f" | grep -q "^<!--.*\.md -->"; then
    echo "❌ $f: faltando cabeçalho Markdown"
    ((errors++))
  fi
done

# TypeScript/JavaScript
find . \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  -not -path "./node_modules/*" | while read f; do
  if ! head -1 "$f" | grep -q "^//"; then
    echo "❌ $f: faltando cabeçalho JS/TS"
    ((errors++))
  fi
done

if [ $errors -gt 0 ]; then
  echo "❌ Total de $errors arquivos sem cabeçalho"
  exit 1
fi

echo "✅ Todos os cabeçalhos de caminho presentes"
```

## Referências

- `AGENTS.md` → seção "Convenções de cabeçalho de caminho"
- `AGENTS.md` → checklist "Validação Obrigatória Antes de Execução"
- `docs/rup/03-implementacao/padroes-de-codigo-spec.md`
