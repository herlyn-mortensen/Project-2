const express = require ('express')
const cors = require ('cors');

const mongoUtil = require('./MongoUtil');

const app = express();


app.use(express.json())
app.use(cors());

const MONGO_URI = "mongodb+srv://herlynmortensen:EBYB8LMXG4z3Kd3E@demo.m51ld.mongodb.net/?retryWrites=true&w=majority";
const DB_NAME = "restaurant_reviews";

async function main (){
    const db = await mongoUtil.connect(MONGO_URI, DB_NAME);
   

    app.get('/', function(req,res){
        res.json({
           'message':'I love candies and cupcakes'
        });
       })

    app.post('/reviews', async function(req,res){
        await db.collection('reviews').insertOne({
            "restaurant": "Les Amis",
            "title": "Legendary Les Amis",
            "cuisine": "French",
            "review": "Been here many times and each time excellent and 3 michelin star worthy Each dish was exquisite and tasty. As expected, they go all out with the bread selection, amuse bouche, petit fours etc Service is down to earth and equally good.",
            "ratings": 5,
            
        })
        res.json({
            'message':'ok'
        })
       })
}
main();

app.listen(3000, function(){
    console.log("server has started")
})