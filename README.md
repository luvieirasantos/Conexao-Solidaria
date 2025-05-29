# Conexão Solidária

Um aplicativo mobile para comunicação offline via rede mesh BLE em comunidades afetadas por eventos extremos.

## Funcionalidades

- Comunicação offline via Bluetooth Low Energy (BLE)
- Envio e recebimento de mensagens
- Armazenamento local de mensagens
- Interface moderna e intuitiva
- Suporte a modo escuro
- Status de conexão em tempo real

## Requisitos

- Node.js 14 ou superior
- React Native CLI
- Android Studio (para desenvolvimento Android)
- Xcode (para desenvolvimento iOS, apenas macOS)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/conexao-solidaria.git
cd conexao-solidaria
```

2. Instale as dependências:
```bash
npm install
```

3. Para iOS, instale os pods:
```bash
cd ios && pod install && cd ..
```

## Executando o aplicativo

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── navigation/     # Configuração de navegação
  ├── screens/        # Telas do aplicativo
  ├── services/       # Serviços (API, BLE, Storage)
  ├── styles/         # Estilos e temas
  └── types/          # Definições de tipos TypeScript
```

## Tecnologias Utilizadas

- React Native
- TypeScript
- React Navigation
- React Native Paper
- AsyncStorage
- React Native BLE PLX

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 