var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

// Creates a User Schema. This will be the basis of how user data is stored in the db
var UserSchema = new Schema({
    username: {type: String, required: true,unique: true},
    hash: {type:String,required:true},
    name: {type:String,required:true},
    surname: {type:String,required:true},
    email: {type:String,required:true},
    score:{type:Number,default:0},
    created_at: {type: Date, default: Date.now},
    salt: String,
});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

module.exports =  mongoose.model('User', UserSchema)