const {Pool} = require("pg");

const pool = new Pool({
    user: "postgres",
    password: "mypass",
    host: "localhost",
    port: 5432,
    database: "AMD"
});

module.exports = pool;