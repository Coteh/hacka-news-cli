var should = require('should');
var mockery = require('mockery');
var hackaFavs = null;

var fsMock = {
    readFileSync: function(path, options) {
        return "{\"ids\":[1, 2, 3, 4, 5, 6]}";
    }
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
    describe("properties", function(){
        var testArr = [1, 2, 3, 4, 5, 6];

        before(function(){
            mockery.enable({
                useCleanCache: true
            });
            mockery.registerMock("os", osMock);
            mockery.registerMock("path", pathMock);
            mockery.registerAllowable("fs");
            mockery.registerAllowable("../src/hacka-favs");
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
            mockery.enable({
                useCleanCache: true
            });
            mockery.registerMock("fs", fsMock);
            mockery.registerAllowable("os");
            mockery.registerAllowable("path");
            mockery.registerAllowable("../src/hacka-favs");
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
    describe("saving posts", function(){
        it("should be able to save a post ID to favourites file.", function(){
            should.fail();
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
});
