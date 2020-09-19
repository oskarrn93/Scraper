const axios = require("axios");
const crypto = require("crypto");
const addDays = require("date-fns/addDays");
const addHours = require("date-fns/addHours");
const { parseFromTimeZone } = require("date-fns-timezone");

const url =
  "http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2019/league/00_full_schedule.json";
const nba_teams = ["celtics", "lakers", "warriors"];

const DEBUG = true;

const scrapeNBA = async () => {
  const response = await axios.get(url);
  const { data } = response;

  const parsedGames = parse(data);
  return parsedGames;
};

function parse(data) {
  console.log(data);

  const list_of_nba_games = [];
  const dateTreshold = addDays(Date.now(), 1);

  data.lscd.forEach(function (months) {
    months.mscd.g.forEach(function (game) {
      const nba_game = {
        startDate: null,
        endDate: null,
        team1: null,
        team2: null,
        location: null,
        id: null,
      };

      if (game.etm == "TBD") {
        return;
      }

      const parsedDate = parseFromTimeZone(game.etm, {
        timeZone: "America/New_York",
      });

      nba_game.startDate = parsedDate.getTime();

      //if game is over, dont add to database
      if (dateTreshold > nba_game.startDate) {
        return;
      }

      nba_game.endDate = addHours(nba_game.startDate, 2);

      //if the teams that are playing are not one of the teams we search for
      if (
        nba_teams.indexOf(game.v.tn.toLowerCase()) == -1 &&
        nba_teams.indexOf(game.h.tn.toLowerCase()) == -1
      ) {
        return;
      }

      nba_game.team1 = `${game.h.tc} ${game.h.tn}`; //e.g. Boston Celtics
      nba_game.team2 = `${game.v.tc} ${game.v.tn}`;
      nba_game.location = `${game.an}, ${game.ac}, ${game.as}`; //e.g. Capital One Arena, Washington, DC

      //create a unique id for storing in mongodb
      const hash = crypto.createHash("sha256");
      hash.update(nba_game.startDate.toString());
      hash.update(nba_game.endDate.toString());
      hash.update(nba_game.team1);
      hash.update(nba_game.team2);
      hash.update(nba_game.location);

      nba_game.id = hash.digest("hex");

      //add game to the list of games
      list_of_nba_games.push(nba_game);
    });
  });

  if (DEBUG) console.log(list_of_nba_games);

  return list_of_nba_games;
}

module.exports = scrapeNBA;
