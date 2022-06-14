const express = require("express");
const router = express.Router();

const privacyPolicyController = require("../controllers/privacyPolicyController");
const authenticateAdminToken = require("../../utility/authAdmin");

// admin authorization is not implemented yet 👇
router
  .route("/")
  .get(privacyPolicyController.getAllPrivacyPolicy)
  .post(privacyPolicyController.createPrivacyPolicy);

router
  .route("/:id")
  .get(privacyPolicyController.getOnePrivacyPolicy)
  .patch(privacyPolicyController.updateOnePrivacyPolicy);

module.exports = router;
