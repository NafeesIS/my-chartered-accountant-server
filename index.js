const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

//middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.szch3sf.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const accountantCollection = client
      .db("Accountant")
      .collection("accountant_details");

    app.get("/accountant_details", async (req, res) => {
      const accountants = accountantCollection.find();
      const result = await accountants.toArray();
      res.send(result);
    });

    app.get("/accountant_details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await accountantCollection.findOne(query);
      res.send(result);
    });
    app.get("/accountant_by_name", async (req, res) => {
      const name = req.query.name;
      query = { name: { $regex: name, $options: "i" } };
      const result = await accountantCollection
        .find(query, {
          projection: { _id: 1, name: 1 },
        })
        .toArray();
      //   console.log(result);
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
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`Accountant Name server is running on port ${port}`);
});
