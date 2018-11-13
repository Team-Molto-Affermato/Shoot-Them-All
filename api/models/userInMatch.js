var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;


const pointSchema = new Schema({
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
const UserInRoomSchema = new Schema({
    name: String,
    roomName:{
      type: String,
      index: true,
      required :true
    },
    team:{type:String},
    location: {
        type: pointSchema,
        required: true
    },
    score: {type:Number,default:0},
    created_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
UserInRoomSchema.pre('save', function(next){
    now = new Date();
    this.created_at = now;
    next();
});
UserInRoomSchema.pre('update', function(next){
    now = new Date();
    this.created_at = now;
    next();
});
// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: "scotch-users"
module.exports =  mongoose.model('UserInRoom', UserInRoomSchema)