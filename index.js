const express = require("express");
const cors = require("cors");
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(express.json());
app.use(cors());

const uri =
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.cjsthkf.mongodb.net/?appName=Cluster0`;

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
    // await client.connect();

    const homeNestDB = client.db("homeNestDB");
    const propertiesCollection = homeNestDB.collection("allProperties");
    const ratingsCollection = homeNestDB.collection("allRatings");

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
    app.get("/search", async (req, res) => {
      const searchValue = req.query.search;
      const result = await propertiesCollection
        .find({
          propertyName: { $regex: searchValue, $options: "i" },
        })
        .toArray();
      res.send(result);
    });
    app.get("/propertyDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await propertiesCollection.findOne(query);
      res.send(result);
    });
    app.get("/myProperties", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.seller_Email = email;
      }
      const cursor = propertiesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/updateProperty/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await propertiesCollection.findOne(query);
      res.send(result);
    });
    app.put("/myProperties/:id", async (req, res) => {
      const id = req.params.id;
      const updateProperty = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          propertyName: updateProperty.propertyName,
          category: updateProperty.category,
          description: updateProperty.description,
          price: updateProperty.price,
          location: updateProperty.location,
          image: updateProperty.image,
        },
      };
      const option = {};
      const result = await propertiesCollection.updateOne(
        query,
        update,
        option
      );
      res.send(result);
    });
    app.delete("/myProperties/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await propertiesCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/myRatings", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.reviewer_Email = email;
      }
      const cursor = ratingsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/myRatings", async (req, res) => {
      const newRating = req.body;
      const result = await ratingsCollection.insertOne(newRating);
      res.send(result);
    });
    // await client.db("admin").command({ ping: 1 });
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
