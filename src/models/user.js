const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
        name : {
            type : String,
            minlength : 2,
            maxlength : 128,
            required : true
        },
        email : {
            type : String,
            required : true
        },
        mobileNo : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        gender : String,
        state : String,
        city : String,
        pinCode : String,
        country : String,
        inviteCode : String,
        oneTimePassword : Number,
        isVerified: {
            type: Boolean,
            default :false
        },
        isAdmin : {
            type : Boolean,
            default: false
        },
        aadharCardNumber : String,
        dateOfBirth : String,
        wallet : {
            totalCashAmount : {
                type : Number,
                default : 0
            },
            totalAmountDeposited : {
                type : Number,
                default : 0
            },
            totalAmountWon : {
                type : Number,
                default : 0
            },
            totalAmountWithdrawn : {
                type : Number,
                default : 0
            },
            myBonus : {
                type : Number,
                default : 0
            },
        },
        transactions : {    // most recent transaction will be present here
            type : mongoose.Schema.Types.ObjectId,
            ref : "Transaction"
        },
        challenges : {    // most recent challenge will be present here
            type : mongoose.Schema.Types.ObjectId,
            ref : "Challenges"
        }
    },
    {
        timestamps :true

});


// Validator function for validating the incoming input
function userValidate (user) {
    const schema = Joi.object({
        name : Joi.string().required(),
        email : Joi.string().required(),
        mobileNo : Joi.string().length(10).required(),
        password : Joi.string().length(8).required(),
        gender : Joi.string(),
        state : Joi.string(),
        country : Joi.string(),
        oneTimePassword : Joi.number().integer(),
        inviteCode : Joi.string(),
        aadharCardNumber : Joi.string(),
        dateOfBirth : Joi.string()
    });
    return schema.validate(user)
}

const User = mongoose.model("User", userSchema);

exports.User = User;
exports.userValidate = userValidate;