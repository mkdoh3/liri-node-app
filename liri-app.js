const keys = require("./keys.js");
console.log("twitter keys", keys)
const inquirer = require("inquirer");
const Twitter = require('twitter');
const client = new Twitter(keys);



inquirer.prompt([
    {
        type: "list",
        message: "Whatchyou want?!",
        choices: ["See Tweets", "Search Spotify", "Search Movie Database", "Runs Commands.txt"],
        name: "commandInput"
    }
]).then(function (response) {
    console.log(response.commandInput)
    if (response.commandInput === "See Tweets") {
        getTweets();
    }
    //run function corresponding to input 

})

function getTweets() {
    const params = {
        screen_name: 'mkdoh3'
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log(tweets[0].text);
        }
    });
}
