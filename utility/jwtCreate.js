const jwt = require("jsonwebtoken");

function tokenCreate({ id }, secret) {
  //payload, id
  const token = jwt.sign(id, secret);
  return token;
}

exports.tokenCreate = tokenCreate;
