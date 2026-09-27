const crypto = require("crypto");

 exports.generatePassword = (length) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    
    let password = "";

    for (let i = 0; i < length; i++) {
        const index = crypto.randomInt(0, chars.length);
        password += chars[index];
    }

    return password;
}