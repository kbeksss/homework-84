const User = require('../models/User');

const auth = async (req, res, next) => {
    const authorizationHeader = req.get('Authorization');

    if(!authorizationHeader){
        return res.status(401).send({error: 'Not authorized'});
    }
    const [type, token] = authorizationHeader.split(' ');
    if(type !== 'Token' || !token){
        return res.status(401).send({error: "Not authorized"});
    }
    const user = await User.findOne({token});

    if(!user){
        return res.status(401).send({error: "Unauthorized user"});
    }

    req.user = user;

    next();
};

module.exports = auth;
