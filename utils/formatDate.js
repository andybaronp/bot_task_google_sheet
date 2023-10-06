function formatDate(fecha) {
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ]

  const dateObj = new Date(fecha)
  const day = dateObj.getDate()
  const monthToText = months[dateObj.getMonth()]
  const year = dateObj.getFullYear()

  return `${day} de ${monthToText} de ${year}`
}
module.exports = { formatDate }