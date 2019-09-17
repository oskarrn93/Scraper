const tvmatchen = require('./tvmatchen.js')

const DEBUG = true;

async function scrapeTvmatchen() {
   const data = await tvmatchen.scrape();
   if (DEBUG) console.log(data);
}

scrapeTvmatchen();


