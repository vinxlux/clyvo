# Clyvo — Acompanhamento de Desempenho do Pet

App mobile desenvolvido em React Native com Expo para acompanhamento
de saúde, atividades e desempenho de pets.

## Empresa
Clyvo — solução fictícia para acompanhar rotina e saúde de pets.

## Tecnologias
- React Native + Expo SDK
- Expo Router (file-based navigation)
- AsyncStorage
- TypeScript
## Como rodar

1. Instale dependências:

```bash
cd clyvo
npm install
```

2. Inicie o Expo (LAN) e abra no Expo Go (Android):

```bash
npx expo start --lan
# ou para abrir direto no Android (se configurado):
npm run android
```

Se preferir túnel (ngrok), o Expo pedirá para instalar `@expo/ngrok` globalmente.

## EAS Builds (quando Expo Go é incompatível)

Se seu Expo Go não suporta o SDK do projeto, você pode criar um build com EAS e instalar o APK no dispositivo.

1. Instale `eas-cli` e faça login:

```bash
npm install -g eas-cli
eas login
```

2. Gere um build (use `preview` ou `production` conforme necessidade):

```bash
cd clyvo
eas build -p android --profile preview
```

3. Quando o build terminar, baixe e instale o `apk` no dispositivo normalmente.

Observação: você precisa de uma conta Expo para executar builds com EAS.

## DevOps / Integração Contínua (EAS + GitHub Actions)

Instruções para integrar builds automáticos e gerar Dev Clients via CI/CD.

1. Variáveis/Segredos necessários (no provedor de CI, ex: GitHub Secrets):
	 - `EAS_BUILD_PROFILE` (opcional)
	 - `EXPO_TOKEN` — token do `eas login` (use `eas login --ci` para gerar)
	 - `ANDROID_KEYSTORE` / `EAS_CREDENTIALS` (se for assinar builds de produção)

2. Exemplo mínimo de workflow GitHub Actions (salve em `.github/workflows/eas-build.yml`):

```yaml
name: EAS Android Build

on:
	push:
		branches: [ main ]

jobs:
	build:
		runs-on: ubuntu-latest
		steps:
			- uses: actions/checkout@v4
			- name: Setup Node
				uses: actions/setup-node@v4
				with:
					node-version: '18'
			- name: Install eas-cli
				run: npm install -g eas-cli
			- name: Login to EAS
				run: eas login --token ${{ secrets.EXPO_TOKEN }}
			- name: Install dependencies
				run: npm ci
			- name: Run EAS build (development)
				run: eas build -p android --profile development --non-interactive

```

3. Observações:
	 - Para builds de produção configure as credenciais do keystore via `eas credentials` ou usando `EAS_CREDENTIALS`.
	 - Use `--non-interactive` em CI para evitar prompts.
	 - Armazene artefatos (APK/AAB) usando ações de upload se quiser disponibilizá-los automaticamente.

Se quiser, posso criar o arquivo de workflow exemplo e instruções adicionais para Fastlane ou outro provedor.

## Assinatura Android (keystore) — passo a passo

Recomendação: prefira deixar o EAS gerenciar as credenciais (mais seguro). Se precisar fornecer o keystore manualmente (por exemplo para CI), siga as instruções abaixo.

1) Gerar um `keystore` localmente (Java Keytool):

```bash
keytool -genkeypair -v \
	-keystore keystore.jks \
	-storetype JKS \
	-storepass <STORE_PASSWORD> \
	-keypass <KEY_PASSWORD> \
	-alias upload \
	-keyalg RSA -keysize 2048 -validity 10000 \
	-dname "CN=Nome, OU=Dev, O=Empresa, L=Cidade, ST=Estado, C=BR"
```

2) Fazer upload local para EAS (interativo, recomendado):

```bash
eas login          # se não estiver logado
eas credentials    # siga as instruções para enviar o keystore Android
```

3) (Opção CI) Codificar o `keystore.jks` em Base64 e salvar como secret no provedor (ex: GitHub Secrets `ANDROID_KEYSTORE_BASE64`):

Linux / macOS:
```bash
base64 keystore.jks > keystore.jks.base64
```

PowerShell (Windows):
```powershell
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes('keystore.jks')) | Out-File -Encoding ascii keystore.jks.base64
```

Abra `keystore.jks.base64`, copie o conteúdo e crie um Secret `ANDROID_KEYSTORE_BASE64`. Também adicione os segredos:
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS` (ex: `upload`)
- `ANDROID_KEY_PASSWORD`

4) Exemplo de etapa no workflow (decodifica e grava `keystore.jks`):

```yaml
- name: Decode Android keystore
	run: |
		echo "${{ secrets.ANDROID_KEYSTORE_BASE64 }}" | base64 --decode > keystore.jks

# agora você pode usar o arquivo `keystore.jks` localmente no job
```

5) Observações finais:
- Sempre proteja os segredos (`keystore` e senhas) no provedor CI.
- Preferível usar as credenciais gerenciadas pelo EAS para evitar expor arquivos sensíveis.
- Posso adicionar a etapa de importação automática no workflow se quiser — diga se prefere que eu atualize `.github/workflows/eas-build.yml` para decodificar e tentar importar o keystore automaticamente.

## Telas
- Home / Dashboard
- Lista de Pets
- Detalhes do Pet
- Cadastro de Pet (formulário)
- Atividades do Dia
- Progresso e Estatísticas

## Checklist antes de entregar
- [ ] App roda sem erros com `npx expo start`
- [ ] Todas as 5+ rotas navegam corretamente
- [ ] Formulário atualiza preview em tempo real
- [ ] Dados salvos no AsyncStorage sobrevivem ao reload
- [ ] README.md presente na raiz
- [ ] 6 commits com mensagens corretas no histórico
- [ ] Nenhuma tela em branco ou com erro de layout

## Observações
- Use o QR code no terminal do Expo ou a URL `exp://<ip>:<port>` no Expo Go.
- Testado em modo LAN no host; se houver problemas de rede, tente modo tunnel.

## Integrantes
- [Nome 1]
- [Nome 2]
