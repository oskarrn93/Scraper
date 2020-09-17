import iCalGenerator from "ical-generator";
import http from "http";

import { scrapeHLTV } from "../scrapers/hltv.js";

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

const main = async () => {
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

  http
    .createServer(function (req, res) {
      iCal.serve(res);
    })
    .listen(3000, function () {
      console.log("Server running at http://localhost:3000/");
    });
};

main();
