const { User } = require("../models/user");

exports.getAllUsers = async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json({
      status: true,
      results: data.length,
      response: data,
    });
  } catch (error) {
    res.json({
      response_code: 404,
      response: "Error",
      status: false,
    });
  }
};

exports.getOneUser = async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    res.status(200).json({
      status: true,
      response: data,
    });
  } catch (error) {
    res.json({
      response_code: 404,
      response: "Error",
      status: false,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.body.bonusPercent) {
      const multiplicationFactor = (100 + req.body.bonusPercent) / 100;
      const data = await User.findByIdAndUpdate(req.params.id, {
        $mul: { "wallet.totalCashAmount": multiplicationFactor },
      });

      res.status(200).json({
        status: true,
        response: "bonus amount added sucessfully",
      });
    }

    if (req.body.bonusAmount) {
      const data = await User.findByIdAndUpdate(req.params.id, {
        $inc: { "wallet.totalCashAmount": req.body.bonusAmount },
      });

      res.status(200).json({
        status: true,
        response: "bonus amount added sucessfully",
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

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: true,
      response: "successfully deleted",
    });
  } catch (error) {
    res.json({
      response_code: 404,
      response: "Error",
      status: false,
    });
  }
};
