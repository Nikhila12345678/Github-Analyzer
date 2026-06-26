const express = require("express");
require("./config/database");
const githubRoutes = require("./routes/githubRoutes");
const app = express();

app.use(express.json());

app.use("/github", githubRoutes);


app.listen(7777, () => {
    console.log("Server created successfully");
})