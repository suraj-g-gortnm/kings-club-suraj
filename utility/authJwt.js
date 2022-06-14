const jwt = require('jsonwebtoken');
const { User } = require("../src/models/user");

const secret = "Kingsclub_by_gortnm"

function authenticateToken(req,res,next) {
    if(!req.headers["authorization"])
    return res.json({
        response_code : 400,
        response : "Not Authenticated",
        status : false
    });

    const header = req.headers["authorization"];
    const bearerToken = header.split(" ");

    const authToken = bearerToken[1];
    jwt.verify(authToken,secret, async (err,user) =>{
        if(err) return res.json({
            response_code : 400,
            response : "Unauthorized Access/Invalid Token",
            status : false
        });

        const userExist = await User.findOne({_id : user.id });  // Checking if user exists or not

        if(!userExist) 
        return res.json({
            response_code : 400,
            response : "The user does not exist",
            status : false
        });
        else {
            req.user = user;
            next();
        }
    });
}


module.exports = authenticateToken;