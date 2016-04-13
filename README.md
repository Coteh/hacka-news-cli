# hacka-news-cli
-----------------
A command line interface (CLI) for [Hacker News](https://news.ycombinator.com/) that utilizes [their official API](https://github.com/HackerNews/API) and node.js.

### Update (April 13, 2016)
The portion of the app that directly interfaces with the API has recently been split off into its own module. You can check it out [here](https://github.com/Coteh/hacka-news).

## Features
- Print out stories from HN feeds (top, new, ask, show, and job)
- View info for individual story specified by ID
- View stories by headline only or with verbosity
- Display url for a specified post
- Save/load HN stories to/from favourites, which are stored as a local JSON state in program's directory
  - Print out list of stories that have been favourited

## Installation
Clone the repository with:  
`git clone https://github.com/Coteh/hacka-news-cli`

Then to install all the dependencies, run:  
`npm install`

## Issues
- Error comments are unorganized
- No unit/integration testing

## Future Additions
- Filter feed results by tags or url
- Open browser window for story
- Story caching: Save stories from feeds to cache
- Render HTML page for stories
- Save to Pocket integration
