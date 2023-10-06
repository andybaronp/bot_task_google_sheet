const {
  createBot,
  createProvider,
  createFlow,
} = require('@bot-whatsapp/bot')
require('dotenv').config()

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')
// flujos
const { flowRegisterTask, flowListTask, flowEditTask, flowStartChat, flowEndChatSay } = require('./flows')


const main = async () => {
  const adapterDB = new JsonFileAdapter()
  const adapterFlow = createFlow([flowRegisterTask, flowListTask, flowEditTask, flowStartChat, flowEndChatSay])
  const adapterProvider = createProvider(BaileysProvider)

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  })

  QRPortalWeb()
}

main()