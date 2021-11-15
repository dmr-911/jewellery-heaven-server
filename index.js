const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jycgq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("nicheProductsWebsite");
    const productCollection = database.collection("products");
    // create a document to insert

    app.get('/products', async(req, res)=>{
      const cursor = productCollection.find({}).limit(6);
      const result = await cursor.toArray();
      res.json(result);
    });

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})