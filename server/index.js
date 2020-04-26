const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookiePaser = require('cookie-parser');

const config = require('./config/key');

const { User } = require('./model/user');
const { auth } = require('./middleware/auth');

// check if successfully connected to mongoDB
mongoose.connect(config.mongoURI, 
{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
    .then(() => console.log('mongoDB connected'))
    .catch(err => console.log(err));

    
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookiePaser());

// middleware
// only users who are logged in and make changes
app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req._id,
        isAuth: true, 
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    })
})

// take in a request
app.post('/api/users/register', (req, res) => {
    // put information in mongoDB database
    const user = new User(req.body)

    //save the information in mongoDB
    user.save((err, userData) => {
        if(err) return res.json ({
            success: false, err //return error if not succesful
        })
        return res.status(200).json({
            success:true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    // find email in the database
    User.findOne({email: req.body.email}, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            })
        }
        // compare if password entered matches the one in database
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) {
                return res.json ({
                    loginSuccess: false,
                    message: "Wrong password"
                })
            }
        })
        // generate token
        user.generateToken((err, user) => {
            if(err) {
                return res.status(400).send(err);
            }
            // put token into cookie called "x_auth"
            res.cookie("x_auth", user.token)
            .status(200)
            .json({
                loginSuccess: true
            })
        })
    
    })
})

app.get("/api/users/logout", auth, (req, res) => {
    // find user id and update the token by emptying it
    // return success:true
    // otherwise return an error
    User.findOneAndUpdate({ _id: req.user._id}, {token: ""}, (err, doc) => {
        if(err) {
            return res.json({
                success: false, err
            })
        }
        return res.status(200).send({
            success: true
        })
    })
})

// port set by heroku. if not, set 5000
const port = process.env.PORT || 5000

//
app.listen(port, () => {
    console.log(`Sever is running at ${port}`)
});