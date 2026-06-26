const express = require("express");
const router = express.Router();
const axios = require("axios");
const analyzeProfile = require("../utils/analyzer");
const connection = require("../config/database");

router.get("/getprofiles", async (req, res) => {
     try{
        connection.query("Select * from github_profiles",
        (err, results) => {
            if(err){
                return res.status(500).json({
                    message: "Database Error"
                });
            }
            res.json(results);
        }
      );
     }
     catch(err){
        res.status(500).json({
            message: "Internal Server Error"
        })
     }
});


router.get("/:username", async (req, res) => {
    try{
    const {username} = req.params;
    const response = await axios.get(
        "https://api.github.com/users/" + username
    );

    const reposResponse = await axios.get(
        "https://api.github.com/users/" + username + "/repos");
    

    //const repositories = reposResponse.data;
    
    const analysis = analyzeProfile(
        response.data,
        reposResponse.data
    );
    connection.query(
        "SELECT * FROM github_profiles WHERE username = ?",
        [analysis.username],
        (err, results) => {
            if(err){
                return res.status(500).json({
                    message: "Database Error"
                });
            }
            console.log(results);
            if(results.length > 0){
                console.log("User already Exists");
                connection.query("UPDATE github_profiles SET name=?,bio=?,company=?,avatar=?,profile_url=?,followers=?,following=?,public_repos=?,total_stars=?,total_forks=?, most_used_language=?,account_age=?,github_score=?, location=?   WHERE username=?",
                 [analysis.name,analysis.bio,analysis.company,analysis.avatar,
                    analysis.profileUrl,analysis.followers,analysis.following,analysis.publicRepos,analysis.totalStars,analysis.totalForks,
                    analysis.mostUsedLanguage,analysis.accountAge,analysis.githubScore,analysis.location, analysis.username],
             (err,result)=>{
                 if(err){
                    console.log(err);
                     return res.status(500).json({
                     message:"Update Failed",
                     error: err.sqlMessage
                  });
                }
                res.json({
                  message:"Profile Updated Successfully",
                  data:analysis
               });
            });
           }
           else{
                console.log("New User");
                connection.query(
                 "INSERT INTO github_profiles(username,name,bio,company,avatar,profile_url,followers,following,public_repos,total_stars,total_forks,most_used_language,account_age,github_score, location) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?)",
                  [analysis.username,analysis.name,analysis.bio,analysis.company,analysis.avatar,
                   analysis.profileUrl,analysis.followers,analysis.following,analysis.publicRepos,
                   analysis.totalStars,analysis.totalForks,analysis.mostUsedLanguage,
                   analysis.accountAge,analysis.githubScore, analysis.location],
            (err,result)=>{
               if(err){
                console.log(err);
                return res.status(500).json({
                message:"Insert Failed",
                error: err.sqlMessage
            });
            }
              res.json({
                message:"Profile Stored Successfully",
               data:analysis
             });
           });
            }
        }
    );
}
    catch(err){
        res.status(404).json({
          message: "GitHub user not found"
        });
    }
});


module.exports = router;
