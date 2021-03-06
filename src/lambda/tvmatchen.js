const { generateCalendar } = require('../calendar/index.js')

exports.handler = async (event) => {
  const data = await generateCalendar('Football')

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="football.ics"`,
    },
    body: Buffer.from(data).toString('base64'),
    isBase64Encoded: true,
  }
}
