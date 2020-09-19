const generateCalendar = require('../calendar/calendar.js')

exports.handler = async (event) => {
  const data = await generateCalendar('CS')

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="hltv.ics"`,
    },
    body: Buffer.from(data).toString('base64'),
    isBase64Encoded: true,
  }
}
