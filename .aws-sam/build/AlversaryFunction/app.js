let MongoClient = require("mongodb").MongoClient;

const client = new MongoClient(
    "mongodb+srv://alver-user:hFnAexC6DremxWn2@cluster0.tggax.mongodb.net/alversary?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

async function connect() {
    if (!client.isConnected()) await client.connect();
    const db = client.db("alversary");

    return { db, client };
}

export { connect };
