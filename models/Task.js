const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectID,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        required: true,
        enum: ['not started', 'in progress', 'done']
    }
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
