const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id) {  // we are combining the 'user_id' and the 'jwtSecret' to form the token
    const payload = {
        user: user_id
    };
            // jwtToken = user_id + jwtToken + expiration
    return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1hr" });
}

module.exports =jwtGenerator;