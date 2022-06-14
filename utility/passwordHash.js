const bcrypt = require('bcrypt');

async function hashPassword (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    return hashedPassword;
}

exports.hashPassword = hashPassword;
