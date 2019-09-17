const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const crypto = require('crypto');

const options = {
  uri: "https://www.tvmatchen.nu/",
  transform: function (body) {
    return cheerio.load(body);
  }
};

const football_teams = ["Real Madrid", "Malmö FF", "Manchester United"];

const DEBUG = false;


this.scrape = async function () {
  return requestPromise(options)
    .then((response) => {
      if (DEBUG) console.log(response);
      return response;
    })
    .then((response) => {
      return parseTvmatchen(response);
    })
    .then((data) => {
      if (DEBUG) console.log(data)
      return data;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}




function parseTvmatchen($) {
  const matches = $("ul#matches li.match.fotboll"); //$("ul#matches li.match");

  const football_details = matches.map(function() {
    const details = {
      title: null,
      date: null,
      channels: null,
      id: null
    };

    details.title = cheerio(this).find("div.details > h3").text().trim();

    let flag_found_team = false;

    //check if the teams we are searching for is in the entry, otherwise skip this entry
    football_teams.forEach(function (value) {
      if (details.title.indexOf(value) !== -1) {
        flag_found_team = true;
      }
    });

    if (flag_found_team === false) return;

    details.channels = cheerio(this).find("div.details > div.channels > a.channel").map(function () {
      return cheerio(this).attr("title").trim();
    }).get().join(", ");

    const time = cheerio(this).find("time").text().trim();
    const day = cheerio(this).parent().parent().data("hash");
    details.date = Date.parse(day + " " + time);

    const sha256 = crypto.createHash('sha256');

    //hash the info we have from all the values we have that are not null
    Object.values(details).forEach(function (value) {
      if (value === null) return;
      sha256.update(value.toString());
    });

    details.id = sha256.digest('hex');

    return details;
  }).get();

  return football_details;
}

