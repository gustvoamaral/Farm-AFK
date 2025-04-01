const mineflayer = require('mineflayer')
const utils = require('./utils');
var colors = require('colors');
const fs = require('fs');
const { Client, Intents, GatewayIntentBits } = require('discord.js')
require('dotenv').config()

const token = process.env.TOKEN
var channel = process.env.CHANNEL

// Discord bot

const client = new Client({
  intents: [GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
  ]
})

client.login(token)

mineflayer.multiple = async (bots, constructor) => {
  const { Worker, isMainThread, workerData } = require('worker_threads')
  if (isMainThread) {
    const threads = []
    for (const i in bots) {
      await utils.sleep(6000)
      threads.push(new Worker(__filename, { workerData: bots[i] }))
    }
  } else {
    constructor(workerData)
  }
}

const accounts = []
const accountFile = 'accounts.txt';
const accountsFileData = fs.readFileSync(accountFile, 'utf8');
for (const account of accountsFileData.split('\r\n')) {
  const splitted = account.split(':')
  if (splitted.length === 4) {
    accounts.push({ username: splitted[0], pass: splitted[1], home: splitted[2], auth: splitted[3] });
  }
}

const bot_creator = ({ username, pass, home, auth }) => {
  let bot = mineflayer.createBot({
    username,
    host: 'jogar.stardix.com',
    port: 25565,
    checkTimeoutInterval: 600000,
    brand: '',
    version: '1.18',
    auth,
    pass,
    home
  })

  client.on('ready', () => {
    channel = client.channels.cache.get(channel)
    return;
  })

  client.on('messageCreate', async (message) => {
    if (message.channel.id !== channel.id) return
    if (!(message.content.startsWith('!'))) return

    if (message.content.startsWith(`!restart`)) {
      let split = message.content.split(' ')
      if (split[1] == bot.username || split[1] == 'all') {
        channel.send(`[StarDix] Reiniciando: ${username}`)
        bot.quit()
        return;
      }
    }

    else if (message.content.startsWith(`!chat`)) {
      let split = message.content.split(' ')
      if (split[1] == bot.username || split[1] == 'all') {
        if (bot.location !== 'home') {
          channel.send(`${username} não está na home, aguarde um momento`)
          return;
        }
        else {
          let index = split.length - 2
          split = split.splice(2, index)
          split = split.join(' ')
          bot.chat(split)
          channel.send(`[Stardix] ${username} Enviou uma mensagem no chat.`)
        }
      }
    }

    else if (message.content.startsWith(`!money`)) {
      let split = message.content.split(' ')
      if (split[1] == bot.username || split[1] == 'all') {
        if (bot.location !== 'home') {
          channel.send(`${username} Não está na home, aguarde um momento`);
          return;
        } else {
          let index = split.length - 2;
          split = split.splice(2, index);
          split = split.join(' ');
          bot.chat('/money balance');
          bot.on('message', (message) => {
            if (message.toString().startsWith('[StarDix] Você tem ')) {
              const moneyMessage = message.toString().substring(8);
              channel.send(`[**StarDix**] ${username} > ${moneyMessage}`);
            }
          });
        }
      }
    }
    

    else if (message.content.startsWith('!stop')) {
      let split = message.content.split(' ')
      if (split[1] == bot.username || split[1] == 'all') {
        channel.send(`[Stardix] Desligando a conta: ${username}`)
        bot.disconnected = true
        bot.quit()
        return;
      }
    }

    else if (message.content.startsWith('!start')) {
      console.log('Ligando')
      let split = message.content.split(' ')
      if (split[1] == bot.username || split[1] == 'all') {
        if(!bot.disconnected) return
        channel.send(`[Stardix] Iniciando a conta: ${username}`)
        bot.disconnected = false
        client.removeAllListeners()
        bot.removeAllListeners()
        bot._client.removeAllListeners()
        bot_creator({ username, pass, home, auth });
        return
      }
    }
  })

  // Variable
  bot.location = 'unknown'
  bot.isRestarting = false
  bot.disconnected = false

  // Events
  bot.once('login', async () => console.log("Conectando > ".brightMagenta + username))

  bot.on('spawn', async () => {
    await utils.sleep(1500); 
    await utils.getLocation(bot, home, async () => {
      if (bot.location === 'home') {
        channel.send(`${username} chegou na home (/pw${home})`);
      } else {
        await utils.enterRankup(bot, home);  
      }
    });
  });

  

  bot.on('message', async (message) => {
    console.log(message.toAnsi())
    if (message.toString().includes('Por favor, faça o login com o comando "/login <senha>"')) bot.chat(`/login ${pass}`)

    else if (message.toString().startsWith('Servidor está reiniciando')) {
      console.log(`Servidor reiniciando, desconectando: ${bot.username}`.cyan)
      bot.isRestarting = true
      bot.quit()
    }
  })

  bot.on('end', async (reason) => {
    if (reason.includes('quitting') && bot.isRestarting) {
      client.removeAllListeners()
      bot.removeAllListeners()
      bot._client.removeAllListeners()

      utils.log(`${username} aguardando 5 min para reconectar`, 'brightMagenta')
      await utils.sleep(36000 * 5)
      bot.isRestarting = false

      bot_creator({ username, pass, home, auth });
    }
    else if (reason.includes('quitting') && bot.disconnected) {
      console.log('Desligando a conta.')
    }

    else {
      client.removeAllListeners()
      bot.removeAllListeners()
      bot._client.removeAllListeners()
      utils.log(`${username} foi desconectado, reconectando...`, 'brightRed');
      await utils.sleep(7500);
      bot_creator({ username, pass, home, auth });
    }
  })
}

mineflayer.multiple(accounts, bot_creator)