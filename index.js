const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://AlexLo:sdf2810@alexlo-kk9bx.mongodb.net/test?retryWrites=true&w=majority', 
{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('mongoDB connected'))
.catch(err => console.log(err));

// respond with "hello world" when a GET request is made to the homepage
// same as:
// app.get('/', (req,res) => {
    //res.send('hello world'))
// })
app.get('/', function (req, res) {
    res.send('hello world')
  })
app.listen(5000);