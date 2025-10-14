<!-- README.md -->

# Add Header CI

Automação para garantir que todos os arquivos de um repositório contenham o **caminho relativo** no topo.

## 🎯 Objetivo

Manter rastreabilidade e conformidade padronizada em todos os projetos, garantindo que cada arquivo possua o comentário de caminho correto (por exemplo:  
`// src/app/main.ts` ou `<!-- docs/index.md -->`).

## ⚙️ Funcionamento

- Executa automaticamente em **pull requests prontos para merge** contra a branch principal.  
- Processa **somente os arquivos modificados** no PR.  
- Usa o modelo `deepseek-coder` via **OpenRouter**, identificado pela chave `KEY_AGENT_RELATIVE_PATH`.  
- Respeita exceções listadas no arquivo `.addheader` (mesmo formato do `.gitignore`).  
- Insere o cabeçalho sem alterar o conteúdo restante do arquivo.  
- Faz *commit* e *push* direto na branch do PR quando necessário.

## 🧩 Estrutura

.github/workflows/add-header-pr.yml   # Workflow principal
tools/openrouter/add-headers-pr.ts    # Script executor
.addheader                            # Lista de exceções
package.json / tsconfig.json          # Configurações do projeto

## 🔐 Configuração

Defina os *secrets* e *variáveis* no repositório:

| Tipo | Nome | Descrição |
|------|------|------------|
| Secret | `KEY_AGENT_RELATIVE_PATH` | Token de acesso ao OpenRouter |
| Variable | `USE_OPENROUTER` | `true` para usar IA, `false` para modo offline |

## 🚀 Execução manual

```bash
npm run headers:pr

O comando ajusta cabeçalhos apenas nos arquivos modificados entre PR_BASE_SHA e PR_HEAD_SHA.

📜 Exemplo de exceções (.addheader)

node_modules/
dist/
coverage/
**/*.json
**/*.lock
**/*.png
**/*.jpg

🧾 Licença

MIT — uso livre e adaptável para qualquer repositório.

