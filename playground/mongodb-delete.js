//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(error, db) => {
    if (error){
        return console.log('Unable to connect to MongoDB');
    }

    console.log('Connected to MongoDB');

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Do this asap'})
    // .then((result) => {
    //     console.log(result);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Do Something'})
    // .then((result) => {
    //     console.log(result);
    // });

    // findOneAndDelete
    db.collection('Todos').findOneAndDelete({text: 'Do Something'})
    .then((result) => {
        console.log(result);
    });

    //db.close();
});

