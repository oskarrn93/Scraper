import { argv } from 'yargs'

import { generateNBACalendar } from './calendar/nba'
import { generateTvMatchenCalendar } from './calendar/tvmatchen'

if (argv.cs) {
  console.log('scrape cs')
}

if (argv.nba) {
  ;(async () => {
    const result = await generateNBACalendar()
    console.log('result', result)
  })()
}

if (argv.football) {
  ;(async () => {
    const result = await generateTvMatchenCalendar()
    console.log('result', result)
  })()
}

if (argv.all) {
  console.log('scrape all')
}
