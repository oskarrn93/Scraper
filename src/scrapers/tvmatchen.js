const axios = require("axios");
const cheerio = require("cheerio");
const crypto = require("crypto");
const parse = require("date-fns/parse");
const addHours = require("date-fns/addHours");
const { parseFromTimeZone } = require("date-fns-timezone");

const url = "https://www.tvmatchen.nu/";
const teams = [
  "Real Madrid",
  "Malmö FF",
  "Manchester United",
  "Paris Saint Germain",
  "FC Bayern München",
];

const scrapeTvMatchen = async (DEBUG = false) => {
  const response = await axios.get(url);
  const { data } = response;

  const parsedGames = parseTvmatchen(data, DEBUG);
  return parsedGames;
};

function parseTvmatchen(data, DEBUG) {
  const $ = cheerio.load(data);

  const matches = $(".match-list > div");

  if (DEBUG) console.log(`matches length: ${matches.length}`);

  const football_details = matches
    .map(function () {
      const details = {
        title: null,
        startDate: null,
        endDate: null,
        channels: null,
        id: null,
      };

      details.title = cheerio(this)
        .find(".match-detail h3")
        .first()
        .text()
        .trim();

      let flag_found_team = false;

      //check if the teams we are searching for is in the entry, otherwise skip this entry
      teams.forEach(function (value) {
        if (details.title.indexOf(value) !== -1) {
          flag_found_team = true;
        }
      });

      if (flag_found_team === false) return;

      details.channels = cheerio(this)
        .find(".match-channels li a img")
        .map(function () {
          return cheerio(this).attr("alt").trim();
        })
        .get()
        .join(", ");

      const time = cheerio(this).find(".match-time").first().text().trim();
      const date = cheerio(this).parent().parent().data("date");

      details.startDate = parseFromTimeZone(
        parse(`${date} ${time}`, "yyyy-MM-dd HH:mm", new Date()),
        {
          timeZone: "Europe/Berlin",
        }
      );

      details.endDate = addHours(details.startDate, 2);

      const sha256 = crypto.createHash("sha256");

      //hash the info we have from all the values we have that are not null
      Object.values(details).forEach(function (value) {
        if (value === null) return;
        sha256.update(value.toString());
      });

      details.id = sha256.digest("hex");

      return details;
    })
    .get();

  return football_details;
}

module.exports = scrapeTvMatchen;
