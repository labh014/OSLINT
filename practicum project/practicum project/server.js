const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { getJson } = require("serpapi");

const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri);
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection and route
app.post('/user', async (req, res) => {
    try {
        await client.connect();
        console.log('Connected to the database');
        
        const database = client.db('leaked_numbers');
        const collection = database.collection('shopping_site');
        
        const phone = parseInt(req.body.phone);
        const documents = await collection.find({ phoneNumber: phone }).toArray();
        
        if (documents.length !== 0) {
            console.log(documents[0]);
            res.send(documents[0]);
        } else {
            const cars = ["Saab", "Volvo", "BMW"];
            res.send(cars);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// SerpApi route
app.post('/getUserData', async (req, res) => {
    try {
        const { image_url } = req.body;

        getJson({
            engine: "google_reverse_image",
            image_url,
            api_key: "c135fa039a0d2f01447e4fea7398b8edd044dd280b2642abceb97fbae5115fd1"
        }, (error, json) => { // Add error parameter
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            console.log(json["inline_images"]);
            res.json({ valid: json["inline_images"] });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
