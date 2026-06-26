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

router.get("/profile/:username", async (req, res) => {
     try{
        const {username} = req.params;
        connection.query("Select * from github_profiles where username = ?",username,
        (err, results) => {
            if(err){
                return res.status(500).json({
                    message: "Database Error"
                });
            }
            if(results.length == 0){
                return res.status(404).json({
                    message:"Profile Not Found"
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

router.delete("/delete/:username", (req, res) => {

    const { username } = req.params;

    connection.query(
        "DELETE FROM github_profiles WHERE username = ?",
        [username],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Profile Not Found"
                });
            }

            res.status(200).json({
                message: "Profile Deleted Successfully"
            });

        }
    );

});


router.get("/bestprofile", async (req, res) => {

    connection.query("SELECT * FROM github_profiles ORDER BY github_score DESC LIMIT 1",
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "No Profiles Found"
                });
            }

            res.status(200).json({
                 message: "Best GitHub Profile",
                 winner: {
                  username: results[0].username,
                  githubScore: results[0].github_score,
                  followers: results[0].followers,
                  publicRepos: results[0].public_repos,
                  totalStars: results[0].total_stars,
                  mostUsedLanguage: results[0].most_used_language
    }
});

        }
    );

});


router.get("/leaderboard", (req, res) => {

    connection.query("SELECT * FROM github_profiles ORDER BY github_score DESC",
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "No Profiles Found"
                });
            }

            const leaderboard = results.map((profile, index) => ({
                rank: index + 1,
                badge:
                    index === 0 ? "Gold" :
                    index === 1 ? "Silver" :
                    index === 2 ? "Bronze" :
                    null,
                username: profile.username,
                githubScore: profile.github_score,
                followers: profile.followers,
                publicRepos: profile.public_repos,
                totalStars: profile.total_stars,
            }));

            res.status(200).json({
                totalProfiles: leaderboard.length,
                leaderboard
            });

        }
    );

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
