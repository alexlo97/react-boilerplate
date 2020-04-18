const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookiePaser = require('cookie-parser');
const { User } = require('./model/user');

// check if successfully connected to mongoDB
mongoose.connect('mongodb+srv://AlexLo:sdf2810@alexlo-kk9bx.mongodb.net/test?retryWrites=true&w=majority', 
{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
.then(() => console.log('mongoDB connected'))
.catch(err => console.log(err));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookiePaser());

//
app.post('/api/users/register', (req, res) => {
    const user = new User(req.body)
    user.save((err, userData) => {
        if(err) return res.json ({
            success: false, err //return error if not succesful
        })
        return res.status(200).json({
            success:true
        })
    })
})

app.listen(5000);