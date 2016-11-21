const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// Todo.remove({}).then((res) => {
//     console.log(res);
// })

Todo.findByIdAndRemove('583299781fc37f0b08995364').then((removedTodo) => {
    console.log(removedTodo);
}).catch((ex) => {
    console.log("error ", ex );
});