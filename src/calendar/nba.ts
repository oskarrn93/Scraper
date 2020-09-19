import iCalGenerator from 'ical-generator'

import { scrapeNBA } from './../scrapers/nba'
import { createCalendarEvents } from '../utils'

export const generateNBACalendar = async () => {
  const games = await scrapeNBA()

  const events = createCalendarEvents(games)

  const iCal = iCalGenerator({
    domain: 'calendar.oskarrosen.com',
    name: 'NBA Games',
    url: 'https://calendar.oskarrosen.com/nba',
    prodId: '//Oskar Rosen//NBA Games//EN',
    ttl: 600,
    events,
  })

  return iCal.toString()
}
