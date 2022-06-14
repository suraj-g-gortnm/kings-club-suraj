const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    cashCredit : {
        type : Number,
        default : 0
    },
    cashDebit : {
        type : Number,
        default : 0
    },
    failed : {
        type : Number,
        default : 0
    },
    processing : {
        type : Number,
        dafeult : 0
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},
{
    timestamps : true
});

const Transaction = mongoose.model("Transaction",transactionSchema);

exports.Transaction = Transaction;