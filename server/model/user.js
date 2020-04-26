const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // ten characters long
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50
    },
    email: {
        type:String,
        trim:true,
        unique: 1 
    },
    password: {
        type: String,
        minglength: 5
    },
    lastname: {
        type:String,
        maxlength: 50
    },
    role : {
        type:Number,
        default: 0 
    },
    image: String,
    token : {
        type: String,
    },
    tokenExp :{
        type: Number
    }
});

//before saving:
userSchema.pre('save', function(next) {
    var user = this;
    // whenever the password is modified, perform the actions below:
    if(user.isModified('password')) {
        //generate salt
        bcrypt.genSalt(saltRounds, function(err, salt) {
            // if there is an error, do not continue
            if(err) {
                return next(err);
            }
            //if there are no errors, hash the password with the salt generated
            bcrypt.hash(user.password, salt, function(err,hash) {
                if(err) {
                    return next(err);
                }
                //put hash into the user's password
                user.password = hash;
                next();
            })
        })
    }
    else {
        next()
    }

});

// cb = callback
userSchema.methods.comparePassword = function(plainPassword, cb) {
    // compare password with password in database
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        // if there is a match:
        cb(null, isMatch);
    })
};

userSchema.methods.generateToken = function(cb) {
    var user = this;
    // user id generated from mongoDB
    // 'secret' to generate token
    var token = jwt.sign(user._id.toHexString(), 'secret')
    user.token = token;
    // check if saved successfullu
    user.save(function (err, user) {
        if(err) {
            return cb(err)
        }
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    // check if we can find user with the token
    jwt.verify(token, 'secret', function(err, decode) {
        user.findOne({"_id": decode, "token": token}, 
        function(err, user) {
                if(err) {
                    return cb(err);
                }
                cb(null, user);
            })
        }
    )
}

const User = mongoose.model('User', userSchema);

module.exports = { User }