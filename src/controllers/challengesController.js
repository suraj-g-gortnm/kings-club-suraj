// In this we have challenge related API's i.e add challenge, accept challenge.
// Update room code, cancel challenge, update result and other functionalities.

const { Challenges } = require("../models/challenges");
const { User } = require("../models/user");
const { Transaction } = require("../models/transactions");

exports.addChallenge = async(req,res) => {
    try {
        // check user
        // create challenge using userId
        // create transaction of cash debit of coins
        // update the transaction in the user's profile, this will give access to most recent transaction by the user
        // update the challenge in user's profile, this will give access to the recent/live challenge
        // update the user's wallet based on the no. of coins used by the user

    const userCheck = await User.findOne({ _id : req.user.id })
    if(!userCheck) {
        return res.json({
            response_code : 400,
            response : "Could not locate the user",
            status : false
        });
    }

    const newChallenge = new Challenges({
        ludoKingUserName : req.body.ludoKingUserName,
        coins : req.body.coins,
        user : req.user.id
    });

    await newChallenge.save();

    const newTransaction = new Transaction({
        cashDebit : req.body.coins,
        user: userCheck._id
    });

    await newTransaction.save();

    userCheck.transactions = newTransaction._id;
    userCheck.challenges = newChallenge._id; // user's most recent challenge will be present here
    await userCheck.save(); 

    const walletUpdate = await User.updateMany(
        { _id : req.user.id},
        { $inc : {"wallet.totalCashAmount" :  - req.body.coins, "wallet.totalAmountWithdrawn" : req.body.coins }});

    if(walletUpdate)
    return res.json({
        response_code : 200,
        response : "New Challenge Created",
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

exports.myChallenges = async(req,res) => {
    try {
        // Check user details
        // Access the recent challenge from the user's profile

        const userCheck = await User.findOne({ _id : req.user.id })
        if(!userCheck)
        return res.json({
            response_code : 400,
            response : "Could not find the user",
            status : false
        })

        res.json({
            response_code : 200,
            response : "Recent Challenge is..",
            data: userCheck.challenges,
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

exports.allChallenges = async(req,res) => {
    try {
        // get list of all challenges from the challenge database

        const check = await Challenges.find({});
        if(!check)
        return res.json({
            response_code: 200,
            response : "Data cannot be accessed",
            status : false
        })

        res.json({
            response_code : 200,
            response : "All Challenges Accessed Successfully",
            data : check,
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

exports.cancelChallengeBeforeAcceptance = async(req,res) => {
    try {
        // find whether user exists or not
        // locate recent challenge by the user
        // cancel challenge but do not delete the challenge from the challenge database
        // create a new transaction 
        // update the coins, in the wallet, that were in the challenge

        const userCheck = await User.findOne({ _id : req.user.id });
        if(!userCheck)
        return res.json({
            response_code : 200,
            response : "Cannot locate the User",
            status : false
        })

        const findChallenge = await Challenges.findOne({ _id : userCheck.challenges});
        if(!findChallenge) 
        return res.json({
            response_code : 404,
            response : "Could not locate challenge",
            status : false
        });

        console.log(findChallenge.coins);

        findChallenge.isCancelled = true;
        await findChallenge.save();

        const newTransaction = new Transaction({
            cashCredit : findChallenge.coins,
            user : userCheck._id // it will help to retrieve the list of transactions by a particular user
        });

        await newTransaction.save();

        userCheck.transactions = newTransaction._id; // recent transaction will be present in the user details
        await userCheck.save();

        const walletUpdate = await User.updateMany(
            {_id : req.user.id}, 
            {$inc : {"wallet.totalAmountDeposited" : findChallenge.coins,"wallet.totalCashAmount" : findChallenge.coins}});
        
        res.json({
            response_code : 200,
            response : "Challenge Successfully Cancelled",
            data : findChallenge,
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

exports.selectChallenge = async (req,res) => {
    try {
        // get the list of all challenges from the challenge database
        // opponent will select the challenge as per his/her wish

        const findChallenge = await Challenges.find({});
        if(!findChallenge) 
        return res.json({
            response_code : 400,
            response : "The challenge does not exist",
            status : false
        });

        res.json({
            response_code : 200,
            response : "Challenge Data Successfully Accessed",
            data : findChallenge,
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

exports.acceptChallenge = async (req,res) => {
    try {
        // opponent selects the challenge using from select challenge api
        // find challenge selected by the opponent
        // check if opponent has enough balance in his wallet to accept the challenge
        // set isAccepted key in the selected challenge database to true
        // create new transaction 
        // debit the wallet of opponent as per the coins in the challenge

        const findChallenge = await Challenges.findOne({ _id: req.query.id })
        if(!findChallenge) 
        return res.json({
            response_code : 400,
            response : "Challenge does not exist",
            status : false
        });

        const user = await User.findOne({ _id : req.user.id });

        if(user.wallet.totalCashAmount < findChallenge.coins)
        return res.json({
            response_code : 400,
            response : "You cannot accept the challenge, due to insufficient balance in your wallet",
            status : false
        })

        findChallenge.isAccepted = true;
        await findChallenge.save();

        const newTransaction = new Transaction({
            cashDebit : findChallenge.coins,
            user : user._id // it will help to retrieve the list of transactions by a particular user
        });

        await newTransaction.save();

        user.transactions = newTransaction._id; // most recent transaction will be present in the user details
        await user.save();

        const walletUpdate = await User.updateMany(
            {_id : req.user.id}, 
            {$inc : {"wallet.totalCashAmount" : - findChallenge.coins, "wallet.totalAmountWithdrawn" : findChallenge.coins}});

        
        res.json({
            response_code : 200,
            response : "Challenge Accepted by the Opponent",
            data : findChallenge,
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

exports.updateRoomCode = async (req,res) => {
    try {
        // only creator of the challenge can update the room code
        // find the user, that is the creator of the challenge
        // update the room code in the challenge

        const user = await User.findOne({ _id: req.user.id });
        
        const findChallenge = await Challenges.findOne({ _id: req.query.id });

        if(user._id.toString() != findChallenge.user.toString())
        return res.json({
            response_code : 400,
            response : "You are not the creator of the challenge",
            status : false
        });

        findChallenge.updateRoomCode = req.body.updateRoomCode;
        await findChallenge.save();

        res.json({
            response_code : 200,
            response : "Ludo Game Updated",
            data: findChallenge.updateRoomCode,
            status : true
        });

    } catch (error) {
        res.json({
            response_code : 404,
            response : "Error",
            status : false
        })
    }
}
