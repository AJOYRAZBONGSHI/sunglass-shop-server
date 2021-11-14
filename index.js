const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// Database connection Link
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jj7fr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Digital_Service");
    const productCollection = database.collection("services");
    const deliveryCollection = database.collection("delivery");
    const productInfoCollection = database.collection("addProductInfo");

    // GET API
    app.get("/services", async (req, res) => {
      const cursor = productCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // Post api Services
    app.post("/services", async (req, res) => {
      const service = req.body;

      const result = await productCollection.insertOne(service);
      res.json(result);
    });

    // GET API AddProductInfo

    app.get("/addProductInfo", async (req, res) => {
      const cursor = productInfoCollection.find({});
      const addProductInfo = await cursor.toArray();
      res.send(addProductInfo);
    });

    // Add Product Info

    app.post("/addProductInfo", async (req, res) => {
      const addProductInfo = req.body;
      const result = await productInfoCollection.insertOne(addProductInfo);
      res.json(result);
    });

    // Delete Api & Delete Dta

    app.delete("/addProductInfo/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await productInfoCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    // GET API delivery
    app.get("/delivery", async (req, res) => {
      const cursor = deliveryCollection.find({});
      const delivery = await cursor.toArray();
      res.send(delivery);
    });

    // POST API Delivery
    app.post("/delivery ", async (req, res) => {
      const delivery = req.body;
      const result = await deliveryCollection.insertOne(delivery);
      console.log(result);

      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running My Server");
});

app.listen(port, () => {
  console.log("Running Assignment-12 Server on port", port);
});
