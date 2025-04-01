const moment = require('moment')
const math = require('math');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function enterRankup(bot, home) {
    console.log(`Bot ${bot.username} entrando no RankUp!`);

    await bot.waitForTicks(0);
    bot.setQuickBarSlot(0); // para o glad 4 e o star 0
    bot.activateItem();
    await bot.waitForTicks(0);

    let attempts = 0;

    while (bot.currentWindow == null) {
      bot.setQuickBarSlot(0); // para o glad 4 e o star 0
      bot.activateItem();
      await bot.waitForTicks(10);
      attempts++;
    }

    let attempts_waiting_compass = 0;

    if (bot.currentWindow != null) {
      while (bot.game.levelType == "flat") {
        attempts_waiting_compass += 1;
        if (attempts_waiting_compass <= 5) {
          bot.clickWindow(11, 0, 0);
          console.log("Tentando entrar no RankUp! Tentativas " + attempts_waiting_compass );
          if (bot.currentWindow == null) break;
          await bot.waitForTicks(20);
        } else {
          console.log("Não foi possível entrar no RankUp! Reconectando...".red);
          bot.end("reconnect-needed");
          enterRankup(bot, home);
          break;
        }
      }
      bot.chat(`${home}`, console.log(`Bot ${bot.username} entrando em ${home}`.cyan))
      
      bot.on('message', async (message) => {
        if (message.toString().includes('Teletransportado com sucesso para')) {
          bot.location='home';
          console.log(`${bot.username} chegou na home com sucesso!` .blue)
        } else if (message.toString().includes('Cancelado, você moveu')) {
          log(`${bot.username} não conseguiu chegar na home`, 'brightRed')
          await sleep(2500)
          bot.chat(`${home}`)
        }
      }
      )
    }

    if (!bot.on) {
      bot_creator();
      enterRankup();
    }
  }
  async function getLocation(bot, home, cb) {

    const onMessage = async (message) => {
        if (message.includes('Teletransportado com sucesso para')) {
            log(`${bot.username} chegou na home com sucesso!`, 'brightGreen')
            bot.location = 'home'
            bot.removeListener('messagestr', onMessage)
        }

        else if (message.includes('Cancelado, você moveu!')) {
            log(`${bot.username} não conseguiu chegar na home`, 'brightRed')
            bot.removeListener('messagestr', onMessage)
            await sleep(2500)
            bot.chat(`${home}`)
        }
    }

    let coords = bot.entity.position
    if (math.trunc(coords.z) === 0 && math.trunc(coords.x) === 0) {
        const block = bot.blockAt(bot.entity.position.offset(0, -1, 0))
        if (!block) return;
        if (block.name === 'polished_adesite') {
            bot.location = 'rankup'
            console.log('Lobby/Rankup identificado')
            bot.on('messagestr', onMessage)
            await sleep(500)
            log(`Entrando no FullPVP`, 'grey')
            bot.chat(`/sv`)
            bot.on('windowOpen', function(window) {
                console.log('Window:', window)
    
                bot.clickWindow(20, 0, 0);
              });
              await sleep(1500)
              log(`Indo até a home: ${home}`, 'grey')
              bot.chat(`${home}`)
        }
        if (block.name === 'stone') {
            bot.location = 'rankup'
            console.log('Lobby/Rankup identificado')
            bot.on('messagestr', onMessage)
            await sleep(500)
            log(`indo até o fullpvp`, 'grey')
            bot.chat(`/sv`)
            bot.on('windowOpen', function(window) {
                console.log('Window:', window)
    
                bot.clickWindow(20, 0, 0);
              });
              await sleep(1500)
              log(`Indo até a home: ${home}`, 'grey')
              bot.chat(`${home}`)
        }
        cb()
    }
}

async function getCurrentTime() {
    return (new moment()).format("HH:mm:ss");
}

async function log(message, color) {
    let time = await getCurrentTime();
    console.log(`[${time}] ${message}`[color]);
}

async function logAccount(user, message) {
    log('[' + user + '] ' + message);
}

module.exports = {
    sleep,
    log,
    logAccount,
    getLocation,
    enterRankup,
    getCurrentTime
}