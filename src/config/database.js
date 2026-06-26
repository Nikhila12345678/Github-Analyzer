const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
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
