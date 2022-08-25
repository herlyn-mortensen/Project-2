const MongoClient = require('mongodb').MongoClient;

async function connect(mongoUri, databaseName) {
    const client = await MongoClient.connect(mongoUri,{
        useUnifiedTopology: true
    })

    const db = client.db(databaseName);
    //const db = client.db('sample_airbnb');
    return db;
}

module.exports = {connect};