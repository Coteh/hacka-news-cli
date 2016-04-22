var colors = require('colors/safe');
var hackaTime = require('hacka-news').time;

exports.NOFAVS_MESSAGE = "No favourites.";

exports.displayMessage = function(message){
    console.log(colors.yellow(message));
};

exports.displayContent = function(hnNode, flags){
    if (hnNode == null || hnNode.type == null){
        console.log("Null story.");
        return;
    }
    if (hnNode.type === "story"){
        if (!flags.headlines){
            console.log("----------------------");
        }
        console.log(colors.yellow(hnNode.title));
        if (!flags.headlines){
            console.log("By: " + hnNode.by);
            console.log(hnNode.url);
            console.log(hnNode.commentsUrl);
            console.log(hackaTime.getTimeStringFromEpoch(hnNode.time));
            console.log(hnNode.score + " points | " + hnNode.descendants + " comments");
            if (flags.verbose) console.log("ID: " + hnNode.id);
            console.log("----------------------");
        }
    } else if (hnNode.type == "comment"){
        if (!flags.headlines){
            console.log("----------------------");
            console.log("By: " + hnNode.by);
            console.log(hnNode.text);
            console.log(hnNode.commentsUrl);
            if (flags.verbose) console.log("ID: " + hnNode.id);
            console.log("Comment to thread: \n\t\"" + ((hnNode.rootParent != null) ? hnNode.rootParent.title : "Null title") + "\"");
            console.log("\t" + "By: " + hnNode.rootParent.by);
            console.log("\t" + hnNode.rootParent.url);
            console.log("\t" + hnNode.rootParent.commentsUrl);
            console.log(hackaTime.getTimeStringFromEpoch(hnNode.time));
            console.log("\t" + hnNode.rootParent.score + " points | " + hnNode.rootParent.descendants + " comments");
            console.log("----------------------");
        }else{
            //Display that they commented to thread of their root parent
            console.log(hnNode.by + "\'s comment to thread: \"" + ((hnNode.rootParent != null) ? hnNode.rootParent.title : "Null title") + "\"");
        }
    } else if (hnNode.type == "job"){
        if (!flags.headlines){
            console.log("----------------------");
            console.log("Job: " + colors.yellow(hnNode.title));
            console.log(hnNode.commentsUrl);
            console.log(hackaTime.getTimeStringFromEpoch(hnNode.time));
            if (flags.verbose){
                console.log("ID: " + hnNode.id);
            }
            console.log("----------------------");
        }else{
            console.log(colors.yellow(hnNode.title));
        }
    } else if (hnNode.type == "poll"){
        if (!flags.headlines){
            console.log("----------------------");
            console.log(colors.yellow(hnNode.title));
            for (var i = 0; i < hnNode.parts.length; i++){
                //Display title of each pollopt
                console.log("- " + ((hnNode.partNodes[i] != null) ? hnNode.partNodes[i].text : "Null poll option"));
            }
            console.log(hnNode.commentsUrl);
            console.log(hackaTime.getTimeStringFromEpoch(hnNode.time));
            if (flags.verbose){
                console.log("ID: " + hnNode.id);
                console.log("Pollopt IDS: " + hnNode.parts);
            }
            console.log("----------------------");
        }else{
            console.log(colors.yellow(hnNode.title));
        }
    } else if (hnNode.type == "pollopt"){
        if (!flags.headlines){
            console.log("----------------------");
            console.log("Poll option: " + colors.yellow(hnNode.text));
            if (flags.verbose){
                console.log("ID: " + hnNode.id);
            }
            console.log("----------------------");
        }else{
            console.log(colors.yellow("Pollopt: " + hnNode.text));
        }
    }
};
