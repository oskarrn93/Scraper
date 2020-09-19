import { argv } from 'yargs'

import { generateCalendar } from './calendar'

if (argv.cs) {
  ;(async () => {
    const result = await generateCalendar('CS')
    console.log('result', result)
  })()
}

if (argv.nba) {
  ;(async () => {
    const result = await generateCalendar('NBA')
    console.log('result', result)
  })()
}

if (argv.football) {
  ;(async () => {
    const result = await generateCalendar('Football')
    console.log('result', result)
  })()
}
