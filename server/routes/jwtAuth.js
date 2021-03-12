const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validInfo');
const authorization = require('../middleware/authorization');

// Registering

router.post("/register", validInfo, async (req, res) => {
    try {
        
        // 1. destructure the req.body. Get name, email and password as seperate variables from req.body
        const { name, email, password } = req.body;

        // 2. check if user exists
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
        
        if (user.rows.length !== 0) {  // if the user variable has values, i.e, if value turns up when searched that means the user exists so they cannot register
            return res.status(401).send("User Exists");  // 401-Unauthenticated
        }

        // 3. bcrypt the password
        const saltRound = 10; // saltRound encrypts the pasword entered. 10 denotes the level of encryption to happen
        const salt = await bcrypt.genSalt(saltRound); // declaring the function to bcrypt the password by generating salt with the level of 10
        const brcyptPassword = await bcrypt.hash(password, salt);  // bcrypt the password by adding salt to it, hash it

        // 4. save the new user to our database
        const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *"
        , [name, email, brcyptPassword]);

        // 5. generate the jwt token
        const token = jwtGenerator(newUser.rows[0].user_id);  // pass the user_id value from the newUser variable to jwtGenerator function
        res.json({token});  
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
})

// login route
router.post('/login', validInfo, async (req, res) => {
    try {
        // 1. get details from req.body
        const { email, password } = req.body;

        // 2. check if user exists
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        if(user.rows.length === 0){
            return res.status(401).send("Incorrect email");
        }

        // 3. check if incoming password same as password in DB
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password); // we are decrypting the password stored in the DB and comparing with the value that came up when queried to see if they match
        console.log(validPassword);

        if(validPassword === false){
            res.status(401).send("Incorrect password");
        }

        // 4. give the user jwt token. pass the user_id to jwtGenerator function
        const token = await jwtGenerator(user.rows[0].user_id);
        res.json({token});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
})

router.get('/is-verify', authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;