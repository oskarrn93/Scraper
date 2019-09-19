const tvmatchen = require("./tvmatchen.js");
const MongoClient = require("mongodb").MongoClient;
const mongo_url = "mongodb://localhost:27017/";
const mongo_database_name = "upcoming";

const DEBUG = false;


async function doTvmatchen(){
  const data = await getDataFromTvmatchen();
  saveDataToDatabase(data, "football")
}
async function getDataFromTvmatchen() {
  const data = await tvmatchen.scrape();
  if (DEBUG) console.log(data);

  return data; 
}



async function saveDataToDatabase(data, collection_name) {
  
  try {
    await removeAllFromCollection(collection_name);
  }
  catch (error) {
    console.error(error)
    return;
  }

  try {
    await insertToCollection(collection_name, data);
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

      const db = client.db(mongo_database_name);
      db.collection(collection_name).deleteMany();

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

      const db = client.db(mongo_database_name);
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



function main() {
  doTvmatchen();
}

main();

