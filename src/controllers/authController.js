// In this we have Api's related to user management i.e user details, user signup/login.
// Password/Change Password, OTP Verification etc..

const { tokenCreate } = require("../../utility/jwtCreate");
const { User, userValidate } = require("../models/user");
const { generateOtp } = require("../../utility/otpFunc");
const { hashPassword } = require("../../utility/passwordHash");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    // validate incoming input
    // check if user already exists or not
    // generate OTP
    // response_code: 404,
    // create a new user

    const { error } = userValidate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const userCheck = await User.findOne({ name: req.body.name });
    if (userCheck)
      return res.json({
        response_code: 400,
        response: "This User Already exists",
        status: false,
      });

    const otp = generateOtp();

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobileNo: req.body.mobileNo,
      password: req.body.password,
      oneTimePassword: otp,
    });

    user.password = await hashPassword(req.body.password);

    await user.save();
    const token = tokenCreate(
      { id: user._id.toString() }, // toString() was not here
      process.env.JWT_TOKEN_SECRETKEY
    );
    res.json({
      response_code: 200,
      response: "User registered Successfully",
      data: { jwt: token },
      status: true,
    });
  } catch (error) {
    res.json({
      response: "Error",
      status: false,
    });
  }
};

exports.signUpConfirm = async (req, res) => {
  try {
    // find whether user exists or not
    // check OTP
    // allow signin with signup bonus

    const userCheck = await User.findOne({ name: req.body.name });

    const checkOtp =
      userCheck.oneTimePassword == req.query.oneTimePassword ? true : false;
    if (!checkOtp)
      return res.json({
        response_code: 400,
        response: "Wrong OTP",
        status: false,
      });

    userCheck.isVerified = true;
    userCheck.wallet.totalCashAmount = 15;
    userCheck.wallet.myBonus = 15;

    await userCheck.save();

    res.json({
      response_code: 200,
      response:
        "Congratulations, You have successfully signed up for Kings Club. You have received Rs.15 in your wallet as a sign up bonus. Successfully",
      status: true,
    });
  } catch (error) {
    res.json({
      response_code: 404,
      response: "Error",
      status: false,
    });
  }
};

exports.login = async (req, res) => {
  try {
    // find whether user exists or not
    // check password
    // generate new otp

    const userCheck = await User.findOne({ _id: req.user.id });

    const isMatch = await bcrypt.compare(req.body.password, userCheck.password);
    if (!isMatch)
      return res.json({
        response_code: 400,
        response: "Password does not Match",
        status: false,
      });

    const otp = generateOtp();
    userCheck.oneTimePassword = otp;
    await userCheck.save();

    res.json({
      response_code: 200,
      response: "Otp Sent",
      data: otp,
      status: true,
    });
  } catch (error) {
    res.json({
      response_code: 404,
      response: "Error",
      status: false,
    });
  }
};

exports.loginConfirm = async (req, res) => {
  try {
    // find whether user exists or not
    // check otp
    // allow login

    const userCheck = await User.findOne({ _id: req.user.id });

    const checkOtp =
      userCheck.oneTimePassword == req.query.oneTimePassword ? true : false;
    if (!checkOtp)
      return res.json({
        response_code: 404,
        response: "Wrong OTP",
        status: false,
      });

    res.json({
      response_code: 200,
      response: "Login Successfull",
      data: userCheck,
      status: true,
    });
  } catch (error) {
    res.json({
      response_code: 404,
      response: "Error",
      status: false,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    // find whether user exists or not
    // generate otp

    if (req.body.mobileNo == undefined)
      return res.json({
        response_code: 400,
        response: "Mobile Number Missing",
        status: false,
      });

    const userCheck = await User.findOne({ _id: req.user.id });

    if (userCheck) {
      const otp = generateOtp();
      userCheck.oneTimePassword = otp;
      await userCheck.save();

      res.json({
        response_code: 200,
        response: "Otp Sent",
        data: otp,
        status: true,
      });
    }
  } catch (error) {
    res.json({
      response_code: 404,
      response: "Error",
      status: false,
    });
  }
};

exports.forgotPasswordConfirm = async (req, res) => {
  try {
    // find whether user exists or not
    // check otp
    // change password

    if (req.body.password == undefined)
      return res.json({
        response_code: 400,
        response: "Password is required",
        status: false,
      });

    const userCheck = await User.findOne({ _id: req.user.id });

    const checkOtp =
      userCheck.oneTimePassword == req.query.oneTimePassword ? true : false;
    if (!checkOtp)
      return res.json({
        response_code: 400,
        response: "Wrong OTP",
        status: false,
      });

    userCheck.password = await hashPassword(req.body.password);
    await userCheck.save();

    res.json({
      response_code: 200,
      response: "Password Changed Successfully",
      status: true,
    });
  } catch (error) {
    res.json({
      response_code: 404,
      response: "Error",
      status: false,
    });
  }
};

exports.profileUpdate = async (req, res) => {
  try {
    // find whether user exists or not
    // update profile

    const userCheck = await User.findOne({ _id: req.user.id });
    if (!userCheck)
      return res.json({
        response_code: 400,
        response: "Could not locate the user",
        status: false,
      });

    userCheck.name = req.body.name;
    userCheck.email = req.body.email;
    userCheck.gender = req.body.gender;
    userCheck.state = req.body.state;
    userCheck.country = req.body.country;
    userCheck.aadharCardNumber = req.body.aadharCardNumber;
    userCheck.dateOfBirth = req.body.dateOfBirth;

    await userCheck.save();

    res.json({
      response_code: 200,
      response: "Profile Successfully Updated",
      data: userCheck,
      status: true,
    });
  } catch (error) {
    res.json({
      response_code: 404,
      response: "Error",
      status: false,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    // find whether user exists or not
    // change password

    const userCheck = await User.findOne({ _id: req.user.id });
    if (!userCheck)
      return res.json({
        response_code: 400,
        response: "Could not locate the user",
        status: false,
      });

    userCheck.password = await hashPassword(req.body.password);
    await userCheck.save();

    res.json({
      response_code: 200,
      response: "Password Changed Successfully",
      status: true,
    });
  } catch (error) {
    res.json({
      response_code: 404,
      response: "Error",
      status: false,
    });
  }
};
