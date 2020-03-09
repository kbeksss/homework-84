const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res) => {
    const user = new User(req.body);

    try{
        user.generateToken();
        await user.save();
        return res.send(user);
    } catch(e) {
        return res.status(400).send(e);
    }
});

router.post('/sessions', async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if(!user){
        return res.status(400).send({error: 'Incorrect password or username'});
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if(!isMatch){
        return res.status(400).send({error: "Incorrect password or username"});
    }

    user.generateToken();
    await user.save();

    res.send({token: user.token});
});

module.exports = router;
