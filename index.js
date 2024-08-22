require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Middleware//
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.plfcipz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    // Mongo collection name added
    const All = client.db("PRB9-A10").collection("AllCraft");

    // post operation started at All Craft
    app.post("/all", async (req, res) => {
      const add = req.body;
      const result = await All.insertOne(add);
      res.send(result);
    });

    // get operation for All craft start here
    app.get("/all", async (req, res) => {
      const items = All.find();
      const result = await items.toArray();
      res.send(result);
    });

    // update added books
    app.patch("/all/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const upItems = req.body;
      const upDoc = {
        $set: upItems,
      };
      const result = await All.updateOne(filter, upDoc);
      res.send(result);
    });

    // delete operation for Mycraft data
    app.delete("/all/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await All.deleteOne(query);
      res.send(result);
    });

    //filter data for unique email
    app.get("/mail", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await All.find(query).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("PRB9-A10 is running");
});

app.listen(port, () => {
  console.log(`PRB9-A10 is running on port : ${port}`);
});
