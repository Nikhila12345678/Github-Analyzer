const express = require("express");
const router = express.Router();
const axios = require("axios");

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

    let totalStars = 0;
    let totalForks = 0;
    let languageCount = {};

    for(const repo of repositories){
        totalStars = totalStars + repo.stargazers_count;
        totalForks = totalForks + repo.forks_count;
        const language = repo.language;
        if(language){
            languageCount[language] = (languageCount[language] || 0) + 1;
        }
    }

    let mostUsedLanguage = "";
    let max = 0;
    for(const language in languageCount){
        if(languageCount[language] > max){
               max = languageCount[language];
              mostUsedLanguage = language;
          }
    }

    const analysis = {
       username: response.data.login,
       followers: response.data.followers,
       following: response.data.following,
       publicRepos: response.data.public_repos,
       totalStars,
       totalForks,
       mostUsedLanguage
};

     res.json(analysis);

}
    catch(err){
        res.send("User not found");
        console.log(err);
    }
});

module.exports = router;
