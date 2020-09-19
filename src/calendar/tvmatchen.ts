import iCalGenerator from 'ical-generator'

import { scrapeTvMatchen } from '../scrapers/tvmatchen'
import { createCalendarEvents } from '../utils'

export const generateTvMatchenCalendar = async () => {
  const games = await scrapeTvMatchen()

  const events = createCalendarEvents(games)

  const iCal = iCalGenerator({
    domain: 'calendar.oskarrosen.com',
    name: 'Football Games',
    url: 'https://calendar.oskarrosen.com/football',
    prodId: '//Oskar Rosen//Football Games//EN',
    ttl: 600,
    events,
  })

  return iCal.toString()
}
