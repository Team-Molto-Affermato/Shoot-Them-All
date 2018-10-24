// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

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

var RoomSchema = new Schema({
   roomName: {type: String,required:true,unique:true},
   location: {type: pointSchema,required: true},
   max_user: {type: Number, required: true},
   duration: {type:Number, required: true},
   radius: {type: Number, required: true},
   state: {type: String},
   users:[String],
   visibility:{type:String,required: true},
   password:{type:String,required: false},
   created_at: {type: Date, default: Date.now},
   starting_time: {type: Date, default: Date.now}
});

// const UserInRoomSchema = new mongoose.Schema({
//     name: String,
//     roomName: String,
//     location: {
//         type: pointSchema,
//         required: true
//     }
// });


// Sets the created_at parameter equal to the current time
RoomSchema.pre('save', function(next){
    now = new Date();
    this.created_at = now;
    next();
});
// // Indexes this schema in 2dsphere format (critical for running proximity searches)
// UserSchema.index({location: '2dsphere'});

// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: "scotch-users"
module.exports =  mongoose.model('Room', RoomSchema)