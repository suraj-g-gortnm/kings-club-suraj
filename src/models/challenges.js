const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    ludoKingUserName : {
        type : String
    },
    coins: {
        type: Number
    },
    acceptChallenge : String,
    cancelChallenge : String,
    updateRoomCode : String,
    updateResultAsLost : String,
    updateReultAsWin : String,
    isAccepted : {
        type : Boolean,
        default : false
    },
    isCancelled : {
        type : Boolean,
        default : false
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},
{
    timestamps : true
});

const Challenges = mongoose.model("Challenges",challengeSchema);

exports.Challenges = Challenges; 