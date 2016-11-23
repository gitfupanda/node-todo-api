const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
var {Todo} = require('./../../server/models/todo');
var {User} = require('./../../server/models/user');

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
    password: 'User2Pass',tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
    }]
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
};

const todos =[{
    _id: new ObjectID(),
    text: 'First test todo',
    _createdBy: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: new Date().getTime().toString(),
    _createdBy: userTwoId

}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};


module.exports = {
    todos, 
    populateTodos,
    users,
    populateUsers
};