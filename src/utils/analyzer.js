const analyzeProfile = (profile, repositories) => {
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

    const currentDate = new Date();
    const createdDate = new Date(profile.created_at);
    const diff = currentDate - createdDate;
    const accountAge = Math.floor(
    diff / (1000 * 60 * 60 * 24 * 365));
    const githubScore =
        (profile.followers * 2) + (profile.public_repos * 5) + (totalStars * 3);

    const analysis = {
       username: profile.login,
       name: profile.name,
       bio: profile.bio,
       company: profile.company,
       avatar: profile.avatar_url,
       profileUrl: profile.html_url,
       followers: profile.followers,
       following: profile.following,
       publicRepos: profile.public_repos,
       totalStars,
       totalForks,
       mostUsedLanguage,
       accountAge,
       githubScore,
    };

    return analysis;
}

module.exports = analyzeProfile;