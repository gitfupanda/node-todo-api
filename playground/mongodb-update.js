//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(error, db) => {
    if (error){
        return console.log('Unable to connect to MongoDB');
    }

    console.log('Connected to MongoDB');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('582ffb412b18b883ec02080d')
    // }, {
    //     $set: {
    //         completed: true
    //     }  
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // })

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('582fd7194f0e3f00b4755f0b')
    }, {
        $set: {
            name: 'Dick Smith'
        },
        $inc: {
            age: 1
        }  
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })

    //db.close();
});

