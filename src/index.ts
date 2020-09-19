import { argv } from 'yargs'
import { scrapeTvMatchen } from './scrapers/tvmatchen'

if (argv.cs) {
  console.log('scrape cs')
}

if (argv.nba) {
  console.log('scrape nba')
}

if (argv.football) {
  ;(async () => {
    const result = await scrapeTvMatchen()
    console.log('result', result)
  })()
}

if (argv.all) {
  console.log('scrape all')
}
