const { User } = require('../model/user');


let auth = (req, res, next) => {
    let token = req.cookies.x_auth;

    // check if we can find user by token
    User.findByToken(token, (err, user) => {
        if(err) {
            throw err
        }
        if(!user) {
            return rest.json({
                isAuth: false,
                error: true
            })
        }
        req.token = token;
        req.user = user;
        next();
    });
};

module.exports = { auth };