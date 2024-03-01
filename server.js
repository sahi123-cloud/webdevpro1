const express = require('express');
const app = express();
const ejs = require("ejs");
const bp = require('body-parser');
const { MongoClient } = require("mongodb");

// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb+srv://sahithi:sahithi123@cluster0.kgltdad.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to your Atlas cluster
const client = new MongoClient(url);
app.set('view engine', 'ejs');
// Configure body-parser middleware
app.use(bp.urlencoded({ extended: true }));
app.get("/home",(req,res)=>{
    res.render('home');
})
app.get("/", async (req, res) => {
    try {
        const rest = await getData();
        console.log(rest);
        res.render("form");
    } catch (err) {
        console.log(err.stack);
    }
});

app.post("/form", async (req, res) => {
    try {
        await client.connect();
        const database = client.db("mydbs");
        const collection = database.collection("collection");
        const { name, reg, branch, content } = req.body;
        const dataToInsert = {
            name,
            reg,
            branch,
            content
        };
        const result = await collection.insertOne(dataToInsert);
        console.log(result);
        res.render("home");
    } catch (err) {
        console.log(err.stack);
    }
});

async function getData() {
    try {
        await client.connect();
        const database = client.db("mydbs");
        const collection = database.collection("collection");
        const result = await collection.find().toArray();
        return result;
    } catch (err) {
        console.log(err.stack);
    }
}

app.listen(3000, () => {
    console.log('server started');
});
