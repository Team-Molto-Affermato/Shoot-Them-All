// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a User Schema. This will be the basis of how user data is stored in the db
var UserSchema = new Schema({
    username: {type: String, required: true,unique: true},
    password: {type:String,required:true},
    gender: {type: String, required: false},
    score:Number,
    created_at: {type: Date, default: Date.now}
});

var RoomSchema = new Schema({
   roomName: {type: String,required:true},
   location: {type: [Number],required: true},
   radius: {type: Number, required: true},
   state: {type: String},
   user:[String],
   visibility:{type:String,required: true},
   password:{type:String,required: false},
   created_at: {type: Date, default: Date.now}
});

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const UserInRoomSchema = new mongoose.Schema({
    name: String,
    roomName: String,
    location: {
        type: pointSchema,
        required: true
    }
});


// Sets the created_at parameter equal to the current time
UserSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// // Indexes this schema in 2dsphere format (critical for running proximity searches)
// UserSchema.index({location: '2dsphere'});

// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: "scotch-users"
module.exports ={
    Room:mongoose.model('room', RoomSchema),
    User:mongoose.model('user',UserSchema)
}