import mongodb from "mongodb";
import { scrapeTvMatchen } from "./tvmatchen.js";
import { scrapeNBA } from "./nba.js";
import { scrapeHLTV } from "./hltv.js";

const mongodbName = "upcoming";
const mongodbURL = `mongodb://localhost:27017/${mongodbName}`;

let DEBUG = false;

const mongoclient = new mongodb.MongoClient(mongodbURL, {
  native_parser: true,
  useUnifiedTopology: true,
  useNewUrlParser: true
});

async function doNBA(dbHandler) {
  const data = await getDataFromNBA();
  saveDataToDatabase(dbHandler, data, "nba");
}

async function getDataFromNBA() {
  try {
    const data = await scrapeNBA();
    if (DEBUG) console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function doTvmatchen(dbHandler) {
  const data = await getDataFromTvmatchen();
  saveDataToDatabase(dbHandler, data, "football");
}

async function getDataFromTvmatchen() {
  try {
    const data = await scrapeTvMatchen();
    if (DEBUG) console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function doHLTV(dbHandler) {
  const data = await getDataFromHLTV();
  saveDataToDatabase(dbHandler, data, "cs");
}

async function getDataFromHLTV() {
  try {
    const data = await scrapeHLTV();
    if (DEBUG) console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function saveDataToDatabase(dbHandler, data, collectionName) {
  try {
    await removeAllFromCollection(dbHandler, collectionName);
  } catch (error) {
    console.error(error);
    return;
  }

  try {
    await insertToCollection(dbHandler, collectionName, data);
  } catch (error) {
    console.error(error);
    return;
  }
}

function removeAllFromCollection(dbHandler, collectionName) {
  if (DEBUG) console.log("removeAllFromCollection");

  return new Promise((resolve, reject) => {
    dbHandler.collection(collectionName).deleteMany();
    return resolve();
  });
}

function insertToCollection(dbHandler, collectionName, data) {
  if (DEBUG) console.log("insertToCollection");

  return new Promise((resolve, reject) => {
    dbHandler
      .collection(collectionName)
      .insertMany(data, function(error, result) {
        if (error) return reject(error);

        if (DEBUG) console.log(result);
        if (DEBUG) console.log("done inserting");

        return resolve();
      });
  });
}

function scrapeAll(dbHandler) {
  doTvmatchen(dbHandler);
  doNBA(dbHandler);
  doHLTV(dbHandler);
}

function main() {
  const args = process.argv.slice(2);

  try {
    mongoclient.connect(async err => {
      if (err) throw err;

      const dbHandler = mongoclient.db("upcoming");

      args.forEach(function(arg) {
        if (arg == "football") {
          doTvmatchen(dbHandler);
        } else if (arg == "nba") {
          doNBA(dbHandler);
        } else if (arg == "cs") {
          doHLTV(dbHandler);
        } else if (arg == "all") {
          scrapeAll(dbHandler);
        } else if (arg == "debug") {
          DEBUG = true;
        } else {
          console.error(`argument ${arg} is not supported`);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}

main();
