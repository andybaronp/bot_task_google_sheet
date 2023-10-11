const { addKeyword } = require("@bot-whatsapp/bot")
const { getTask, updatedTask, saveTask } = require("../utils/funtionsTask")

const flowEndChat = addKeyword('end').addAnswer(
  'Registro *cancelado* por falta de actividad del cliente.\n Puedes iniciar el registro nuevamente o consultar pentieste enviando *Lista*',
)

const flowRegisterTask = addKeyword(['registrar', 'registra', 'registro'])
  .addAnswer('Ok! vamos a registrar una tarea', { delay: 2000 })
  .addAnswer(
    'Dime tu tarea pendiente',
    { capture: true, idle: 35000, delay: 2000 },
    async (ctx, { flowDynamic, gotoFlow }) => {
      if (ctx?.idleFallBack) {
        return gotoFlow(flowEndChat)
      }
      task = { task: ctx.body, from: ctx.from }
      const res = await saveTask(task)
      if (res) {
        await flowDynamic([
          {
            body: `Registrada`,
          },
        ])
      } else {
        await flowDynamic([
          {
            body: `*Hubo un error*`,
          },
        ])
      }
      flowDynamic()
    },
  )

const flowEditTask = addKeyword(['terminar', 'completar']).addAnswer(
  'Ok! indica el *ID* de la tarea',

  { capture: true, idle: 35000, delay: 2000 },
  async (ctx, { flowDynamic, gotoFlow }) => {
    if (ctx?.idleFallBack) {
      return gotoFlow(flowEndChat)
    }
    let task = { id: ctx.body, from: ctx.from }
    const { status, message } = await updatedTask(task)
    if (status) {
      await flowDynamic([
        {
          body: message,
        },
      ])
    } else {
      await flowDynamic([
        {
          body: `*Hubo un error*`,
        },
      ])
    }
    flowDynamic()
  },
)
const flowListTask = addKeyword([
  'listar',
  'lista',
  'pendiente',
  'tareas',
]).addAnswer(
  'Ok! vamos a listar tus pendientes',
  { delay: 2000 },
  async (ctx, { flowDynamic }) => {
    const { tasksList, message } = await getTask(ctx)
    if (tasksList.length === 0) {
      return flowDynamic([
        { body: `*${ctx.pushName}* no tienes tareas pendientes` },
      ])
    }
    flowDynamic([
      { body: `*${ctx.pushName}* tus pendientes son:`, delay: 2000 },
    ])
    const taks = tasksList.map((dato) => ({
      body: `*ID:* ${dato.id}\n*Tarea:* ${dato.task}\n*Registrada:* ${dato.date}`,
      delay: 3000,
    }))
    await flowDynamic(taks)
    flowDynamic([{ body: `*${ctx.pushName}* esas son tus tareas pendientes✅\nPuedes completarlas utilizando el comando *completar* `, delay: 3000 }])
  },
)

const flowStartChat = addKeyword(['start', 'iniciar', 'inicio', 'comandos', '/']).addAnswer('📃La lista de comandos son:\n \n👉 *Listar* para ver las tareas pendientes\n👉 *Completar* para marcar como completa una tarea\n👉 *Registrar* para registrar *una tarea*', {
  media: 'https://i.imgur.com/xq9gKnAm.jpg'
})
const flowEndChatSay = addKeyword(['adios', 'gracias']).addAnswer('Nos vemos 🤘', {
  media: 'https://i.imgur.com/og03n40m.jpg'
})


module.exports = { flowStartChat, flowEndChatSay, flowEndChat, flowRegisterTask, flowEditTask, flowListTask }