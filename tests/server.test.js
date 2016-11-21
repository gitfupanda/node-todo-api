const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server/server');
var {Todo} = require('./../server/models/todo');

const todos =[{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        var text = 'test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((error, res) => {
                if (error) {
                    return done(error);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });

    it('should not create todo with invalid body', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((error, res) => {
                if (error) {
                    return done(error);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);                    
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });  

});

describe('GET /todos', () => {

    it('should get all todos', (done) => {
         request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            }).end(done);            
    });
});

describe('GET /todos/:id', () => {
    
    it('should return todo given an existing id', (done) => {
        var id = todos[0]._id
        
        request(app)
            .get(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            }).end(done);
    });

    it('should return 404 given an unknown id', (done) => {
        var id = new ObjectID();
        
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 given a malformed id', (done) => {
        var id = 'abc1234edswje';
        
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    
    it('should delete and return todo given an existing id', (done) => {
        var id = todos[0]._id.toHexString();
        
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            }) 
            .end((error, res) => {
                if (error) {
                    return done(error);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist();                    
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });

    it('should return 404 given an unknown id', (done) => {
        var id = new ObjectID();
        
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 given a malformed id', (done) => {
        var id = 'abc1234edswje';
        
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});