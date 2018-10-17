var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a User Schema. This will be the basis of how user data is stored in the db
var UserSchema = new Schema({
    username: {type: String, required: true,unique: true},
    password: {type:String,required:true},
    name: {type:String,required:true},
    surname: {type:String,required:true},
    email: {type:String,required:true},
    score:{type:Number,default:0},
    created_at: {type: Date, default: Date.now}
});
module.exports =  mongoose.model('User', UserSchema)