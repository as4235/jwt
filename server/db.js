const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    password: "GQmkbhd1738!",
    port: 5432,
    database: "jwt",
    host: "localhost"
})

module.exports = pool;