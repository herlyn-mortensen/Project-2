const express = require ('express')
const cors = require ('cors');

const mongoUtil = require('./MongoUtil');

const app = express();


app.use(express.json())
app.use(cors());

async function main (){
    const db = await mongoUtil.connect();
    const reviews = await db.collection('listingsAndReviews').find({}).limit(10).toArray();
    console.log(reviews);

    app.get('/', function(req,res){
        res.json({
           'message':'I love candies and cupcakes'
        });
       })
}
main();

app.listen(3000, function(){
    console.log("server has started")
})