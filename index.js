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

    app.get('/reviews', async function(req,res){
        
        let criteria = {};

        if(req.query.restaurant) {
            criteria.restaurant = {
                '$regex': req.query.restaurant,
                '$options': 'i'
            }
        }

        console.log("criteria=", criteria);

        const reviews = await db.collection('reviews').find({criteria}).toArray();
        res.json(reviews);
    })


    app.post('/reviews', async function(req,res){
        await db.collection('reviews').insertOne({
            "restaurant": req.body.restaurant,
            "title": req.body.title,
            "cuisine": req.body.cuisine,
            "review": req.body.review,
            "ratings": req.body.ratings
            
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