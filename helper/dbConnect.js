const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.DATABASE_URI);

exports.run = async () => {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });

    console.log("Connected successfully to DB server");

    return client;
  } catch {
    console.log("DB server connection failure");
  }
};
