const { MongoClient } = require("mongodb");
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");

const uri = "mongodb+srv://admin:Password123@cluster0.6t9m7.mongodb.net/covid?retryWrites=true&w=majority"
const client = new MongoClient(uri);

async function main() {
    try {
      await client.connect();
      const db = client.db();
      const results = await db.collection("infections").find({}).count();

    if (results) {
        console.info("deleting collection");
        await db.collection("infections").drop();
    }

    const load = loading("importing your Covid-19 Data 🦠!!").start();

    const data = await fs.readFile(path.join(__dirname, "covid.json"), "utf8");
    await db.collection("infections").insertMany(JSON.parse(data));

    await db.collection("infections").aggregate([
        { $group: { _id: "$country" } },
        { $project: { name: "$_id", "_id": 0 } },
        { $out: "countries" }
    ]).toArray()

    await db.collection("infections").aggregate([
        { $group: { _id: "$county" } },
        { $project: { name: "$_id", "_id": 0 } },
        { $out: "counties" }
    ]).toArray()
    
    await db.collection("infections").aggregate([
        { $group: { _id: "$name" } },
        { $project: { name: "$_id", "_id": 0 } },
        { $out: "unis" }
    ]).toArray()

    await db.collection("infections").aggregate([
        { $group: { _id: "$city" } },
        { $project: { name: "$_id", "_id": 0 } },
        { $out: "cities" }
    ]).toArray()
    
  
    load.stop();
    console.info(
        `Infections collection set up! 🦠🦠🦠🦠🦠`
    );
    process.exit();
    
    } catch (error) {
      console.error("error:", error);
      process.exit();
    }
  }
  
  main();