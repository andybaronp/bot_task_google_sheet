// autho
const { GoogleSpreadsheet } = require('google-spreadsheet')
const RESPONSES_SHEET_ID = process.env.SHEET_ID //Aquí pondras el ID de tu hoja de Sheets
const { JWT } = require('google-auth-library')
const serviceAccountAuth = new JWT({
  email: process.env.CLIENT_EMAIL,
  key: process.env.PRIVATE_KEY.split(String.raw`\n`).join('\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})
const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID, serviceAccountAuth)


const { formatDate } = require("./formatDate")

async function saveTask(task) {
  let rows = [
    {
      status: 'pendiente',
      date: formatDate(new Date()),
      task: task.task,
      from: task.from,
    },
  ]
  try {

    await doc.loadInfo()
    let sheet = doc.sheetsByIndex[1]
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index]
      await sheet.addRow(row)
    }
    return true
  } catch (error) {
    return false
  }
}

async function getTask(ctx) {
  let listTask = []
  try {
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[1]
    const rows = await sheet.getRows()
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index]
      if (row._rawData[0] === ctx.from && row._rawData[2] === 'pendiente') {
        listTask.push({
          'task': row._rawData[1],
          'date': row._rawData[3],
          'id': row._rowNumber,
        })
      }
    }
    return { tasksList: listTask, message: 'Tareas encontradas' }
  } catch (error) {
    console.log(error);
    return { tasksList: [], message: error }
  }
}

async function updatedTask(task) {
  try {
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[1]
    const rows = await sheet.getRows()
    const rowsLength = rows.find(row => row._rowNumber === Number(task.id))
    if (rowsLength) {
      if (rowsLength._rawData[0] === task.from && rowsLength._rowNumber === Number(task.id) && rowsLength._rawData[2] === 'pendiente') {
        rowsLength._rawData[2] = 'completada'
        await rowsLength.save()
        return { status: true, message: 'Tarea completada' }
      }
      else {
        return { status: true, message: 'No se encontro la tarea \nIntenta listando tus tareas con *Listar*' }
      }

    } else {
      return { status: true, message: 'No se encontro la tarea \nIntenta listando tus tareas con *Listar*' }
    }
  } catch (error) {
    return false
  }
}


module.exports = { saveTask, getTask, updatedTask }