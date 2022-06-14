const express = require("express");
const router = express.Router();

const challengesController = require("../controllers/challengesController");
const isAuth = require("../../utility/authJwt");
const isAdmin = require("../../utility/authAdmin");

router.post("/addChallenge",isAuth,challengesController.addChallenge);
router.get("/myChallenges",isAuth,challengesController.myChallenges);
router.get("/allChallenges",isAuth,challengesController.allChallenges);
router.put("/cancelChallenge",isAuth,challengesController.cancelChallengeBeforeAcceptance);
router.get("/selectChallenge",isAuth,challengesController.selectChallenge);
router.put("/acceptChallenge",isAuth,challengesController.acceptChallenge);
router.put("/updateRoomCode",isAuth,challengesController.updateRoomCode);

module.exports = router;