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
    const ordersCollection = database.collection("orders");
    const reviewsCollection = database.collection("reviews");
    // create a document to insert

    // GET Api
    app.get('/products', async (req, res) => {
      const query = req.query.home;
      let cursor;
      if (query) {

        cursor = productCollection.find({}).limit(6);
      }
      else {
        cursor = productCollection.find({});
      }
      const result = await cursor.toArray();
      res.json(result);
    });

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    app.get('/orders', async (req, res) => {
      const email = req.query.email;
      let cursor;
      if (email) {
        cursor = ordersCollection.find({ email: email })
      }
      else {
        cursor = ordersCollection.find({});
      }
      const result = await cursor.toArray();
      res.json(result);
    });

    app.get('/reviews', async(req, res)=>{
      const cursor = reviewsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    })


    // POST Api
    app.post('/products', async(req, res)=>{
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.json(result);
    });

    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });
    app.post('/reviews', async (req, res)=>{
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.json(result);
    })


    // PUT Api
    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };

      const updateDoc = {
        $set: user
      };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersCollection.updateOne(filter, updateDoc);
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