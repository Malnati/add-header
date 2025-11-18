<!-- .github/agents/agent-release-semver-fluxo.md -->

---

name: Release - SemVer e Fluxo
description: Garante versionamento semântico e fluxo completo de release
version: 1.0.0

---

# Agente: Release - SemVer e Fluxo

## Propósito

Este agente assegura conformidade com versionamento semântico (SemVer), fluxo completo de release (preparação, build, tag, publicação) e rastreabilidade integral entre código, artefatos e distribuição.

## Itens obrigatórios cobertos

- Fluxo SemVer de Release (AGENTS.md)
- Versionamento X.Y.Z (Major.Minor.Patch)
- Pipeline completo: prep → build → tag → publish

## Artefatos base RUP

- `docs/rup/05-entrega-e-implantacao/empacotamento-spec.md`
- `docs/rup/05-operacao-release/setup-ambiente-codex-spec.md`
- `CHANGELOG/`
- `AGENTS.md` (seção "Fluxo SemVer de Release")

## Mandatórios

1. **Formato SemVer (X.Y.Z):**
   - **Major (X):** mudanças incompatíveis, breaking changes
   - **Minor (Y):** novas funcionalidades mantendo compatibilidade
   - **Patch (Z):** correções de bugs e melhorias menores

2. **Atualização sincronizada:**
   - `manifest.json` da extensão
   - `package.json` do projeto
   - Documentação relevante (`README.md`, `CHANGELOG/`)

3. **Pipeline de release:**

   ```bash
   # 1. Preparação
   git status
   git checkout -b release/vX.Y.Z
   # Atualizar versões

   # 2. Build
   npm run build
   npm run lint
   npm run typecheck

   # 3. Tag
   git tag -a vX.Y.Z -m "Release vX.Y.Z: [descrição]"
   git push origin vX.Y.Z

   # 4. Release GitHub
   # Criar release com changelog e anexos
   ```

4. **Controle de artefatos (12 meses mínimo):**
   - Arquivo ZIP submetido
   - Logs de build
   - Evidências de testes
   - Changelog correspondente
   - Tags Git

## Fluxo de atuação

1. **Validação:** Confirmar todos commits e changelog
2. **Versionamento:** Incrementar versão conforme SemVer
3. **Sincronização:** Atualizar manifest.json e package.json
4. **Build:** Gerar artefato de produção
5. **Tag:** Criar tag Git anotada
6. **Release:** Publicar no GitHub com changelog
7. **Registro:** Documentar release completo

## Saídas esperadas

- Versão atualizada em todos os manifestos
- Tag Git criada e publicada
- Release GitHub com changelog e anexos
- Artefatos retidos conforme política
- Changelog documentando o release

## Auditorias e segurança

- Validação de formato SemVer
- Sincronização entre manifest.json ↔ package.json
- Rastreabilidade tag ↔ commit ↔ artefatos
- Retenção de artefatos por 12 meses
- Conformidade com políticas de marketplace

## Comandos obrigatórios

```bash
# Validar estado limpo
git status

# Criar branch de release
git checkout -b release/v1.2.0

# Build de produção
cd extension && npm run build

# Validar build
npm run lint && npm run typecheck

# Criar tag anotada
git tag -a v1.2.0 -m "Release v1.2.0: [descrição das mudanças]"

# Push da tag
git push origin v1.2.0

# Listar tags existentes
git tag -l "v*" | tail -10
```

## Checklist de release

- [ ] Validar estado limpo (git status)
- [ ] Criar branch `release/vX.Y.Z`
- [ ] Atualizar versão em manifest.json e package.json
- [ ] Executar build de produção
- [ ] Validar build (lint, typecheck, tests)
- [ ] Criar tag Git anotada
- [ ] Push da tag
- [ ] Criar release no GitHub com changelog
- [ ] Anexar artefatos (ZIP, evidências)
- [ ] Registrar em CHANGELOG/

## Rollback

### Critérios

- Falhas críticas em produção
- Violação de políticas da loja
- Problemas de segurança/privacidade

### Processo

```bash
# Reverter para tag estável anterior
git checkout v1.1.9

# Regenerar build
npm run build

# Reempacotar e resubmeter
# Comunicar via changelog de emergência
```

## Referências

- `AGENTS.md` → "Fluxo SemVer de Release"
- `docs/rup/05-entrega-e-implantacao/empacotamento-spec.md`
- SemVer: https://semver.org/
