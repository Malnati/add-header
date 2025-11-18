<!-- .github/agents/agent-release-chrome-web-store.md -->

---

name: Release - Chrome Web Store
description: Garante processo completo de submissão à Chrome Web Store
version: 1.0.0

---

# Agente: Release - Chrome Web Store

## Propósito

Este agente assegura conformidade com políticas da Chrome Web Store e execução completa do processo de submissão, incluindo empacotamento, validação, upload e monitoramento até publicação.

## Itens obrigatórios cobertos

- Submissão Chrome Web Store (AGENTS.md)
- Conformidade com políticas de marketplace
- Timeline de aprovação (1-7 dias úteis)

## Artefatos base RUP

- `docs/rup/05-entrega-e-implantacao/empacotamento-spec.md`
- `docs/rup/05-operacao-release/submissao-chrome-web-store-spec.md` (ou equivalente)
- `AGENTS.md` (seção "Submissão Chrome Web Store" e políticas)

## Mandatórios

1. **Empacotamento:**
   - Diretório fonte: `extension/dist/` (gerado por Vite)
   - Arquivos obrigatórios: `manifest.json`, assets `public/`, bundle JS/CSS
   - Formato: arquivo ZIP assinado
   - Validações: tamanho ≤10MB, permissões mínimas, conformidade MV3

2. **Políticas obrigatórias:**
   - Single Purpose Policy (propósito único e claro)
   - Permissões mínimas necessárias
   - Política de privacidade declarada e acessível
   - Descrição clara de funcionalidades
   - Conformidade com guidelines de segurança

3. **Processo de submissão:**
   - Upload manual via Chrome Web Store Developer Console
   - Seguir checklist publicado em `docs/rup/`
   - Review automático + aprovação editorial
   - Timeline: 1-7 dias úteis
   - Monitoramento até publicação definitiva

4. **Responsável:**
   - Conforme `docs/rup/06-governanca-tecnica-e-controle-de-qualidade/governanca-tecnica-spec.md`

## Fluxo de atuação

1. **Empacotamento:** Gerar ZIP do `extension/dist/`
2. **Validação:** Confirmar conformidade com políticas
3. **Upload:** Submeter via Developer Console
4. **Acompanhamento:** Monitorar review automático
5. **Publicação:** Confirmar disponibilidade na loja
6. **Registro:** Documentar submissão e resultado

## Saídas esperadas

- Arquivo ZIP válido e conforme
- Submissão registrada no Developer Console
- Monitoramento documentado até publicação
- Changelog com status de submissão
- Artefatos retidos (ZIP, logs, evidências)

## Auditorias e segurança

- Validação de conformidade com políticas
- Verificação de permissões mínimas
- Rastreabilidade ZIP ↔ tag ↔ commit
- Retenção de artefatos por 12 meses
- Conformidade LGPD na política de privacidade

## Comandos obrigatórios

```bash
# Gerar build de produção
cd extension && npm run build

# Validar estrutura do dist/
ls -la extension/dist/

# Criar ZIP (exemplo manual)
cd extension/dist && zip -r ../../extension-v1.2.0.zip .

# Validar tamanho do ZIP
ls -lh extension-v1.2.0.zip

# Verificar manifest.json
cat extension/dist/manifest.json | jq '.version, .permissions'
```

## Checklist de submissão

- [ ] Build de produção executado com sucesso
- [ ] Arquivo ZIP gerado (≤10MB)
- [ ] `manifest.json` com versão correta
- [ ] Permissões mínimas declaradas
- [ ] Política de privacidade acessível
- [ ] Descrição clara no Developer Console
- [ ] Screenshots/vídeo demo preparados
- [ ] Upload realizado via Developer Console
- [ ] Review automático aprovado
- [ ] Publicação confirmada na loja

## Políticas Chrome Web Store

### Requisitos principais

- **Single Purpose:** extensão com propósito único e claro
- **Permissões mínimas:** apenas as estritamente necessárias
- **Privacidade:** política declarada e acessível aos usuários
- **Transparência:** descrição clara de todas as funcionalidades
- **Segurança:** código ofuscado permitido, mas auditável

### Proibições

- Coleta não declarada de dados
- Modificação de páginas sem consentimento explícito
- Injeção de anúncios não solicitados
- Uso de dados para fins não declarados
- Violação de direitos autorais

## Timeline típica

- **Day 0:** Submissão
- **Day 0-1:** Review automático (malware, políticas básicas)
- **Day 1-3:** Review manual (funcionalidades, privacidade)
- **Day 3-7:** Aprovação editorial e publicação
- **Variável:** Pode ser mais rápido ou requerer ajustes

## Referências

- `AGENTS.md` → "Submissão Chrome Web Store"
- `docs/rup/05-entrega-e-implantacao/empacotamento-spec.md`
- Chrome Web Store Policies: https://developer.chrome.com/docs/webstore/program-policies/
- Developer Dashboard: https://chrome.google.com/webstore/devconsole
