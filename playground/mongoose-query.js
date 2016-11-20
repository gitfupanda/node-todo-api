const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var todoId = '58314b862889d306a82feae8'

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todos) => {
//     console.log('Todo', todos);
// });

// if (!ObjectID.isValid(todoId)){
//     console.log("Todo id not valid");
// }

// Todo.findById(todoId).then((todo) => {
//     if (!todo){
//         return console.log('todo not found')
//     }
//     console.log('Todo', todo);
// }).catch((error) => {
//     console.log(error);
// })

var userId = '583016722f52bd18747edcb5';

if (ObjectID.isValid(userId)){
    User.findById(userId).then((user) => {
        if (!user){
            return console.log('user not found');
        }
        console.log("User", user);
    }).catch((e) => {
        console.log(e);
    });
}
else{
    console.log("Invlaid User Id");
}

