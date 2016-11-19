//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(error, db) => {
    if (error){
        return console.log('Unable to connect to MongoDB');
    }

    console.log('Connected to MongoDB');

    // db.collection('Todos').find({
    //     _id: new ObjectID('582fd67a0897fc0ac41aca55')
    // })
    // .toArray()
    // .then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }).catch((error) => {
    //     console.log('Unable to fetch todos', error);
    // });

    db.collection('Todos').find().count()
    .then((count) => {
        console.log(`Todos: ${count}`);        
    }).catch((error) => {
        console.log('Unable to fetch todos', error);
    });

    db.collection('Users').find({
        location: 'New Zealand'
    })
    .toArray()
    .then((docs) => {
        console.log('Users in New Zealand');
        console.log(JSON.stringify(docs, undefined, 2));
    }).catch((error) => {
        console.log('Error getting users in New Zealand');
    })

    //db.close();
});