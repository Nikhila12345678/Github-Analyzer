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