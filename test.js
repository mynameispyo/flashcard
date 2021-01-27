const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb+srv://user:PqwT8gDXmD171D9H@cluster0.d9ri5.mongodb.net/user?retryWrites=true&w=majority';

async function findOne() {

    const client = await MongoClient.connect(url)
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        let collection = await client.db("Flashcards").collection('Auth');

        let res = await collection.find({user:"info@page.ml"}).toArray();

        console.log(res);

    } catch (err) {

        console.log(err);
    } finally {

        client.close();
    }
}

findOne();
