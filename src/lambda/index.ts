import type { APIGatewayProxyHandler } from 'aws-lambda'

import { generateCalendar } from '../calendar'

export const nba: APIGatewayProxyHandler = async (event) => {
  const data = await generateCalendar('NBA')

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

export const cs: APIGatewayProxyHandler = async (event) => {
  const data = await generateCalendar('CS')

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="cs.ics"`,
    },
    body: Buffer.from(data).toString('base64'),
    isBase64Encoded: true,
  }
}

export const football: APIGatewayProxyHandler = async (event) => {
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
