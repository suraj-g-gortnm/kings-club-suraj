// In this we have ApI's related to wallet management, wallet balance, add cash to wallet.
// Withdraw cash from wallet, getting wallet balance etc.

const { User } = require("../models/user");
const { Transaction } = require("../models/transactions");


exports.getWalletBalance = async(req,res) =>{
    try {
        // Check user
        // fetch wallet details from the user's profile

        const userCheck = await User.findOne({ _id : req.user.id });

        if(!userCheck) {
           return res.json({
                response_code : 400,
                response : "Wallet Details Could not be fetched",
                status : false
            })
        }
        else {
             return res.json({
                response_code : 200,
                response : "Wallet Details fetched Successfully",
                data : userCheck.wallet,
                status : true
            })
        }

    } catch (error) {
        res.json({
            response_code : 404,
            response : "Error",
            status : false
        })
    }
}

exports.addCash = async(req,res) => {
    try {
        // Check if user exist or not
        // create a new transaction based on the amount user wants to add
        // update the transaction in the user's profile, this will give access to the most recent transaction by the user
        // update the user's wallet based on the cash added by user

        const userCheck = await User.findOne({ _id : req.user.id });
        if(!userCheck) {
           return res.json({
                response_code : 400,
                response : "Could not locate the user",
                status : false
            }) 
        }

        const newTransaction = new Transaction({
            cashCredit : req.body.cashCredit,
            user : userCheck._id // it will help to retrieve the list of transactions by a particular user
        });

        await newTransaction.save();

        userCheck.transactions = newTransaction._id; // recent transaction will be present in the user details
        await userCheck.save();

        const walletUpdate = await User.updateMany(
            {_id : req.user.id}, 
            {$inc : {"wallet.totalAmountDeposited" : req.body.cashCredit,"wallet.totalCashAmount" : req.body.cashCredit}});

            res.json({
                response_code : 200,
                response : "Cash Added Successfully",
                data : userCheck.wallet,
                status : true
            })

    } catch (error) {
        res.json({
            response_code : 404,
            response : "Error",
            status : false
        })
    }
}

exports.withdrawCash = async(req,res) => {
    try {
        // Check if user exist or not
        // create a new transaction based on the amount user wants to withdraw
        // Check whether the amount to be withdrawn is valid i.e more than his total cash balance in the wallet
        // update the transaction in the user's profile, this will give access to the most recent transaction by the user
        // update the user's wallet based on the cash withdrawn by the user

        const userCheck = await User.findOne({ _id : req.user.id });
        if(!userCheck) {
            return res.json({
                response_code : 400,
                response : "Could not locate the user",
                status : false
            })
        }

        if(req.body.cashDebit > userCheck.wallet.totalCashAmount)
        return res.json({
            response_code: 400,
            response: "There is not enough balance in your wallet",
            status: false
        })

        const newTransaction = new Transaction({
            cashDebit : req.body.cashDebit,
            user : userCheck._id // it will help to retrieve the list of transactions by a particular user
        });

        await newTransaction.save();

        userCheck.transactions = newTransaction._id; // most recent transaction will be present in the user details
        await userCheck.save();

        const walletUpdate = await User.updateMany(
            {_id : req.user.id}, 
            {$inc : {"wallet.totalCashAmount" : - req.body.cashDebit, "wallet.totalAmountWithdrawn" : req.body.cashDebit}});

            res.json({
                response_code : 200,
                response : "Cash debited Successfully",
                data : userCheck.wallet,
                status : true
            })

    } catch (error) {
        res.json({
            response_code : 404,
            response : "Error",
            status : false
        })
    }
}

exports.getRecentTransaction = async(req,res) => {
    try {
        // check if user exist's or not.
        // get the list of all the transaction of the user, using the userid from the transaction schema

    const userCheck = await Transaction.findOne({ user : req.user.id });
    if(!userCheck) {
       return res.json({
            response_code : 400,
            response : "User Details Could not be fetched",
            status : false
        })
    }

    const recentTransactions = await Transaction.find({ user : req.user.id }).sort( { createdAt : -1 });
    if(recentTransactions){
           return res.json({
                response_code : 200,
                response : "Your Recent transaction is:  ",
                data : recentTransactions,
                status : true
            })
    }
    } catch (error) {
        res.json({
            response_code : 404,
            response : "Error",
            status : false
        })
    }
    
}

exports.withdrawAllCash = async(req,res) => {
    try {
        // Check if user exist or not
        // create a new transaction based on the amount user wants to withdraw
        // update the transaction in the user's profile, this will give access to the most recent transaction by the user
        // update the user's wallet based on the cash withdrawn by the user

        const userCheck = await User.findOne({ _id : req.user.id });
        if(!userCheck) {
           return res.json({
                response_code : 400,
                response : "User Details Could not be fetched",
                status : false
            })
        }

        const newTransaction = new Transaction({
            cashDebit : userCheck.wallet.totalCashAmount,
            user : userCheck._id // it will help to retrieve the list of transactions by a particular user
        });

        await newTransaction.save();

        userCheck.transactions = newTransaction._id; // most recent transaction will be present in the user details
        await userCheck.save();

        const walletUpdate = await User.updateMany(
            {_id : req.user.id}, 
            {$inc : {"wallet.totalCashAmount" : - userCheck.wallet.totalCashAmount, "wallet.totalAmountWithdrawn" : userCheck.wallet.totalCashAmount}});

            res.json({
                response_code : 200,
                response : "All cash withdrawn Successfully",
                data : userCheck.wallet,
                status : true
            })

    } catch (error) {
        res.json({
            response_code : 404,
            response : "Error",
            status : false
        })
    }
}


