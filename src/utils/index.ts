import crypto from 'crypto'
import iCalGenerator from 'ical-generator'

import { Event } from '../interfaces'

export const createCalendarEvents = (games: Event[]): iCalGenerator.EventData[] => {
  return games.map(({ start, end, summary, description }) => {
    const uid = crypto.randomBytes(20).toString('hex')

    return {
      start,
      end,
      summary,
      description,
      uid,
    }
  })
}
