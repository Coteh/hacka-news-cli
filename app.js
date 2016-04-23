var hackaNews = require('hacka-news');
var cliDisplay = require('./src/cli-display');
var hackaFavs = require('./src/hacka-favs');
var cliProcessor = require('commander');

const DEFAULT_STORY_LIMIT = 10;

var printFavourites = function(flags){
    var savedIDs = hackaFavs.getSavedIDs();
    if (savedIDs.length == 0){
        cliDisplay.displayMessage(cliDisplay.NOFAVS_MESSAGE);
        return;
    }
    hackaNews.requestGroup(savedIDs, function(loadedContents){
        for (var i = 0; i < loadedContents.length; i++){
            if (loadedContents[i] == null){
                console.log("ERROR: Story couldn't load.");
                continue;
            }
            cliDisplay.displayContent(loadedContents[i], flags);
        }
    });
};

var printFeed = function(storyType, limit, flags){
    if (isNaN(limit)){
        limit = DEFAULT_STORY_LIMIT;
    }
    hackaNews.requestFeedStoryIDs(storyType, limit, function(ids){
        if (ids == null){
            console.log("ERROR: Stories from " + storyType + " could not load.");
            return;
        } else if (ids.error) {
            console.log("ERROR: " + ids.error + ".");
            return;
        }
        hackaNews.requestGroup(ids, function(loadedContents){
            for (var i = 0; i < loadedContents.length; i++){
                if (loadedContents[i] == null){
                    console.log("ERROR: Story couldn't load.");
                    continue;
                }
                cliDisplay.displayContent(loadedContents[i], flags);
            }
        });
    });
};

var printStory = function(id, flags){
    hackaNews.requestStoryParsed(id, function(hnJson){
        cliDisplay.displayContent(hnJson, flags);
    });
};

var cmdGiven = null;

cliProcessor
    .version('1.0.1')
    .arguments("<cmd> [arguments...]")
    .option("-l, --headlines", "headlines only")
    .option("-v, --verbose", "verbosity")
    .action(function(cmd, arguments, options){
        cmdGiven = cmd;
        if (cmd == "favs"){
            hackaFavs.openSavedPostsJSON();
            printFavourites(options);
        }else if (cmd == "top"){
            printFeed("top", arguments[0], options);
            return;
        }else if (cmd == "new"){
            printFeed("new", arguments[0], options);
            return;
        }else if (cmd == "ask"){
            printFeed("ask", arguments[0], options);
            return;
        }else if (cmd == "show"){
            printFeed("show", arguments[0], options);
            return;
        }else if (cmd == "jobs"){
            printFeed("job", arguments[0], options);
            return;
        }else if (cmd == "url"){
            if (arguments.length < 1){
                console.log("expected: an index number of the favourite story to get the url of")
            } else {
                hackaFavs.openSavedPostsJSON();
                var indexOfStory = parseInt(arguments[0]);
                try {
                    var hackaURL = hackaNews.getURL(hackaFavs.getSavedPostID(indexOfStory));
                }catch (e){
                    if (e == -1){
                        console.log("ERROR: Index entered is not a number.");
                    }else if (e == -2){
                        console.log("ERROR: This index is greater than the total amount of favourites saved.");
                    }else{
                        console.log("ERROR: Unknown error.");
                    }
                    return;
                }
                console.log(hackaURL);
            }
            return;
        }else if (cmd == "idurl"){
            if (arguments.length < 1){
                console.log("expected: an id of the hacker news post")
            } else {
                var storyID = parseInt(arguments[0]);
                try {
                    var hackaURL = hackaNews.getURL(storyID);
                }catch (e){
                    if (e == -1){
                        console.log("ERROR: Index entered is not a number.");
                    }else if (e == -2){
                        console.log("ERROR: This index is greater than the total amount of favourites saved.");
                    }else{
                        console.log("ERROR: Unknown error.");
                    }
                    return;
                }
                console.log(hackaURL);
            }
            return;
        }else if (cmd == "favid"){
            if (arguments.length < 1){
                console.log("expected: an index number of the favourite story to get the id of")
            } else {
                hackaFavs.openSavedPostsJSON();
                var indexOfStory = parseInt(arguments[0]);
                try {
                    var hackaID = hackaFavs.getSavedPostID(indexOfStory);
                }catch (e){
                    if (e == -1){
                        console.log("ERROR: Index entered is not a number.");
                    }else if (e == -2){
                        console.log("ERROR: This index is greater than the total amount of favourites saved.");
                    }else{
                        console.log("ERROR: Unknown error.");
                    }
                    return;
                }
                console.log(hackaID);
            }
            return;
        }else if (cmd == "save"){
            hackaFavs.savePostID(parseInt(arguments[0]));
        }else if (cmd == "unsave"){
            hackaFavs.unsavePostID(parseInt(arguments[0]));
        }else if (cmd == "topid"){
            var indexOfStory = 0;
            if (arguments.length >= 1){
                indexOfStory = parseInt(arguments[0]);
            }else{
                indexOfStory = 0;
            }
            try{
                hackaNews.fetchTopID(indexOfStory, function(id){
                    console.log(id);
                });
            }catch (e){
                if (e == -1){
                    console.log("No list article exists at that index number.");
                }else{
                    console.log("Unknown error!");
                }
            }
        }else if (cmd == "topurl"){
            var indexOfStory = 0;
            if (arguments.length >= 1){
                indexOfStory = parseInt(arguments[0]);
            }else{
                indexOfStory = 0;
            }
            try{
                hackaNews.fetchTopURL(indexOfStory, function(url){
                    console.log(url);
                });
            }catch (e){
                if (e == -1){
                    console.log("No list article exists at that index number.");
                }else{
                    console.log("Unknown error!");
                }
            }
        }else if (cmd == "view"){
            if (arguments.length < 1){
                console.log("expected: an id of the hacker news post")
            } else {
                var storyID = parseInt(arguments[0]);
                try {
                    printStory(storyID, options);
                }catch (e){
                    if (e == -1){
                        console.log("ERROR: Index entered is not a number.");
                    }else if (e == -2){
                        console.log("ERROR: This index is greater than the total amount of favourites saved.");
                    }else{
                        console.log("ERROR: Unknown error.");
                    }
                    return;
                }
            }
            return;
        }else{
            console.log("ERROR: Invalid command.");
        }
    })
    .on('--help', function(){
        console.log("  Commands:");
        console.log('');
        console.log("   top [limit]\t\tDisplays top stories.");
        console.log("   new [limit]\t\tDisplays new stories.");
        console.log("   ask [limit]\t\tDisplays Ask HN stories.");
        console.log("   show [limit]\t\tDisplays Show HN stories.");
        console.log("   jobs [limit]\t\tDisplays job stories.");
        console.log("   favs\t\t\tDisplays stories saved in favourites.");
        console.log("   url [fav_index]\tPrints HN url of a post of fav_index index in favourites.");
        console.log("   idurl [id]\t\tPrints HN url of a post of HN id.");
        console.log("   favid [fav_index]\tPrints HN url of a post of HN id.");
        console.log("   save [id]\t\tSave HN post by id to favourites.");
        console.log("   unsave [id]\t\tRemove HN post by id from favourites.");
        console.log("   topid [index]\tGrabs the id of the current n top post on HN, where n is the optional index argument.");
        console.log("   topurl [index]\tGrabs the url of the current n top post on HN, where n is the optional index argument.");
        console.log("   view [id]\t\tView HN post of id.");
        console.log('');
    })
    .parse(process.argv);

if (cmdGiven === null){
    cliProcessor.outputHelp();
}
