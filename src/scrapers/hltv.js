import axios from "axios";
import cheerio from "cheerio";
import crypto from "crypto";

import {
  ONE_HOUR_IN_MS,
  THREE_HOURS_IN_MS,
  FIVE_HOURS_IN_MS,
} from "../shared.js";

const url = "https://www.hltv.org/matches";
const teams = ["fnatic", "faze", "nip"];

export const scrapeHLTV = async (DEBUG = false) => {
  const response = await axios.get(url);

  const { data } = response;
  if (DEBUG) console.log("data", data);

  const parsedGames = parseHLTV(data, DEBUG);
  if (DEBUG) console.log("parsedGames", parsedGames);

  const filteredGames = filterGames(parsedGames, DEBUG);
  if (DEBUG) console.log("filteredGames", filteredGames);

  const result = generateHashIds(filteredGames);
  if (DEBUG) console.log("result", result);

  return result;
};

const generateHashIds = (games) => {
  return games.map((game) => {
    const sha256 = crypto.createHash("sha256");

    Object.values(game).forEach((value) => {
      if (value === null) return;
      sha256.update(value.toString());
    });

    game.id = sha256.digest("hex");
    return game;
  });
};

const filterGames = (games, DEBUG) => {
  return games.filter((game) => {
    if (game.team1 && teams.includes(game.team1.toLowerCase())) {
      return true;
    }

    if (game.team2 && teams.includes(game.team2.toLowerCase())) {
      return true;
    }

    if (DEBUG) console.log("None of the teams matches what we search for");
    return false;
  });
};

const parseHLTV = (data, DEBUG) => {
  const $ = cheerio.load(data);

  const _games = $("div.upcomingMatch");

  if (DEBUG) console.log(`_games.length: ${_games.length}`);

  const games = _games.toArray().map((_game) => {
    const details = {
      startDate: null,
      team1: null,
      team2: null,
      id: null,
    };

    const startDate = cheerio(_game).find(".matchTime").first().data("unix");
    if (DEBUG) console.log(`startDate: ${startDate}`);

    const team1 = cheerio(_game)
      .find(".matchTeam.team1 .matchTeamName")
      .first()
      .text()
      .trim();

    const team2 = cheerio(_game)
      .find(".matchTeam.team2 .matchTeamName")
      .first()
      .text()
      .trim();

    if (DEBUG) console.log(`team1: ${team1}, team2: ${team2}`);

    const nrOfMaps = cheerio(_game).find(".matchMeta").first().text().trim();
    if (DEBUG) console.log(`nrOfMaps: ${nrOfMaps}`);

    let endDate = startDate;

    if (nrOfMaps == "bo5") {
      endDate += FIVE_HOURS_IN_MS;
    } else if (nrOfMaps == "bo3") {
      endDate += THREE_HOURS_IN_MS;
    } else {
      endDate += ONE_HOUR_IN_MS;
    }

    if (DEBUG) console.log(`endDate: ${endDate}`);

    details.startDate = startDate;
    details.endDate = endDate;
    details.team1 = team1;
    details.team2 = team2;

    return details;
  });

  return games;
};
