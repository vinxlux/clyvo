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


## Telas
- Home / Dashboard
- Lista de Pets
- Detalhes do Pet
- Cadastro de Pet (formulário)
- Atividades do Dia
- Progresso e Estatísticas

## Checklist antes de entregar
- [x] App roda sem erros com `npx expo start`
- [x] Todas as 5+ rotas navegam corretamente
- [x] Formulário atualiza preview em tempo real
- [x] Dados salvos no AsyncStorage sobrevivem ao reload
- [x] README.md presente na raiz
- [x] 6 commits com mensagens corretas no histórico
- [x] Nenhuma tela em branco ou com erro de layout

## Observações
- Use o QR code no terminal do Expo ou a URL `exp://<ip>:<port>` no Expo Go.
- Testado em modo LAN no host; se houver problemas de rede, tente modo tunnel.

## Integrantes
rm562992
rm566548
rm563340
rm563062