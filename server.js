const express = require('express');
const app = express();
const ejs = require("ejs");
const bp = require('body-parser');
const { MongoClient, ObjectId } = require("mongodb");                                                                                                                                      
const url = "mongodb+srv://sahithi:sahithi123@cluster0.kgltdad.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(url);
app.set('view engine', 'ejs');
app.use(bp.urlencoded({ extended: true }));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.get("/",async(req,res)=>{
    const data=await getData();
    console.log(data);
    res.render('home', { data: data });

})
app.get("/form", async (req, res) => {
    res.render('form');
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
         // Fetch the updated data from the database
         const updatedData = await getData();
         data=updatedData;
        
         // Render the home template with the updated data
         res.redirect('/');
    } catch (err) {
        console.log(err.stack);
    }
});



app.delete("/delete/:id", async (req,res)=>{
    try{
        const id=req.params.id;
        await client.connect();
        const database=client.db("mydbs");
        const collection=database.collection("collection");
        const objectId = new ObjectId(id);
        const result=await collection.deleteOne({_id: objectId});
        res.redirect('/');
    }
    catch(err){
        console.log(err.stack);
    }
})
app.post("/like/:id",async(req,res)=>{
    try{
   const id=req.params.id;
   await client.connect();
   const database=client.db('mydbs');
   const collection=database.collection('collection');
   const objectId=new ObjectId(id);
   await collection.updateOne({_id:objectId},{$inc:{likes:1}});
   const updatedData = await getData();
        // Render the home template with the updated data
        res.render("home", {data: updatedData });
}
catch (err) {
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