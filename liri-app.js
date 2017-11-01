const keys = require("./keys.js");
const inquirer = require("inquirer");
const Twitter = require("twitter");
const Spotify = require('node-spotify-api');
const TextAnimation = require("text-animation")
const twitterClient = new Twitter(keys.twitterKeys);
const spotifyClient = new Spotify(keys.spotifyKeys)


function initGreeting() {
    TextAnimation({
        text: "H e l l o\n Friend!",
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
            //            process.exit();
            TextAnimation({
                text: "B y e\n  forever!",
                animation: "bottom-top",
                delay: 30
            }, function (err) {
                if (err) {
                    throw err
                }
                process.stdout.write('\033c');
                process.exit();
            })
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
            choices: ["Search Song", "Search Artist", "Return"],
            name: "choice"
        }
    ]).then(function (response) {
        process.stdout.write('\033c');
        if (response.choice === "Return") {
            mainMenu('Welcome Back!');
        } else if (response.choice === "Search Song") {
            spotifySearch("Song", "track");
        } else {
            spotifySearch("artist", "artist");
        }
    })
}


function spotifySearch(msg, callType) {
    inquirer.prompt([
        {
            type: "input",
            message: msg + " name: ",
            name: "choice"
        }
    ]).then(function (response) {
        process.stdout.write('\033c');
        spotifyCall(callType, response.choice)
    })
}


function spotifyCall(type, query) {
    spotifyClient.search({
        type: type,
        query: query,
        limit: 50
    }).then(function (response) {
        if (type === 'track') {
            songResults(response)
        } else {
            artistResults(response);
        }
    }).catch(function (err) {
        console.log(err);
    })
}

function songResults(response) {
    let results = response.tracks.items
    if (results.length < 1) {
        console.log("   Y'all messin' with me?? No Results Found! Try again\n")
        spotifyChoice();
    } else {
        console.log("************** RESULTS ********************")
        console.log("\n<=== Only Full Albums Shown, no 'Singles' ===>\n")
        for (let i = 0; i < 10; i++) {
            if (results[i].album.album_type === 'album') {
                console.log("\266 \266 \266 \266 \266 \266 \266 \266 \266 \266 \266 \266 \266 \266 \266 \266")
                console.log(`  Artist: ${results[i].artists[0].name}
  Song: ${results[i].name}
  Album: ${results[i].album.name}
  Preview: ${results[i].preview_url}`)
                console.log("\266 \266 \266 \266 \266 \266 \266 \266 \266 \266 \266 \266 \266 \266 \266 \266\n\n")
            }
        }
        mainMenu("Where to now??");
    }
}

function artistResults(response) {
    console.log("******** UNDER CONSTRUCTION **********")
    console.log(response)
    console.log("******** UNDER CONSTRUCTION **********")
}









initGreeting();
