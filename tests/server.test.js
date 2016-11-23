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
            .set('x-auth', users[0].tokens[0].token)
            .send({
                text: text                
            })
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
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            }).end(done);            
    });
});

describe('GET /todos/:id', () => {
    
    it('should return todo given an existing id', (done) => {
        var id = todos[0]._id
        
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            }).end(done);
    });

    it('should return 404 given an unknown id', (done) => {
        var id = new ObjectID();
        
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 given a malformed id', (done) => {
        var id = 'abc1234edswje';
        
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should not return todo created by other user', (done) => {
        var id = todos[0]._id
        
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    
    it('should delete and return todo given an existing id', (done) => {
        var id = todos[1]._id.toHexString();
        
        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
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

    it('should not delete todo created by other user', (done) => {
        var id = todos[0]._id.toHexString();
        
        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)            
            .end((error, res) => {
                if (error) {
                    return done(error);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toExist();                    
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
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 given a malformed id', (done) => {
        var id = 'abc1234edswje';
        
        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .send({text: newText, completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(newText);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toNotBe(null);
            }) 
            .end(done);
    });

    it('should return 404 when updating other\'s todo', (done) => {
        var id = todos[0]._id.toHexString();
        var newText = "This is some updated text";
        
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({text: newText, completed: true})
            .expect(404)
            .end(done);
    });

    it('should return 404 given an unknown id', (done) => {
        var id = new ObjectID();
        
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 given a malformed id', (done) => {
        var id = 'abc1234edswje';
        
        request(app)
            .patch(`/todos/${id}`)
            .expect(404)
            .set('x-auth', users[1].tokens[0].token)
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

describe('POST /users/login', () => {

    it('should login user and return auth token given valid credentials', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })              
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(users[1].email);                
            })
            .end((err, res) => {
                if (err){
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {                    
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((ex) => {
                    done(ex);
                });
            });
    });

    it('should return 400 given invalid credentials', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + 'BLAH'
            })              
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();                                
            })
            .end((err, res) => {
                if (err){
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {                    
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((ex) => {
                    done(ex);
                });
            });
    });
});

describe('DELETE /users/me/token', () => {

    it('should remove token when logout given valid token', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err){
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {                    
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((ex) => {
                    done(ex);
                });
            });
    });

    it('should return 401 given invalid token', (done) => {

        var invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODM1NTA5OTU1MzE5YTE2ZTQxM2NlMjUiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNDc5ODg5MDQ5fQ.tNkLwtUFXW2QYQFgur-vUL1vJvUjfqmpY5I34j7SXAo'

         request(app)
            .delete('/users/me/token')
            .set('x-auth', invalidToken)
            .expect(401)
            .end(done);
    });
});