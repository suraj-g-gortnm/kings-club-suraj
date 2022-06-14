const privacyPolicy = require("../models/privacyPolicy");

exports.createPrivacyPolicy = async (req, res) => {
  try {
    const newPrivacyPolicy = await privacyPolicy.create(req.body);
    res.json({
      status: true,
      response: "privacy policy created Successfully",
      data: newPrivacyPolicy,
    });
  } catch (error) {
    res.json({
      response_code: 403,
      response: "Error",
      status: false,
    });
  }
};

exports.getAllPrivacyPolicy = async (req, res) => {
  try {
    const allPrivacyPolicy = await privacyPolicy.find();
    res.json({
      status: true,
      length: allPrivacyPolicy.length,
      response: "all privacy policy fetched Successfully",
      data: allPrivacyPolicy,
    });
  } catch (error) {
    res.json({
      response_code: 404,
      response: "Error",
      status: false,
    });
  }
};

exports.getOnePrivacyPolicy = async (req, res) => {
  try {
    const onePrivacyPolicy = await privacyPolicy.findById(req.params.id);
    res.json({
      status: true,
      response: "one privacy policy fetched Successfully",
      data: onePrivacyPolicy,
    });
  } catch (error) {
    res.json({
      response_code: 404,
      response: "Error",
      status: false,
    });
  }
};

exports.updateOnePrivacyPolicy = async (req, res) => {
  try {
    await privacyPolicy.findByIdAndUpdate(req.params.id, req.body);
    res.json({
      status: true,
      response: "successfully updated",
    });
  } catch (error) {
    res.json({
      response_code: 404,
      response: "Error",
      status: false,
    });
  }
};
