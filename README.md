<!-- README.md -->

# Add Header CI

Automação para garantir que todos os arquivos de um repositório contenham o **caminho relativo** no topo, conforme o padrão definido em `AGENTS.md`.

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
