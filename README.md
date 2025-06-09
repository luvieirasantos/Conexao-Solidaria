# Conexão Solidária

Em eventos extremos, sabemos que a primeira coisa a ser afetada são os meios de comunicação, sao eles, wifi, dados moveis e geralmente a energia, pensando nisso, desenvolvemos:
Um aplicativo mobile para comunicação offline via rede mesh BLE, focado em fornecer uma ferramenta de comunicação resiliente para comunidades e equipes de resposta em áreas afetadas por eventos extremos, onde a infraestrutura de comunicação tradicional pode estar comprometida.

# Video youtube

https://youtu.be/qCBpiV0b87g

## Funcionalidades Principais

- **Comunicação Offline Confiável:** Troca de mensagens ponto a ponto e em grupo via Bluetooth Low Energy (BLE), sem depender de internet ou rede celular.
- **Interface Intuitiva e Acessível:** Design focado na usabilidade em situações de estresse, com interface clara, cores de alto contraste e tipografia legível (usando a fonte Poppins).
- **Mensagens Prioritárias:** Capacidade de marcar mensagens com diferentes níveis de prioridade (alta, média, baixa) com indicadores visuais claros.
- **Detalhes da Mensagem:** Visualização completa das mensagens com informações de remetente, data, hora, localização (se disponível) e status.
- **Histórico de Mensagens:** Acesso fácil a todas as mensagens enviadas e recebidas, com opção de atualização por pull-to-refresh.
- **Simulação de Alerta:** Funcionalidade nas configurações para simular um alerta de defesa civil de alta prioridade.
- **Gerenciamento de Dados:** Opção clara nas configurações para apagar todos os dados armazenados localmente (mensagens e configurações).
- **Configurações Personalizáveis:** Controle sobre notificações, conexão automática e modo de economia de bateria.
- **Visual Consistente:** Utilização de um sistema de design (React Native Paper) e um tema visual unificado para uma experiência de usuário coesa.

## Requisitos

- Node.js 14 ou superior
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Um dispositivo físico (Android ou iOS) ou emulador/simulador com Bluetooth habilitado.

## Instalação

1. Clone o repositório:
```bash
git clone [URL do seu repositório]
cd conexao-solidaria
```

2. Instale as dependências:
```bash
npm install
# ou yarn install
```

3. Instale as dependências específicas do Expo:
```bash
expo install expo-linear-gradient @expo-google-fonts/poppins
```

## Executando o aplicativo

1. Inicie o servidor de desenvolvimento Expo:
```bash
npm start
# ou yarn start
```

2. Siga as instruções no terminal para abrir o aplicativo no seu dispositivo ou emulador/simulador (usando o aplicativo Expo Go).

## Estrutura do Projeto

```
src/
  ├── assets/         # Imagens, fontes, etc.
  ├── components/     # Componentes reutilizáveis (ex: MessageCard)
  ├── navigation/     # Configuração de navegação (ex: tipos de tela)
  ├── screens/        # Telas do aplicativo (ex: SentMessagesScreen, SettingsScreen)
  ├── services/       # Serviços (ex: storage.ts)
  ├── styles/         # Estilos e temas (ex: theme.ts)
  └── types/          # Definições de tipos TypeScript
```

## Tecnologias Principais Utilizadas

- React Native
- TypeScript
- Expo
- React Navigation
- React Native Paper (para componentes UI)
- `@expo-google-fonts/poppins` (para a fonte Poppins)
- `expo-linear-gradient` (para gradientes)
- `@react-native-async-storage/async-storage` (para armazenamento local)
- date-fns (para formatação de data/hora)

## Contribuição

Contribuições são bem-vindas! Por favor, siga estes passos:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/sua-feature`).
3. Faça commit das suas mudanças (`git commit -m 'feat: Adiciona sua feature'`).
4. Envie para o repositório (`git push origin feature/sua-feature`).
5. Abra um Pull Request detalhando suas mudanças.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 
