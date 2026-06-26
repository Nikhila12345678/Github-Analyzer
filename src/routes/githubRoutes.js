const express = require("express");
const router = express.Router();
const axios = require("axios");
const analyzeProfile = require("../utils/analyzer");

router.get("/:username", async (req, res) => {
    try{
    const {username} = req.params;
    const response = await axios.get(
        "https://api.github.com/users/" + username
    );

    const reposResponse = await axios.get(
        "https://api.github.com/users/" + username + "/repos");
    // res.json({profile:response.data,
    //     repositories: reposResponse.data
    // });

    const repositories = reposResponse.data;
    const analysis = analyzeProfile(
        response.data,
        reposResponse.data
    );
     res.json(analysis);

}
    catch(err){
        res.status(404).json({
          message: "GitHub user not found"
        });
    }
});

module.exports = router;
