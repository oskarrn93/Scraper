import { argv } from 'yargs'

import { generateTvMatchenCalendar } from './calendar/tvmatchen'

if (argv.cs) {
  console.log('scrape cs')
}

if (argv.nba) {
  console.log('scrape nba')
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
