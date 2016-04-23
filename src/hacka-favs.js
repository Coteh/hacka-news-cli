var fs = require('fs');
var os = require('os');

var HNSAVED_FILENAME = ".hnsaved";
var savedIDs = [];

var getSavedIDs = function(){
    return savedIDs;
};

var getSavedPostID = function(index){
    if (isNaN(index)){
        throw -1;
    }else if (index >= savedIDs.length){
        throw -2;
    }
    return savedIDs[index];
};

var setSavedPostIDS = function(savedList){
    for (var i = 0; i < savedList.length; i++){
        savedIDs.push(savedList[i]);
    }
};

var writeJSON = function(serialized, callback){
    fs.writeFile(os.homedir() + "/" + HNSAVED_FILENAME, serialized, function(err) {
        if (err){
            console.log("ERROR: Could not save file.");
            return;
        }
        if (callback != null){
            callback(err);
        }
    });
};

var openSavedPostsJSON = function(){
    var data = null;
    try{
        data = fs.readFileSync(os.homedir() + "/" + HNSAVED_FILENAME, {encoding: 'utf-8'});
    }catch(e){
        if (e.code == 'ENOENT'){
            console.log("ERROR: HN favourites file could not open. Creating new file...");
            writeJSON("{}", null);
        }
        return;
    }
    jsonObject = JSON.parse(data);
    if (jsonObject.ids != null){
        setSavedPostIDS(jsonObject.ids);
    }
};

var savePostID = function(postID){
    openSavedPostsJSON();
    savedIDs.push(postID);
    jsonObject.ids = savedIDs;
    var jsonSerialized = JSON.stringify(jsonObject);
    writeJSON(jsonSerialized, function(err){
        console.log("Successfully added post of ID " + postID + " to favourites.");
    });
};

var unsavePostID = function(postID){
    openSavedPostsJSON();
    var index = savedIDs.indexOf(postID);
    if (index <= -1){
        console.log("Could not find a post of this ID saved in your favourites.");
        return;
    }
    savedIDs.splice(index, 1);
    jsonObject.ids = savedIDs;
    var jsonSerialized = JSON.stringify(jsonObject);
    writeJSON(jsonSerialized, function(err){
        console.log("Successfully removed post of ID " + postID + " from favourites.");
    });
};

var splitByDelim = function(str, delim){
    var splitArr = [];
    var lastIndex = 0;
    for (var i = 0; i < str.length; i++){
        if (str[i] == '='){
            splitArr.push(str.substr(lastIndex, i - lastIndex));
            lastIndex = i + 1;
        }
    }
    if (lastIndex < str.length){
        splitArr.push(str.substr(lastIndex));
    }
    return splitArr;
}

var savePostURL = function(postURL){
    //Split URL string by "=" delimiter, find a string with "id",
    //grab the associated string and pass int parsed version of it into savePostID
    var splitArr = splitByDelim(postURL);
    for (var i = 0; i < splitArr.length; i++){
        if (splitArr[i].indexOf("id") > -1 && i < splitArr.length - 1){
            savePostID(parseInt(splitArr[i + 1]));
            return;
        }
    }

    console.log("Could not find a post id from this url.");
}

var savePost = function(postArgStr){
    //Check if there's: at least four characters in the string, and if the first four characters are "http"
    if (postArgStr.length >= 4 && postArgStr.indexOf("http") == 0){
        savePostURL(postArgStr);
    }else{
        savePostID(parseInt(postArgStr));
    }
}

module.exports = {
    getSavedIDs,
    getSavedPostID,
    setSavedPostIDS,
    openSavedPostsJSON,
    savePostID,
    unsavePostID,
    savePostURL,
    savePost
};
