const keys = require("./keys.js");
//console.log(keys)
const inquirer = require("inquirer");
const Twitter = require("twitter");
const twitterClient = new Twitter(keys.twitterKeys);
const TextAnimation = require("text-animation")
const Spotify = require('node-spotify-api');
const spotifyClient = new Spotify(keys.spotifyKeys)


function initGreeting() {
    TextAnimation({
        text: "Hello Friend!!",
        animation: "top-bottom",
        delay: 30
    }, function (err) {
        if (err) {
            throw err
        }
        process.stdout.write('\033c');
        mainMenu("Hey! Hi! How are ya? What can I do ya for??");

    })
}


function mainMenu(msg) {
    inquirer.prompt([
        {
            type: "list",
            message: msg,
            choices: ["See Tweets", "Search Spotify", "Search Movie Database", "Run Commands.txt", "Exit :("],
            name: "choice"
    }
]).then(function (response) {
        //clears screen
        let r = response.choice
        process.stdout.write('\033c');
        console.log(response.choice)
        if (r === "See Tweets") {
            tweetChoice();
        }
        if (r === "Search Spotify") {
            spotifyChoice();
        }
        if (r === "Exit :(") {
            process.stdout.write('\033c');
            process.exit();
        }
        //run function corresponding to input 

    });
};





function tweetChoice() {
    //    process.stdout.write('\033c');
    inquirer.prompt([
        {
            type: "list",
            message: "Pick One!",
            choices: ["My Tweets", "Search User", "Return"],
            name: "choice"
        }
    ]).then(function (response) {
        process.stdout.write('\033c');
        if (response.choice === "Return") {
            mainMenu('Welcome Back!');
            //I'd like to change this so you can enter in and then save your username maybe?
        } else if (response.choice === "My Tweets") {
            getTweets('mkdoh3');
        } else {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Twitter Username > ",
                    name: "user"
                }
            ]).then(function (response) {
                getTweets(response.user)
            })
        }
    })
};



function getTweets(userName) {
    process.stdout.write('\033c');
    const params = {
        screen_name: userName,
        count: 5
    };
    twitterClient.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            //can you make template strings not look horrendous??
            if (tweets.length === 0) {
                console.log('This lameazoid has never tweeted! SAD! \nLets try again :D\n')
                tweetChoice()
            } else {

                console.log(`            @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                    ${tweets[0].user.name}      
            @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`)
                tweets.forEach(function (e) {
                    console.log(`
        <<---- ${e.created_at} ---->>
  "${e.text}"
            <<-- RT: ${e.retweet_count} --- Favs: ${e.favorite_count} -->>
`)
                })
                mainMenu("Where to now??");
            }
        } else {
            console.log(`
<-- Why you gotta do me like that? Enter a valid username or GTheckO! -->
`)
            tweetChoice();
        }
    })

};



function spotifyChoice() {
    inquirer.prompt([
        {
            type: "list",
            message: "Pick One!",
            choices: ["Search Song", "Top Ten", "Return"],
            name: "choice"
        }
    ]).then(function (response) {
        process.stdout.write('\033c');
        if (response.choice === "Return") {
            mainMenu('Welcome Back!');
        }
        if (response.choice === "Search Song") {
            spotifySearch();
        }
    })
}



function spotifySearch() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter Song Name > ",
            name: "choice"
        }
    ]).then(function (response) {

        spotifyClient
            .search({
                type: 'track',
                query: response.choice,
                limit: 3
            })
            .then(function (response) {
                console.log(response.tracks.items)
                response.tracks.items.forEach(function (e) {

                    console.log("song", e.name)
                    console.log("album", e.album.name);
                    console.log("artist", e.artists.name)
                })
            })
            .catch(function (err) {
                console.log(err);
            })
    })
}









initGreeting();
