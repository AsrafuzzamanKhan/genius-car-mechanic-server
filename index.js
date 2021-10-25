const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId

require('dotenv').config()

const app = express();
const port = 5000;
// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6kqiq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');


        // GET api 

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services);

        })

        // GET Single item 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.json(service)
        })

        // POST api 

        app.post('/services', async (req, res) => {

            const service = req.body
            console.log('hit post from api', service)
            const result = await servicesCollection.insertOne(service)
            console.log(result)
            res.json(result)
        });

        // DELETE api 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })

    }
    finally {

    }

}

run().catch(console.dir);


// default route 
app.get('/', (req, res) => {
    res.send('running genius server');
});

// listen port 
app.listen(port, () => {
    console.log('Running genius server on port', port);
})