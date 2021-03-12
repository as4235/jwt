const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {  // module.exports here because, before the user even do any actions we want thsi to happen
    try {
       
        const jwtToken = req.header("token");

        if(!jwtToken){  // if no value exist in the token header
            return res.status(403).json("Not authorized");
        }

        const payload = jwt.verify(jwtToken, process.env.jwtSecret); // compare the user's token we got from the header with what we have in .env file
        req.user = payload.user;   // when the token and secretKey is compared the remaining we get is the uuid of the user
        next();

    } catch (error) {
        console.error(error.message);
        return res.status(403).json("Not authorized");
    }
}