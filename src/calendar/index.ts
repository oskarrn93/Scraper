import iCalGenerator from 'ical-generator'

import { scrapeCS } from '../scrapers/cs'
import { scrapeNBA } from '../scrapers/nba'
import { scrapeTvMatchen } from '../scrapers/tvmatchen'
import { Action } from '../types'
import { createCalendarEvents } from '../utils'

const getScraper = (action: Action) => {
  switch (action) {
    case 'CS':
      return scrapeCS
    case 'NBA':
      return scrapeNBA
    case 'Football':
      return scrapeTvMatchen
    default:
      return null
  }
}

export const generateCalendar = async (action: Action) => {
  const scraper = getScraper(action)

  const games = scraper !== null ? await scraper() : []

  const events = createCalendarEvents(games)

  const iCal = iCalGenerator({
    name: `${action} Games`,
    url: `https://calendar.oskarrosen.io/${action.toLowerCase()}`,
    prodId: `//Oskar Rosen//${action} Games//EN`,
    ttl: 600,
    events,
  })

  return iCal.toString()
}
