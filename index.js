const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middlewere 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wueeg5w.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const productCollection = client.db('kiddieDB').collection('product');
        const reviewCollection = client.db('kiddieDB').collection('reviews');
        const orderCollection = client.db('kiddieDB').collection('order');


        app.get('/product', async (req, res) => {
            const result = await productCollection.find().sort({ _id: -1 }).toArray()
            res.send(result)
        })
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id)};
            const result = await productCollection.findOne(query)
            res.send(result)
        })
        app.post('/product', async (req, res)=>{
            const product = req.body;
            const result = await productCollection.insertOne(product)
            res.send(result)
        })

        app.get('/myproduct', async(req, res)=>{
            const email = req.query.email;
            const query = {email : email};
            const result =await productCollection.find(query).toArray()
            res.send(result)
        })
        app.put('/myproduct/:id', async (req, res) => {
            const id = req.params.id;
            const UpdateProduct = req.body;
            console.log(UpdateProduct);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const update = {
              $set: {
                
                name: UpdateProduct.name,
                brand: UpdateProduct.brand,
                price: UpdateProduct.price,
                rating: UpdateProduct.rating,
                type: UpdateProduct.type,
                details: UpdateProduct.details,
                image: UpdateProduct.image
              }
            }
            const result = await productCollection.updateOne(filter, update, options)
            res.send(result)
          })

        app.post('/order', async (req, res)=>{
            const OrderProduct = req.body;
            const result = await orderCollection.insertOne(OrderProduct)
            res.send(result)
        })
        
        app.delete('/myorder/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result =await orderCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/orders', async(req, res)=>{
            const clintEmail = req.query.clintEmail;
            const query = {clintEmail : clintEmail};
            const result =await orderCollection.find(query).toArray()
            res.send(result)
        })



        app.get('/review', async (req, res) => {
            const result = await reviewCollection.find().sort({ _id: -1 }).toArray()
            res.send(result)
        })
        app.post('/review', async (req, res)=>{
            const review = req.body;
            console.log(review);
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })

        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('baby is playing')
})

app.listen(port, () => {
    console.log(`baby is playing on port ${port}`);
})
