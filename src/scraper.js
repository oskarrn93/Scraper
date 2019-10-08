const tvmatchen = require("./tvmatchen.js");
const nba = require("./nba.js");
const hltv = require("./hltv.js");
const MongoClient = require("mongodb").MongoClient;
const mongo_url = "mongodb://localhost:27017/";
const mongo_database_name = "upcoming";

let DEBUG = false;

async function doNBA() {
  const data = await getDataFromNBA();
  saveDataToDatabase(data, "nba");
}

async function getDataFromNBA() {
  try {
    const data = await nba.scrape();
    if (DEBUG) console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function doTvmatchen() {
  const data = await getDataFromTvmatchen();
  saveDataToDatabase(data, "football");
}

async function getDataFromTvmatchen() {
  try {
    const data = await tvmatchen.scrape();
    if (DEBUG) console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function doHLTV() {
  const data = await getDataFromHLTV();
  saveDataToDatabase(data, "cs");
}

async function getDataFromHLTV() {
  try {
    const data = await hltv.scrape();
    if (DEBUG) console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function saveDataToDatabase(data, collection_name) {
  try {
    await removeAllFromCollection(collection_name);
  } catch (error) {
    console.error(error);
    return;
  }

  try {
    await insertToCollection(collection_name, data);
  } catch (error) {
    console.error(error);
    return;
  }
}

function removeAllFromCollection(collection_name) {
  if (DEBUG) console.log("removeAllFromCollection");

  return new Promise((resolve, reject) => {
    MongoClient.connect(mongo_url, function(error, client) {
      if (error) return reject(error);

      const db = client.db(mongo_database_name);
      db.collection(collection_name).deleteMany();

      if (DEBUG) console.log("done deleting");

      client.close();
      return resolve();
    });
  });
}

function insertToCollection(collection_name, data) {
  if (DEBUG) console.log("insertToCollection");

  return new Promise((resolve, reject) => {
    MongoClient.connect(mongo_url, function(error, client) {
      if (error) return reject(error);

      const db = client.db(mongo_database_name);
      db.collection(collection_name).insertMany(data, function(error, result) {
        if (error) return reject(error);

        if (DEBUG) console.log(result);
        if (DEBUG) console.log("done inserting");

        client.close();
        return resolve();
      });
    });
  });
}

function scrapeAll() {
  doTvmatchen();
  doNBA();
  doHLTV();
}

function main() {
  const args = process.argv.slice(2);
 
  args.forEach(function (arg) {
    if(arg == "football") {
      doTvmatchen();
    }
    else if(arg == "nba") {
      doNBA();
    }
    else if(arg == "cs") {
      doHLTV();
    }
    else if(arg == "all") {
      scrapeAll();
    }
    else if(arg == "debug") {
      DEBUG = true;
    }
    else {
      console.error(`argument ${arg} is not supported`);
    }
  });
}

main();