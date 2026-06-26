const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DATABASE_PASSWORD,
    database: "github_analyzer"
});

connection.connect((err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("Database Connected Successfully");
    }
});

module.exports = connection;
