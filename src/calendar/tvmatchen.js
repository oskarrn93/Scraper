const iCalGenerator = require("ical-generator");

const scrapeTvMatchen = require("../scrapers/tvmatchen.js");

const createCalendarEvents = (games) => {
  return games.map(({ startDate, endDate, title, channels, id }) => ({
    start: startDate,
    end: endDate,
    summary: title,
    description: channels,
    uid: `football-games-${id}`,
  }));
};

const generateCalendar = async () => {
  const games = await scrapeTvMatchen();

  const events = createCalendarEvents(games);

  const iCal = iCalGenerator({
    domain: "calendar.oskarrosen.com",
    name: "Football Games",
    url: "https://calendar.oskarrosen.com/football",
    prodId: "//Oskar Rosen//Football Games//EN",
    ttl: 600,
    events,
  });

  return iCal.toString();
};

module.exports = generateCalendar;
