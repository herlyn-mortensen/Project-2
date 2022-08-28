const express = require ('express')
const cors = require ('cors');
require('dotenv').config();

console.log(process.env);

const mongoUtil = require('./MongoUtil');
const { ObjectID } = require('bson');

const app = express();


app.use(express.json())
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

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

        if (req.query.min_ratings) {
            criteria.ratings = {
                '$gte': parseInt(req.query.min_ratings)
            }
        }


        const reviews = await db.collection('reviews').find(criteria).toArray();
        res.send(reviews);

    
    })



    app.post('/reviews', async function(req,res){
        const results = await db.collection('reviews').insertOne({
            "restaurant": req.body.restaurant,
            "title": req.body.title,
            "cuisine": req.body.cuisine,
            "review": req.body.review,
            "ratings": req.body.ratings
            
        })
        res.json({
            'message':'New review created successfully',
            'results': results
        })
    })
    
    app.put('/reviews/:reviewId', async function(req,res){

        const review = await db.collection('reviews').findOne({
            '_id': ObjectID(req.params.reviewId)
        })

        const results = await db.collection('reviews').updateOne({
            '_id': ObjectID(req.params.reviewId)
            },{
                
                "$set":{
                    'restaurant': req.body.restaurant ? req.body.restaurant : review.restaurant,
                    'title': req.body.title ? req.body.title : review.title,
                    'cuisine': req.body.cuisine ? req.body.cuisine : review.cuisine,
                    'review': req.body.review ? req.body.review : review.review,
                    'ratings': req.body.ratings ? req.body.ratings : review.ratings,
                }
        })

        
        res.json({
            'message':'Review updated',
            'results': results
        })
    })

    app.delete('/reviews/:reviewId', async function (req, res) {
        await db.collection('reviews').deleteOne({
            '_id': ObjectID(req.params.reviewId)
        })
        res.json({
            'message': "Review deleted successfully"
        })
    })

    app.post('/reviews/:reviewId/comments', async function(req,res){
        await db.collection('reviews').updateOne({
            _id: ObjectID(req.params.reviewId)
        },{
            '$push':{
                'comments':{
                    _id: ObjectID(),
                    'content': req.body.content,
                    'nickname': req.body.nickname
                }
            }
        })

        res.json({
            'message': 'Comment has been added successfully',
            'results': results
        })
    })

 }
 
main();

app.listen(3000, function(){
    console.log("server has started")
})