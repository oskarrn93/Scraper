const tvmatchen = require("./tvmatchen.js");
const MongoClient = require("mongodb").MongoClient;
const mongo_url = "mongodb://localhost:27017/";

const DEBUG = false;

async function scrapeTvmatchen() {
  const data = await tvmatchen.scrape();
  if (DEBUG) console.log(data);

  try {
    await removeAllFromCollection("football");
  }
  catch (error) {
    console.error(error)
    return;
  }

  try {
    await insertToCollection("football", data);
  }
  catch (error) {
    console.error(error)
    return;
  }
  
}

function removeAllFromCollection(collection_name) {
  if (DEBUG) console.log("removeAllFromCollection")

  return new Promise((resolve, reject) => {
    MongoClient.connect(mongo_url, function(error, client) {
      if (error) return reject(error);

      const db = client.db("upcoming");
      db.collection(collection_name).remove();

      if (DEBUG) console.log("done deleting")
      
      client.close();
      return resolve();
    })
  });
}

function insertToCollection(collection_name, data) {
  if (DEBUG) console.log("insertToCollection")

  return new Promise((resolve, reject) => {
    MongoClient.connect(mongo_url, function(error, client) {
      if (error) return reject(error);

      const db = client.db("upcoming");
      db.collection(collection_name).insertMany(data, function(error, result) {
        if (error) return reject(error);

        if (DEBUG) console.log(result)
        if (DEBUG) console.log("done inserting")

        client.close();
        return resolve();
      });
    });
  });
}

scrapeTvmatchen();
