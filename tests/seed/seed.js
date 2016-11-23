const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
var {Todo} = require('./../../server/models/todo');
var {User} = require('./../../server/models/user');

const todos =[{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};


const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'UserOne@domain.com',
    password: 'User1Pass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'UserTwo@domain.com',
    password: 'User2Pass'
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
};


module.exports = {
    todos, 
    populateTodos,
    users,
    populateUsers
};