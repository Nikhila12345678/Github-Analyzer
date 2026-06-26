require("dotenv").config();
const mysql = require("mysql2");

const connection = mysql.createConnection(process.env.DATABASE_URL);

const query = `
CREATE TABLE IF NOT EXISTS github_profiles (

    id INT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(100) UNIQUE NOT NULL,

    name VARCHAR(100),

    bio TEXT,

    company VARCHAR(100),

    avatar TEXT,

    profile_url TEXT,

    followers INT,

    following INT,

    public_repos INT,

    total_stars INT,

    total_forks INT,

    most_used_language VARCHAR(50),

    account_age INT,

    github_score INT

);
`;

connection.query(query, (err) => {

    if (err) {
        console.log(err);
    } else {
        console.log("Table Created Successfully");
    }

    connection.end();
});