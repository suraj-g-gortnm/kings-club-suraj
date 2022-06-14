function generateOtp() {
    const oneTimePassword = Math.floor(Math.random() * 900000);
    return oneTimePassword;
}

exports.generateOtp = generateOtp;
