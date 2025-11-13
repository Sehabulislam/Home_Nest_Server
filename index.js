const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://homeNestDB:fYq9YpkpuYUQcF4j@cluster0.cjsthkf.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Home Nest server is available");
});

async function run() {
  try {
    await client.connect();

    const homeNestDB = client.db("homeNestDB");
    const propertiesCollection = homeNestDB.collection("allProperties");

    //properties related api
    app.get("/allProperties", async (req, res) => {
      const cursor = propertiesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/featuredProperties", async (req, res) => {
      const cursor = propertiesCollection
        .find()
        .sort({ postedDate: 1 })
        .limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/allProperties", async (req, res) => {
      const newProperties = req.body;
      const result = await propertiesCollection.insertOne(newProperties);
      res.send(result);
    });
    app.get("/propertyDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await propertiesCollection.findOne(query);
      res.send(result);
    });
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
