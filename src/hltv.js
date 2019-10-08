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

  const _matches = $("div.upcoming-matches div.match-day table tbody tr");

  console.log (_matches.length)


  
  const mapped_matches = _matches.map(function() {
    const details = {
      title: null,
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

    details.title = `${team1} - ${team2}`;
    details.timestamp = timestamp;
    details.team1 = team1;
    details.team2 = team2;

    return details;
  }).map(function(){
    return this.toArray();
  });

  const filtered_matches = mapped_matches.filter(function() {

    console.log(this.title)
    if(this.team1 && cs_teams.includes(this.team1.toLowerCase())) {     
      return true;
    }

    if(this.team2 && cs_teams.includes(this.team2.toLowerCase())) {     
      return true;
    }
    


    if(DEBUG) console.log("None of the teams matches what we search for")
    return false;
  
  });

  console.log(filtered_matches)

  return "hej"
  

  //console.log(matches[0].children);
  /*const football_details = matches
    .map(function() {
      const details = {
        title: null,
        date: null,
        channels: null,
        id: null
      };

      details.title = cheerio(this)
        .find("div.details > h3")
        .text()
        .trim();

      let flag_found_team = false;

      //check if the teams we are searching for is in the entry, otherwise skip this entry
      football_teams.forEach(function(value) {
        if (details.title.indexOf(value) !== -1) {
          flag_found_team = true;
        }
      });

      if (flag_found_team === false) return;

      details.channels = cheerio(this)
        .find("div.details > div.channels > a.channel")
        .map(function() {
          return cheerio(this)
            .attr("title")
            .trim();
        })
        .get()
        .join(", ");

      const time = cheerio(this)
        .find("time")
        .text()
        .trim();
      const day = cheerio(this)
        .parent()
        .parent()
        .data("hash");
      details.date = Date.parse(day + " " + time);

      const sha256 = crypto.createHash("sha256");

      //hash the info we have from all the values we have that are not null
      Object.values(details).forEach(function(value) {
        if (value === null) return;
        sha256.update(value.toString());
      });

      details.id = sha256.digest("hex");

      return details;
    })
    .get();

  return football_details;*/
}


this.scrape();