const keys = require("./keys.js");
const inquirer = require("inquirer");
const Twitter = require("twitter");
const Spotify = require('node-spotify-api');
const request = require('request');
const TextAnimation = require("text-animation");
const fs = require("fs");
const twitterClient = new Twitter(keys.twitterKeys);
const spotifyClient = new Spotify(keys.spotifyKeys);


function initGreeting() {
    TextAnimation({
        text: "H e l l o\n Friend!",
        animation: "top-bottom",
        delay: 35
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
            choices: ["See Tweets", "Search Spotify", "Search Movie Database", "Work on my novel..", "Exit :("],
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
        if (r === "Search Movie Database") {
            movieChoice();
        }
        if (r === "Work on my novel..") {
            readNovel();
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

function movieChoice() {
    inquirer.prompt([
        {
            type: "list",
            message: "Pick One!",
            choices: ["Search Movie", "Return"],
            name: "choice"
        }
    ]).then(function (response) {
        if (response.choice === "Return") {
            mainMenu('Welcome Back!');
        } else {
            movieSearch()
        }
    })
}


function movieSearch() {
    inquirer.prompt([
        {
            type: "input",
            message: "Movie name: ",
            name: "choice",
        }
    ]).then(function (response) {
        process.stdout.write('\033c');
        movieCall(response.choice)
    })
}


function movieCall(movieName) {
    if (!movieName) {
        console.log("\n   :( :( :( :( Y'all messin' with me?? No Results Found! Try again :( :( :( :(\n")
        movieChoice();
    } else {
        let queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
        request(queryUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                let result = JSON.parse(body)
                console.log("\n<======= RESULTS ========>\n")
                console.log(`  Title: ${result.Title}
  Release Year: ${result.Year}
  IMDB: ${result.Ratings[0].Value}
  Rotten Tomatoes: ${result.Ratings[1].Value}
  Cast: ${result.Actors}
  Plot Summary: ${result.Plot}`)
                // console.log(JSON.parse(body))
                //            console.log("The movie's release year was: " + JSON.parse(body).Year);
            }
            console.log("\n _-_-_-_-_-_-_-_-_-_-_-_-_-_-\n")
            mainMenu("Where to now??")
        });
    }
}


function readNovel() {
    process.stdout.write('\033c');
    fs.readFile("novel.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        console.log("\n\n");
        novelChoice();
    })
}

function novelChoice() {
    inquirer.prompt([
        {
            type: "list",
            message: "Pick One!",
            choices: ["Add some more.. (It doesn't matter, no one will ever read it)", "Give up"],
            name: "choice"
    }
]).then(function (response) {
        if (response.choice === "Add some more.. (It doesn't matter, no one will ever read it)") {
            mySuperAwesomeNovelThatWillNeverGetPublishedBecausePeopleArentSmartEnoughToAppreciateIt()
        } else {
            process.stdout.write('\033c');
            mainMenu("You should probably just burn that.. What now??")

        }
    })

}








function mySuperAwesomeNovelThatWillNeverGetPublishedBecausePeopleArentSmartEnoughToAppreciateIt() {
    process.stdout.write('\033c');
    console.log("\n\n\n\n")
    inquirer.prompt([
        {
            type: "input",
            message: "Fine, add something :",
            name: "pureGenius"
    }
]).then(function (response) {
        fs.appendFile("novel.txt", "\n" + response.pureGenius, function (err) {

            if (err) {
                return console.log(err);
                mainMenu("Welcome Back!")
            }
            process.stdout.write('\033c');
            console.log("\n\nnovel updated!\n\n");
            readNovel();

        });


    })

}









initGreeting();
