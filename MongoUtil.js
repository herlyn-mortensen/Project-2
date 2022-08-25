const MongoClient = require('mongodb').MongoClient;

async function connect() {
    const client = await MongoClient.connect("mongodb+srv://herlynmortensen:EBYB8LMXG4z3Kd3E@demo.m51ld.mongodb.net/?retryWrites=true&w=majority", {
        useUnifiedTopology: true
    })

    //const db = client.db('restaurant_reviews');
    const db = client.db('sample_airbnb');
    return db;
}

module.exports = {connect};