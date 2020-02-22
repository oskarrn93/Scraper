import axios from "axios";
import crypto from "crypto";

const nba_url =
  "http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2019/league/00_full_schedule.json";
const nba_teams = ["Celtics", "Lakers", "Warriors"];

const DEBUG = true;

export const scrapeNBA = async function() {
  const promise = axios
    .get(nba_url)
    .then(response => {
      if (DEBUG) console.log(response);
      return response;
    })
    .then(response => {
      if (DEBUG) console.log(response.data);
      return response.data;
    })
    .then(response => {
      return parseNba(response);
    })
    .then(data => {
      if (DEBUG) console.log(data);
      return data;
    })
    .catch(error => {
      throw error;
    });

  try {
    const data = await promise;
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

function parseNba(data) {
  console.log(data);

  const list_of_nba_games = [];
  const date_now = Date.now() + 86400; //Math.floor(Date.now() / 1000) + 86400; //in seconds, 86400 is equal to one day, so I set time now to be tomorrow to allow games that are earlier today to show

  data.lscd.forEach(function(months) {
    months.mscd.g.forEach(function(game) {
      const nba_game = {
        timestamp: null,
        away_team: null,
        home_team: null,
        location: null,
        _id: null
      };

      if (game.etm == "TBD") {
        return;
      }

      const tmp_date = game.etm + "-05:00";
      nba_game.timestamp = Date.parse(tmp_date);

      //if the teams that are playing are not one of the teams we search for
      if (
        nba_teams.indexOf(game.v.tn) == -1 &&
        nba_teams.indexOf(game.h.tn) == -1
      ) {
        return;
      }

      //if game is over, dont add to database
      if (date_now > nba_game.timestamp) {
        return;
      }

      nba_game.away_team = game.v.tc + " " + game.v.tn; //e.g. Boston Celtics
      nba_game.home_team = game.h.tc + " " + game.h.tn;
      nba_game.location = game.an + ", " + game.ac + ", " + game.as; //e.g. Capital One Arena, Washington, DC

      //create a unique id for storing in mongodb
      const hash = crypto.createHash("sha256");
      hash.update(nba_game.timestamp.toString());
      hash.update(nba_game.away_team);
      hash.update(nba_game.home_team);
      hash.update(nba_game.location);

      nba_game._id = hash.digest("hex");

      //add game to the list of games
      list_of_nba_games.push(nba_game);
    });
  });

  if (DEBUG) console.log(list_of_nba_games);

  return list_of_nba_games;
}
