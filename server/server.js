var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
var port = process.env.PORT || 3000;


app.use(bodyParser.json());


app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save()
    .then((doc) => {
        res.status(200).send(doc);
    }).catch((error) => {
        res.status(400).send(error);
    })
});

app.get('/todos', (req, res) => {
    Todo.find({}).then((todos) => {
        res.status(200).send({todos});
    }).catch((error) => {
        res.status(400).send(error);
    });
});


app.get('/todos/:id', (req, res) => {
    var id = req.params.id;    
    
    
    if (!ObjectID.isValid(id)){
        res.status(404).send();
    }
    else {
        Todo.findById(id).then((todo) => {
            if (!todo){
                return res.status(404).send();
            }
            res.status(200).send({todo});
        }).catch((error) => {
            res.status(400).send();
        });
    }
     
});

app.delete('/todos/:id', (req, res) => {
    
    var id = req.params.id;
    if (!ObjectID.isValid(id)){
        res.status(404).send();
    }
    else {
        Todo.findByIdAndRemove(id).then((todo) => {
            if (!todo){
                return res.status(404).send();
            }
            res.status(200).send({todo});
        }).catch((error) => {
            res.status(400).send();
        });
    }
})


app.listen(port, () => {
    console.log(`Express started on port ${port}`);
});

module.exports = {app};