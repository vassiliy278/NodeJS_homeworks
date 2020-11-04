const mongodb = require('mongodb')
const { MongoClient } = mongodb
const URL = "mongodb+srv://vassiliy:3KxscAHwIQ2afTtd@cluster0.tcyqc.mongodb.net/vassiliy_db?retryWrites=true&w=majority"
const DB_NAME = 'vassiliy_db'
async function main() {
    const client = await MongoClient.connect(URL)
    console.log('Successfully connected to DB')
    const db = client.db(DB_NAME)
    const vassiliyCollection = db.collection('vassiliy_collection')
    // await vassiliyCollection.insertMany([{
    //     name: 'hello',
    //     ndname: 'World'
    // },
    // {
    //     age: 200,
    //     test: true
    // }]);
    console.log(await vassiliyCollection.find({}).toArray())
}

main()

