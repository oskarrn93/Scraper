import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda'

import { generateCalendar } from '../calendar'
import * as database from '../database'
import { Action, DatabaseEntry } from '../types'
import { getIsNeedScrapeAgain, getResponseHeaders } from './../utils'

const genericHandler = async (id: Action, event: APIGatewayProxyEvent) => {
  let response: DatabaseEntry | undefined
  try {
    response = await database.getById(id)
  } catch (error) {
    console.error(error)
  }

  let data: string

  const isNeedScrapeAgain = getIsNeedScrapeAgain(response?.updated)

  if (response && !isNeedScrapeAgain) {
    data = response.data
  } else {
    data = await generateCalendar(id)
    //write to database without blocking
    database.insert({ id, data }).catch((error) => console.error(error))
  }

  return {
    statusCode: 200,
    headers: getResponseHeaders(id),
    body: data,
  }
}

export const nba: APIGatewayProxyHandler = async (event) => genericHandler('NBA', event)
export const cs: APIGatewayProxyHandler = async (event) => genericHandler('CS', event)
export const football: APIGatewayProxyHandler = async (event) => genericHandler('Football', event)
