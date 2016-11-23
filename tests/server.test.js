const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server/server');
var {Todo} = require('./../server/models/todo');
var {User} = require('./../server/models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('PATCH /todos/:id', () => {
    
    it('should update and return todo given an existing id and text', (done) => {
        var id = todos[0]._id.toHexString();
        var newText = "This is some updated text";
        
        request(app)
            .patch(`/todos/${id}`)
            .send({text: newText})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(newText);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(null);
            }) 
            .end(done);
    });

    it('should update and return todo with completedAt set given an existing id, text and compeleted', (done) => {
        var id = todos[0]._id.toHexString();
        var newText = "This is some updated text";
        
        request(app)
            .patch(`/todos/${id}`)
            .send({text: newText, completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(newText);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toNotBe(null);
            }) 
            .end(done);
    });

    it('should return 404 given an unknown id', (done) => {
        var id = new ObjectID();
        
        request(app)
            .patch(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 given a malformed id', (done) => {
        var id = 'abc1234edswje';
        
        request(app)
            .patch(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});

describe('GET /users/me', () => {

    it('should return user given authenticated', (done) => {
        var token = users[0].tokens[0].token;

        request(app)            
            .get('/users/me')
            .set('x-auth', token)
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe('UserOne@domain.com');
            }).end(done);
    });

    it('should return 401 given unauthenticated', (done) => {
         request(app)            
            .get('/users/me')            
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    })

});

describe('POST /users', () => {

    it('should create user given valid details', (done) => {

        var email = "NewUser@domain.com";
        var password = "asimplepassword1"
        var newId;

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);

                newId = res.body._id;
            })
            .end((error) => {
                if (error) {
                    return done(error);
                }

                User.findById(newId).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                })
            });
            

    });

    it('should return validation errors given invalid email details', (done) => {

        var email = "InvalidEmail";
        var password = "123";
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('should return validation errors given email already exists', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: 'Password123!'
            })
            .expect(400)
            .end(done);
    });

});