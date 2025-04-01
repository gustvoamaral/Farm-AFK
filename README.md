# Bot Mineflayer para o Servidor StarDix - Minecraft

Este projeto é um bot automatizado para o servidor de Minecraft StarDix, desenvolvido com a biblioteca [Mineflayer](https://github.com/PrismarineJS/mineflayer). O bot pode entrar no RankUP, gerenciar contas, responder a comandos via Discord e interagir com o jogo.

## 🚀 Funcionalidades

- Autenticação automática
- Entrada no RankUP
- Comandos via Discord
- Reconexão automática após desconexão
- Gerenciamento de múltiplas contas

## 🛠️ Tecnologias Utilizadas

- Node.js
- Mineflayer
- Discord.js
- Worker Threads
- Moment.js

## 📦 Instalação

1. Criar um BOT no discord:
   ```sh
   Crie um bot de discord em discord.dev (Com perm AD)
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Crie um arquivo `.env` e defina suas variáveis:
   ```env
   TOKEN=seu_token_do_discord
   CHANNEL=id_do_canal_do_discord
   ```
4. Adicione suas contas ao arquivo `accounts.txt` no seguinte formato:
   ```txt
   nick:senha:/pw:
   nick:senha:/pw:
   ```

## ▶️ Uso

Para iniciar o bot, execute:
```sh
start.bat
```

## 📜 Comandos no Discord

Os bots podem ser controlados via um canal específico no Discord com os seguintes comandos:

- `!restart <bot>` - Reinicia o bot especificado.
- `!chat <bot> <mensagem>` - Envia uma mensagem no chat do jogo.
- `!money <bot>` - Consulta o saldo do bot.
- `!stop <bot>` - Desliga o bot.
- `!start <bot>` - Liga um bot desligado.

## 🤖 Customization by Gustavo.

