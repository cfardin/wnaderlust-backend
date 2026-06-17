const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
dotenv.config();


app.use(cors());
app.use(express.json());

const PORT = 5000;

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    await client.connect();

    const db = client.db("wanderlust");
    const destinationCollection = db.collection("destinations");
    const bookingCollection = db.collection("booking");


    // api to get all destinations 
    app.get('/destination', async(req, res) =>{
      const result = await destinationCollection.find().toArray();

      res.json(result);
    });

    app.get('/destination/:id', async(req, res) =>{
      const {id} = req.params;
      const result = await destinationCollection.findOne(
        {_id : new ObjectId(id)}
      )
      res.json(result);
    });

    // api for adding destinations in the database
    app.post('/destination', async(req, res) =>{
      const destination = req.body;
      const result = await destinationCollection.insertOne(destination);

      res.json(result);
    });


    // for updating destination data
    app.patch('/destination/:id', async(req, res) =>{
      const {id} = await req.params;
      const updatedData = req.body;

      const result = await destinationCollection.updateOne(
        {_id : new ObjectId(id)},
        {$set : updatedData}
      )

      res.json(result);
    });


    // for deleting destinations 
    app.delete('/destination/:id', async (req, res) =>{
      const {id} = await req.params;
      const result = await destinationCollection.deleteOne({
        _id : new ObjectId(id)
      });

      res.json(result);
    });

    // api for getting all the booking 
    app.get('/booking', async(req, res) => {
      const result = await bookingCollection.find().toArray();

      res.json(result);
    });

    // app.get('/booking/:userId', async(req, res) =>{
    //   const {userId} = await req.params;
    //   const result = await bookingCollection.findOne(
    //     {_id : new ObjectId(userId)}
    //   )

    //   res.json(result);
    // });

    // getting bookings from user id
    app.get('/booking/:userId', async(req, res) => {
      const {userId} = req.params; 
      const result = await bookingCollection.find({userId : userId}).toArray();

      res.json(result);
    });


    // api for adding booking data
    app.post("/booking", async(req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);

      res.json(result);
    });




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Server is running find, fuck u");
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})