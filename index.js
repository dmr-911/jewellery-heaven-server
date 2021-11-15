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
    const usersCollection = database.collection("users");
    // create a document to insert

    app.get('/products', async(req, res)=>{
      const query = req.query.home;
      let cursor ;
      if(query){

        cursor = productCollection.find({}).limit(6);
      }
      else{
        cursor = productCollection.find({});
      }
      const result = await cursor.toArray();
      res.json(result);
    });

    // POST Api
    app.post('/users', async(req, res)=> {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    app.put('/users', async(req, res)=>{
      const user = req.body;
      const filter = {email : user.email};
      const options = {upsert: true};

      const updateDoc = {
        $set: user
      };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    })

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