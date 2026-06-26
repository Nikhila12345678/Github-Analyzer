const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/github/:username", async (req, res) => {
    try{
    const {username} = req.params;
    const response = await axios.get(
        "https://api.github.com/users/" + username
    );
    res.json(response.data);
    }
    catch(err){
        res.send("User not found");
        console.log(err);
    }
});

module.exports = router;
