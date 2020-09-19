import { argv } from 'yargs'

import { generateCSCalendar } from './calendar/cs'
import { generateNBACalendar } from './calendar/nba'
import { generateTvMatchenCalendar } from './calendar/tvmatchen'

if (argv.cs) {
  ;(async () => {
    const result = await generateCSCalendar()
    console.log('result', result)
  })()
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
