var should = require('should');
var mockery = require('mockery');
var hackaFavs = null;

var written = null;

var mockeryOptions = {
    useCleanCache: true
};

var fsMock = {
    readFileSync: function(path, options) {
        return "{\"ids\":[1, 2, 3, 4, 5, 6]}";
    },
    writeFile: function(path, data, callback) {
        written = data;
        callback(null);
    }
}

var fsSaveMock = {
    readFileSync: function(path, options) {
        return "{\"ids\":[]}";
    },
    writeFile: fsMock.writeFile
}

var osMock = {
    homedir: function() {
        return "/home/james";
    }
}

var pathMock = {
    normalize: function(path) {
        return path;
    }
}

describe("hacka-favs", function(){
    before(function(){
        mockery.registerAllowables(["fs", "os", "path", "../src/hacka-favs"]);
    });
    describe("properties", function(){
        var testArr = [1, 2, 3, 4, 5, 6];

        before(function(){
            mockery.enable(mockeryOptions);
            mockery.registerMock("os", osMock);
            mockery.registerMock("path", pathMock);
            hackaFavs = require("../src/hacka-favs");
            hackaFavs.setSavedPostIDS(testArr);
        });
        it("should get the URL of the current designated filepath for the favourites file", function(){
            hackaFavs.getSavedLocation().should.equal("/home/james/.hnsaved");
        });
        it("should get a list of saved post IDs", function(){
            hackaFavs.getSavedIDs().should.deepEqual(testArr);
        });
        it("should get a saved post ID by positional index from the array, given an index", function(){
            hackaFavs.getSavedPostID(4).should.equal(5);
        });
        after(function(){
            mockery.deregisterMock("os");
            mockery.deregisterMock("path");
            mockery.disable();
        });
    });
    describe("opening favourites file", function(){
        before(function(){
            mockery.enable(mockeryOptions);
            mockery.registerMock("fs", fsMock);
            hackaFavs = require("../src/hacka-favs");
        });
        it("should add loaded post IDs to the program's current state", function(){
            hackaFavs.openSavedPostsFile();
            hackaFavs.getSavedIDs().should.deepEqual([1, 2, 3, 4, 5, 6]);
        });
        after(function(){
            mockery.deregisterMock("fs");
            mockery.disable();
        });
    });
    describe("writing to favourites file", function(){
        var testArr = [1, 2, 3, 4, 5, 6];

        before(function(){
            mockery.enable(mockeryOptions);
            mockery.registerMock("fs", fsMock);
            hackaFavs = require("../src/hacka-favs");
        });
        it("should write saved post IDs to favourites file", function(){
            hackaFavs.setSavedPostIDS(testArr);
            hackaFavs.writeFavourites();
            written.should.equal("{\"ids\":[1,2,3,4,5,6]}");
            written = null;
        });
        after(function(){
            mockery.deregisterMock("fs");
            mockery.disable();
        });
    });
    describe("saving posts", function(){
        before(function(){
            mockery.enable(mockeryOptions);
            mockery.registerMock("fs", fsSaveMock);
            hackaFavs = require("../src/hacka-favs");
        });
        it("should be able to save a post ID to favourites and write it to file.", function(){
            hackaFavs.savePostID(5);
            hackaFavs.getSavedIDs().should.deepEqual([5]);
            written.should.equal("{\"ids\":[5]}");
            written = null;
        });
        after(function(){
            mockery.deregisterMock("fs");
            mockery.disable();
        });
    });
    describe("unsaving posts", function(){
        it("should be able to unsave a post ID from favourites file.", function(){
            should.fail();
        });
    });
    describe("saving posts by url", function(){
        it("should take a Hacker News URL, extract the post ID from the URL, and save that to favourites", function(){
            should.fail();
        });
    });
    after(function(){
        mockery.deregisterAllowables(["fs", "os", "path", "../src/hacka-favs"]);
    });
});