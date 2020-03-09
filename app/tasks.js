const express = require('express');
const mongoose = require('mongoose');

const auth = require('../middleware/auth');
const Task = require('../models/Task');

const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

router.get('/', auth, async (req, res) => {
    const tasks = await Task.find({user: ObjectId(req.user._id)});
    return res.send(tasks);
});

router.post('/', auth, async (req, res) => {
    const taskData = req.body;

    const task = new Task(taskData);

    task.user = req.user._id;

    try{
        await task.save();
        return res.send(task);
    } catch(e){
        return res.status(400).send(e);
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const user = req.user;
        const task = await Task.findById(req.params.id);
        if(JSON.stringify(task.user) === JSON.stringify(user._id)) {
            task.title = req.body.title ? req.body.title : task.title;
            task.description = req.body.description ? req.body.description : task.description;
            task.status = req.body.status ? req.body.status : task.status;
            await task.save();
            return res.send({message: 'Changes have been saved'});
        } else {
            return res.status(400).send({message: 'You have no right to edit'})
        }
    } catch (e) {
        return res.status(400).send(e)
    }
});

router.delete('/:id', auth, async (req, res) => {
    try{
        const user = req.user;
        const task = await Task.findById(req.params.id);
        if(JSON.stringify(task.user) === JSON.stringify(user._id)){
            const delRes = await Task.deleteOne({_id: ObjectId(req.params.id)});
            if(delRes){
                return res.send({message: 'Deleted successfully'});
            } else{
                return res.status(400).send({error: "Could't delete your task"});
            }
        } else{
            return res.status(400).send({error: "Unauthorized user"});
        }

    } catch(e){
        res.status(400).send(e);
    }
});

module.exports = router;
