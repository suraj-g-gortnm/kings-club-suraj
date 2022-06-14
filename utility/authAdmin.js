const jwt = require("jsonwebtoken");
const { User } = require("../src/models/user");

const secret = "Kingsclub_by_gortnm";

function authenticateAdminToken(req, res, next) {
  if (!req.headers["authorization"])
    return res.json({
      response_code: 400,
      response: "Not Authenticated",
      status: false,
    });

  const header = req.headers["authorization"];
  const bearerToken = header.split(" ");
  const authToken = bearerToken[1];

  jwt.verify(authToken, process.env.JWT_TOKEN_SECRETKEY, async (err, user) => {
    //secret,process.env.JWT_Token
    if (err)
      return res.json({
        response_code: 400,
        response: "Unauthorized Access/Invalid Token",
        status: false,
        err,
      });
    console.log(user);
    const userIsAdmin = await User.findOne({ _id: user }); //_id:user.id
    if (userIsAdmin) {
      if (userIsAdmin.isAdmin) {
        req.user = user;
        next();
      } else {
        res.json({
          response_code: 400,
          response: "You are not admin",
          status: false,
        });
      }
    } else {
      res.json({
        response_code: 400,
        response: "The user does not exist",
        status: false,
      });
    }
  });
}

module.exports = authenticateAdminToken;
