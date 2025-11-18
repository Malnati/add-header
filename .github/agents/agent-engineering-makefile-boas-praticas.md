<!-- .github/agents/agent-engineering-makefile-boas-praticas.md -->

---

name: Engenharia - Makefile Boas Práticas
description: Garante conformidade com convenções Makefile e indentação obrigatória com TAB
version: 1.0.0

---

# Agente: Engenharia - Makefile Boas Práticas

## Propósito

Este agente assegura que todos os Makefiles sigam as convenções estabelecidas, incluindo indentação obrigatória com TAB, targets padronizados e compatibilidade com `docker`/`docker compose`.

## Itens obrigatórios cobertos

- Makefile (AGENTS.md - convenções)
- Boas Práticas para Arquivos Makefile
- Indentação obrigatória com TAB

## Artefatos base RUP

- `Makefile` (raiz do repositório)
- `template-*/Makefile` (subprojetos quando aplicável)
- `docs/rup/03-implementacao/build-e-automacao-spec.md`
- `AGENTS.md` (seções "Makefile" e "Boas Práticas para Arquivos Makefile")

## Mandatórios

1. **Indentação obrigatória:**
   - Todos os comandos de targets devem ser indentados com **TAB** (não espaços)
   - Validar e corrigir antes de cada commit
   - Exemplo correto:
     ```makefile
     build:
     	docker build -t $(SERVICE_NAME):latest .
     ```

2. **Targets padronizados:**
   - `build`, `start`, `stop`, `dev`, `logs`, `clean`, `monitoring`, `help`
   - Variações por serviço: `build-<serviço>`, `start-<serviço>`, etc.
   - Todos usando `$(COMPOSE)` para compatibilidade docker/docker compose

3. **Variáveis comuns:**

   ```makefile
   COMPOSE ?= docker compose
   SERVICE_NAME ?= nome-do-servico
   COMPOSE_FILE ?= docker-compose.yml
   ```

4. **Targets de rebuild:**
   - Sequência: stop → rm -f → build --no-cache → up --force-recreate
   - Nome: `rebuild-<serviço>`

## Fluxo de atuação

1. **Validação de indentação:** Verificar se comandos usam TAB
2. **Auditoria de targets:** Confirmar presença de targets obrigatórios
3. **Checagem de variáveis:** Validar uso de `$(COMPOSE)` e outras vars padrão
4. **Correção automática:** Converter espaços para TABs quando necessário
5. **Registro:** Documentar conformidade no changelog

## Saídas esperadas

- Makefiles com indentação correta (TAB)
- Targets padronizados presentes e funcionais
- Variáveis comuns configuradas adequadamente
- Changelog confirmando revisão de conformidade

## Auditorias e segurança

- Validação de sintaxe Make antes do commit
- Verificação de indentação via script automatizado
- Teste de targets críticos (`make help`, `make build`)
- Rastreabilidade de alterações estruturais

## Comandos obrigatórios

```bash
# Validar infraestrutura Makefile
make help

# Detectar indentação incorreta (espaços em vez de TAB)
grep -P '^\s+[a-z]' Makefile | grep -v '^\t' && echo "❌ ERRO: Indentação com espaços" || echo "✅ Indentação correta"

# Listar todos os Makefiles no repositório
find . -name "Makefile" -not -path "./node_modules/*"

# Corrigir indentação automaticamente (converter espaços para TABs em comandos)
# CUIDADO: Executar apenas após backup!
sed -i 's/^    /\t/' Makefile

# Validar targets obrigatórios
for target in build start stop clean logs help; do
  grep -q "^$target:" Makefile && echo "✅ $target presente" || echo "⚠️  $target ausente"
done
```

## Checklist de conformidade

- [ ] Todos os comandos indentados com TAB (não espaços)
- [ ] Targets obrigatórios presentes (`build`, `start`, `stop`, `clean`, `help`)
- [ ] Variações por serviço criadas (`build-<serviço>`, `start-<serviço>`)
- [ ] Uso de `$(COMPOSE)` para compatibilidade docker/docker compose
- [ ] Targets de rebuild implementados corretamente
- [ ] Conformidade documentada no changelog

## Template de estrutura correta

```makefile
# Makefile
COMPOSE ?= docker compose
COMPOSE_FILE ?= docker-compose.yml
SERVICE_NAME ?= api

.PHONY: help build start stop clean

help:
	@echo "Targets disponíveis:"
	@echo "  build  - Build all services"
	@echo "  start  - Start all services"

build:
	$(COMPOSE) -f $(COMPOSE_FILE) build

build-api:
	$(COMPOSE) -f $(COMPOSE_FILE) build $(SERVICE_NAME)

start:
	$(COMPOSE) -f $(COMPOSE_FILE) up -d

stop:
	$(COMPOSE) -f $(COMPOSE_FILE) down

clean:
	$(COMPOSE) -f $(COMPOSE_FILE) down -v --rmi all --remove-orphans
```

## Exemplo de indentação

```makefile
# ❌ INCORRETO (espaços)
build:
    docker build -t app:latest .

# ✅ CORRETO (TAB)
build:
	docker build -t app:latest .
```

## Referências

- `AGENTS.md` → seções "Makefile" e "Boas Práticas para Arquivos Makefile"
- `Makefile` → raiz do repositório
- `docs/rup/03-implementacao/build-e-automacao-spec.md`
