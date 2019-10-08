const axios = require("axios");
const cheerio = require("cheerio");
const crypto = require("crypto");

const hltv_url = "https://www.hltv.org/matches";
const cs_teams = ["fnatic", "faze", "nip"];

//const bad_keywords = ["academy"];


const DEBUG = true;

this.scrape = async function() {
  const promise = axios
    .get(hltv_url)
    .then(response => {
      if (DEBUG) console.log(response);
      return response;
    })
    .then(response => {
      if (DEBUG) console.log(response.data);
      return response.data;
    })
    .then(response => {
      return parseHLTV(response);
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

function parseHLTV(data) {
  const $ = cheerio.load(data);

  const _games = $("div.upcoming-matches div.match-day table tbody tr");

  console.log (_games.length)

  const games = _games.map(function() {
    const details = {
      timestamp: null,
      team1: null,
      team2: null,
      id: null
    };

    const timestamp = cheerio(this).find("td.time > div.time").data("unix");
    if(DEBUG) console.log(timestamp);

    const _teams = cheerio(this).find("td.team-cell div.team");
    const team1 = _teams.first().text().trim();
    const team2 = _teams.last().text().trim();

    if(DEBUG) {
      console.log(team1);
      console.log(team2);
    }

    details.timestamp = timestamp;
    details.team1 = team1;
    details.team2 = team2;

    return details;
  }).get()
  .filter(function(game) {

    if(game.team1 && cs_teams.includes(game.team1.toLowerCase())) {     
      return true;
    }

    if(game.team2 && cs_teams.includes(game.team2.toLowerCase())) {     
      return true;
    }
    
    if(DEBUG) console.log("None of the teams matches what we search for")
    return false;
  })
  .map(function(game) {
    const sha256 = crypto.createHash("sha256");

    Object.values(game).forEach(function(value) {
      if (value === null) return;
      sha256.update(value.toString());
    });

    game.id = sha256.digest("hex");
    return game;
  });

  return games;
}
