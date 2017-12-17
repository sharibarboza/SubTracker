# SubSnoop

SubSnoop is a web app built with AngularJS that uses the Reddit API to group a user's comments and submissions by subreddit. The site is located [here](https://subsnoop-e6873.firebaseapp.com/#/).

On a user's main page, you can sort a user's active subreddits by a number of categories, such as *most recent activity*, *most upvotes*, *most submissions*, and more.

Use the user's search page to look up comments and/or submissions that contain specific words or phrases. The results will be grouped by subreddit.

### Installation

1. Make sure you have node.js and npm installed
2. ```npm install -g bower```
3. ```npm install && bower install```

### Run locally

```grunt serve```<br>
Application will be served at [http://localhost:3000/](http://localhost:3000/)

### Build for Production

```grunt build```<br>
The build will be stored in the /dist directory.

---
SubSnoop is not affiliated with [Reddit, Inc.](https://www.reddit.com) and does not require the user to be signed into a Reddit account.
