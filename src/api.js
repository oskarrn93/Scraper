const MongoClient = require("mongodb").MongoClient;
const mongo_url = "mongodb://localhost:27017/";

const express = require("express");
const cors = require("cors");
const app = express();
//const fs = require('fs');
const ical = require("ical-generator");

const PORT = process.env.PORT || 8001;

const domain = "oskarrosen.com";
const url = `https://oskarrosen.com:${PORT}`;

app.use(cors());

app.get("/status", function(req, res) {
  console.log("/status");
  res.send({ status: "ok" });
});

app.get("/cs", function(req, res) {
  console.log("/cs");

  getUpcoming("cs", function(result) {
    //console.log(result);
    res.send(result);
  });
});

app.get("/football", function(req, res) {
  console.log("/football");

  getUpcoming("football", function(result) {
    // console.log(result);
    res.send(result);
  });
});

app.get("/nba", function(req, res) {
  console.log("/nba");

  getNBAGames(function(result) {
    res.send(result);
  });
});

app.get("/calendar/football", function(req, res) {
  console.log("/calendar/football");

  var cal_football = ical({
    domain: domain,
    name: "Fotball Matches",
    url: url + "/calendar/football",
    prodId: "//Oskar Rosen//Football Games//EN",
    ttl: 3600,
    timezone: "Europe/Berlin"
  });
  var time_now = Math.round(Date.now() / 1000);
  getUpcoming("football", function(fotball_events) {
    for (var a = 0; a < fotball_events.length; a++) {
      const event = fotball_events[a];

      if (isNaN(event.date)) continue;

      console.log(event.date);
      console.log(new Date(event.date));
      console.log(new Date(Math.round(event.date * 1000)));

      const start = new Date(event.date);
      const end = new Date(start.getTime() + 7200000);

      console.log(event);
      console.log(start);
      console.log(end);
      cal_football.createEvent({
        start: start,
        end: end, //2 hours
        summary: event.title,
        description: event.channels,

        uid: "football-games-" + event._id
      });
    }

    res.setHeader("Content-type", "application/octet-stream");
    res.setHeader("Content-disposition", "attachment; filename=football.ics");
    res.send(cal_football.toString().replace(/(?:\r\n)/g, "\n"));
    // res.send(cal_football.toString()); //.replace(/(?:\r\n)/g, '\n')
  });
});

app.get("/calendar/nba", function(req, res) {
  console.log("/calendar/nba");

  var calendar = ical({
    domain: domain,
    name: "NBA Games",
    url: url + "/calendar/nba",
    prodId: "//Oskar Rosen//NBA Games//EN",
    ttl: 3600,
    timezone: "Europe/Berlin"
  });

  getNBAGames(function(games) {
    var game = null;
    var start_time = null;

    for (var a = 0; a < games.length; a++) {
      game = games[a];
      start_time = new Date(game.timestamp);
      console.log(start_time);

      calendar.createEvent({
        start: start_time,
        end: new Date(start_time.getTime() + 10800000), //3 hours
        summary: game.away_team + " - " + game.home_team,
        description: game.away_team + " - " + game.home_team,
        location: game.location,
        url: "http://stats.nba.com/schedule/",
        uid: "nba-games-" + game._id
      });
    }
    res.setHeader("Content-type", "application/octet-stream");
    res.setHeader("Content-disposition", "attachment; filename=nba.ics");
    res.send(calendar.toString().replace(/(?:\r\n)/g, "\n"));
  });
});

app.get("/calendar/cs", function(req, res) {
  console.log("/calendar/cs");

  var cal_cs = ical({
    domain: domain,
    name: "CS Matches",
    url: url + "/calendar/cs",
    prodId: "//Oskar Rosen//CS Matches//EN",
    ttl: 3600,
    timezone: "Europe/Berlin"
  });
  var time_now = Math.round(Date.now() / 1000);
  getUpcoming("cs", function(result) {
    //var cs_events = result.filter(event => event.date > time_now);

    var cs_events = result;

    var event = null,
      start = null;
    for (var a = 0; a < cs_events.length; a++) {
      event = cs_events[a];
      start = new Date(Math.round(event.date * 1000));

      cal_cs.createEvent({
        start: start,
        end: new Date(start.getTime() + 3600000), //1 hour
        summary: event.team1 + " - " + event.team2,
        description: event.url,
        uid: "cs-games-" + event._id
      });
    }
    res.setHeader("Content-type", "application/octet-stream");
    res.setHeader("Content-disposition", "attachment; filename=cs.ics");
    res.send(cal_cs.toString()); //replace(/(?:\r\n)/g, '\n')
  });
});

app.listen(PORT, function() {
  console.log(`CORS-enabled web server listening on port ${PORT}`);
});

function getUpcoming(SPORT, callback) {
  MongoClient.connect(mongo_url, function(error, client) {
    if (error) {
      throw error;
    }

    const db = client.db("upcoming");

    db.collection(SPORT)
      .find({})
      .toArray(function(error, result) {
        if (error) {
          throw error;
        }

        callback(result);
      });

    //client.close();
  });
}

function getNBAGames(callback) {
  MongoClient.connect(mongo_url, function(error, client) {
    if (error) {
      console.error(error);
      throw error;
    }

    const db = client.db("upcoming");

    db.collection("nba")
      .find({})
      .toArray(function(error, result) {
        if (error) {
          console.error(error);
          throw error;
        }

        callback(result);
        //client.close();
      });
  });
}
