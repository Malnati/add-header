<!-- .github/agents/agent-engineering-no-aesthetic-changes.md -->

---

name: Engenharia - Proibição de Alterações Estéticas
description: Impede alterações puramente estéticas não solicitadas, delegando formatação a ferramentas
version: 1.0.0

---

# Agente: Engenharia - Proibição de Alterações Estéticas

## Propósito

Este agente garante que alterações puramente estéticas (formatação, espaços, comentários não técnicos) sejam evitadas, delegando formatação a ferramentas apropriadas (Prettier, ESLint) e mantendo foco em mudanças funcionais.

## Itens obrigatórios cobertos

- Proibição de alterações estéticas não solicitadas (AGENTS.md)
- Delegação de formatação a ferramentas (Prettier, ESLint)
- Foco exclusivo em mudanças funcionais

## Artefatos base RUP

- `AGENTS.md` (seção "Proibição de alterações estéticas não solicitadas")
- `docs/rup/06-governanca-tecnica-e-controle-de-qualidade/revisoes-com-ia-spec.md`
- Configurações de lint: `.eslintrc`, `.prettierrc`, `tsconfig.json`

## Mandatórios

1. **Alterações estéticas proibidas:**
   - Adicionar/remover comentários explicativos não técnicos
   - Adicionar/remover espaços, quebras de linha, linhas vazias
   - Reformatar indentação ou alinhamento
   - Reorganizar imports sem mudança funcional
   - Adicionar cabeçalhos de caminho em arquivos que não os possuem (exceto quando exigido)

2. **Formatação é responsabilidade de ferramentas:**
   - Prettier para formatação de código
   - ESLint para correções de lint
   - EditorConfig para consistência de editores
   - Não fazer manualmente o que ferramentas fazem automaticamente

3. **Exceções permitidas:**
   - Alteração estética tecnicamente necessária (corrigir sintaxe)
   - Explicitamente solicitado no escopo da tarefa
   - Configuração de nova ferramenta de linting/formatação
   - Correção de erro de formatação que quebra funcionalidade

4. **Para agentes de IA:**
   - Focar exclusivamente em mudanças funcionais
   - Não "melhorar" aparência do código
   - Não adicionar comentários "úteis" não solicitados
   - Deixar formatação para ferramentas

## Fluxo de atuação

1. **Identificação:** Determinar se mudança é funcional ou estética
2. **Validação:** Confirmar se estética está no escopo da tarefa
3. **Bloqueio:** Impedir mudanças estéticas não justificadas
4. **Delegação:** Orientar uso de Prettier/ESLint para formatação
5. **Registro:** Documentar apenas mudanças funcionais no changelog

## Saídas esperadas

- Código alterado apenas funcionalmente
- Nenhuma mudança de formatação manual
- Orientação para executar Prettier/ESLint se necessário
- Changelog focado em mudanças funcionais

## Auditorias e segurança

- Revisão de diff para detectar mudanças estéticas
- Validação de que formatação automática não foi sobrescrita
- Conformidade com diretrizes de simplicidade visual
- Rastreabilidade apenas de mudanças funcionais

## Comandos obrigatórios

```bash
# Executar formatação automática (Prettier)
npm run format

# Executar lint automático (ESLint)
npm run lint --fix

# Verificar diff focado em mudanças funcionais
git diff --ignore-space-change --ignore-blank-lines

# Detectar mudanças apenas de formatação (suspeitas)
git diff --ignore-all-space | wc -l
# Se resultado for 0, todas as mudanças são estéticas (suspeito)
```

## Checklist de validação

- [ ] Mudanças são exclusivamente funcionais (não estéticas)
- [ ] Nenhum comentário não técnico adicionado
- [ ] Formatação delegada a ferramentas (Prettier/ESLint)
- [ ] Diff focado em lógica, não em espaços/quebras
- [ ] Changelog documenta apenas mudanças funcionais

## Exemplos de mudanças proibidas

### ❌ Proibido: Adicionar comentários explicativos

```typescript
// Antes
const user = getUser();

// Depois (PROIBIDO sem solicitação)
// Obtém os dados do usuário atual do sistema
const user = getUser();
```

### ❌ Proibido: Reformatar espaços/quebras

```typescript
// Antes
function login(email, password) {
  return auth(email, password);
}

// Depois (PROIBIDO - usar Prettier)
function login(email, password) {
  return auth(email, password);
}
```

### ❌ Proibido: Adicionar cabeçalhos de caminho

```typescript
// Antes
export class UserService {}

// Depois (PROIBIDO sem ser nova funcionalidade)
// src/services/user.service.ts
export class UserService {}
```

### ✅ Permitido: Correção técnica necessária

```typescript
// Antes (sintaxe incorreta)
const data = { name "John" };

// Depois (correção funcional)
const data = { name: "John" };
```

## Referências

- `AGENTS.md` → seção "Proibição de alterações estéticas não solicitadas"
- `docs/rup/06-governanca-tecnica-e-controle-de-qualidade/revisoes-com-ia-spec.md`
- Prettier documentation: https://prettier.io/
- ESLint documentation: https://eslint.org/
