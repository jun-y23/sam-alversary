"use strict";
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI =
    "mongodb+srv://alver-user:hFnAexC6DremxWn2@cluster0.tggax.mongodb.net/alversary?retryWrites=true&w=majority"; // or Atlas connection string

let cachedDb = null;

let day = new Date();

// 'yyyy-mm-dd'
const presentDate = [
    day.getFullYear(),
    ("0" + (day.getMonth() + 1)).slice(-2),
    ("0" + day.getDate()).slice(-2),
].join("-");

// '-mm-dd'
const queryDate = presentDate.slice(4);

function connectToDatabase(uri) {
    console.log("=> connect to database");

    if (cachedDb) {
        console.log("=> using cached database instance");
        return Promise.resolve(cachedDb);
    }

    return MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((client) => {
        const db = client.db("alversary");
        cachedDb = db;
        return cachedDb;
    });
}

async function queryDatabase(db) {
    console.log("=> query database");
    try {
        const albums = await db
            .collection("albums")
            .find({ release_date: { $regex: queryDate } })
            .toArray();
        return albums;
    } catch {
        console.log("error");
    }
}

module.exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    console.log("event: ", event);

    connectToDatabase(MONGODB_URI)
        .then((db) => queryDatabase(db))
        .then((result) => {
            let response = {
                statusCode: 200,
                headers: {},
                body: JSON.stringify(result),
                isBase64Encoded: false,
            };
            callback(null, response);
        })
        .catch((err) => {
            console.log("=> an error occurred: ", err);
            callback(err);
        });
};
