import crypto from 'crypto'

import type { ICalEventData } from 'ical-generator'
import type { Event } from '../interfaces'

export const createCalendarEvents = (games: Event[]): ICalEventData[] => {
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
