const generateCalendar = require('../calendar/nba.js')

exports.handler = async (event) => {
  const data = await generateCalendar()

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="nba.ics"`,
    },
    body: Buffer.from(data).toString('base64'),
    isBase64Encoded: true,
  }
}
