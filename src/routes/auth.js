const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/usersController");
const isAuth = require("../../utility/authJwt");
const isAdmin = require("../../utility/authAdmin");

// Auth flow(Signup, login, forgotpassword)

router.post("/signup", authController.signup);
router.post("/signUpConfirm", authController.signUpConfirm);
router.post("/login", isAuth, authController.login);
router.post("/loginConfirm", isAuth, authController.loginConfirm);
router.post("/forgotPassword", isAuth, authController.forgotPassword);
router.post(
  "/forgotPasswordConfirm",
  isAuth,
  authController.forgotPasswordConfirm
);

//Update User details

router.put("/updateProfile", isAuth, authController.profileUpdate);
router.put("/changePassword", isAuth, authController.changePassword);

// get/patch/delete users by admin
// admin authorization is not implemented yet 👇

router.route("/").get(userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
