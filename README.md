- Created a Repository
- Initialized the repository
- node_modules, package.json, package-lock.json
- Install express
- Created Server
- Listen to port 7777
- Install nodemon and updated scripts inside package.json

# Creating github api
- install axios
- Created the api, when user calls api github/:username then it will fetch data using github/users/username api using axios and gives the response. Handled the errors using try catch blocks.If no username exists --> response is user not found.

- Created one more api which is /repos which shows the users repositories.
- It helps to analyze the user profile
- After getting data from repos-->
- I want to analyze the profile using stars , totalforks, most used language so using loop i counted no of stars, forks, and most used language.
- Find the account age from profile data(using current date)
- To analyze the user in better way i have calculated the github score based on their followers, public repositories and stars
- Moved all these into separate file analyzer in utils folder to make it easier
- stored the analysed data in object

# Installed MySql 
- Created database github-analyzer
- Created a table with cols as per the analysis object
- installed env configuration 
- stored db password in .env file for security

- before storing into database...have to check whether the user is already in db or not.
- If we didnt check duplicate rows will be created in db.
- For that i'm checking whether the user is already in db or not.
 If yes--> 
    just updates the details(written the insert query)
 else
   insert the new row (just update the values of the analysis using update query)

 # Get All users Api
 - Creates a api--> getprofiles
 - Gives all stored profiles
 - query(select * from github_profiles)  

 # Get single profile
 - Created an api --> app.get(/profile/username, ..)
 - get profile using (select * from github_profiles where username = req.params)
 - stored it results
 - if results length is 0. Thwn it gives profile not found.

 # Delete profile
 - Created an api app.Delete("/delete/:username, ...)
 - query--> "DELETE FROM github_profiles WHERE username = ?"
 - Deletes the profile if it exists..identified it using affected rows length
 - if length is 0
     then it gives as  "Profile Not Found"
   else 
     "Profile deletd successfully"

  # Best profile
  - Created an api app.Delete("/bestprofile, ...)
  - gives the best profile according to the github score
  - query--> "SELECT * FROM github_profiles ORDER BY github_score DESC LIMIT 1"
  - Results shows the best profiles important info

  

