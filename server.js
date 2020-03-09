const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const users = require('./app/users');
const tasks = require('./app/tasks');

const app = express();

app.use(cors());
app.use(express.json());

const port = 8000;

const run = async () => {
    await mongoose.connect('mongodb://localhost/todos', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

    app.use('/users', users);
    app.use('/tasks', tasks);

    app.listen(port, () => {
        console.log('Server is running on port ', port);
    })
};

run().catch(e => console.error(e));

