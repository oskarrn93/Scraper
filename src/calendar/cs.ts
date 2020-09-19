import iCalGenerator from 'ical-generator'

import { scrapeCS } from '../scrapers/cs'
import { createCalendarEvents } from '../utils'

export const generateCSCalendar = async () => {
  const games = await scrapeCS()

  const events = createCalendarEvents(games)

  const iCal = iCalGenerator({
    domain: 'calendar.oskarrosen.com',
    name: 'CS Games',
    url: 'https://calendar.oskarrosen.com/cs',
    prodId: '//Oskar Rosen//CS Games//EN',
    ttl: 600,
    events,
  })

  return iCal.toString()
}
