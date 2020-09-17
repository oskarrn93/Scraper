const iCalGenerator = require("ical-generator");

const scrapeHLTV = require("./scraper.js");

const createCalendarEvents = (games) => {
  return games.map(({ startDate, endDate, team1, team2, id }) => ({
    start: new Date(startDate),
    end: new Date(endDate),
    summary: `${team1} - ${team2}`,
    description: `${team1} - ${team2}`,
    url: "https://www.hltv.org/matches",
    uid: `cs-games-${id}`,
  }));
};

const generateCalendar = async () => {
  const games = await scrapeHLTV();

  const events = createCalendarEvents(games);

  const iCal = iCalGenerator({
    domain: "calendar.oskarrosen.com",
    name: "CS Games",
    url: "https://calendar.oskarrosen.com/cs",
    prodId: "//Oskar Rosen//CS Games//EN",
    ttl: 600,
    timezone: "Europe/Berlin",
    events,
  });

  return iCal.toString();
};

module.exports = generateCalendar;
