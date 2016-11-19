//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(error, db) => {
    if (error){
        return console.log('Unable to connect to MongoDB');
    }

    console.log('Connected to MongoDB');

    // db.collection('Todos').insertOne({
    //     text: 'Do this asap',
    //     completed: false
    // }, (error, result) => {
    //     if (error){
    //         return console.log('Unable to insert todo', error);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'John Smith',
    //     age: 30,
    //     location: 'New Zealand'
    // }, (error, result) => {
    //     if (error){
    //         return console.log('Unable to insert user', error);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.close();
});