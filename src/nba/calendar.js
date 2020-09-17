const iCalGenerator = require("ical-generator");

const scrapeNBA = require("./scraper.js");

const createCalendarEvents = (games) => {
  return games.map(({ startDate, endDate, team1, team2, location, id }) => ({
    start: new Date(startDate),
    end: new Date(endDate),
    summary: `${team1} - ${team2}`,
    description: `${team1} - ${team2}`,
    location,
    url: "https://www.nba,com",
    uid: `nba-games-${id}`,
  }));
};

const generateCalendar = async () => {
  const games = await scrapeNBA();

  const events = createCalendarEvents(games);

  const iCal = iCalGenerator({
    domain: "calendar.oskarrosen.com",
    name: "NBA Games",
    url: "https://calendar.oskarrosen.com/nba",
    prodId: "//Oskar Rosen//NBA Games//EN",
    ttl: 600,
    timezone: "Europe/Berlin",
    events,
  });

  return iCal.toString();
};

(async () => {
  console.log(await generateCalendar());
})();

module.exports = generateCalendar;
