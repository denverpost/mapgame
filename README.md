# Map Game
Make a "Where Is X (Country / City / Point of Interest) On The Map?" game.

# How-To's

## How to create a map game
1. Figure out the place you want to guess.
1. Create the KML file(s) for the place, add them to repo.
1. Create the database record for the place -- [www/newgame.bash](www/newgame.bash) streamlines this process, and should be run from the command line of the server you're running this on.
1. Create the markup for the particular mapgame. [Here's one example of this](www/games/map-find-boundary.html)
1. Upload the markup to production ([example](http://extras.denverpost.com/app/mapgame/games/moscow.html)), then iframe it into an article ([example](http://www.denverpost.com/2017/01/12/map-game-russia-moscow/)).

## How to get started with a dev environment
1. Check out this repo. `git clone git@github.com:denverpost/mapgame.git`
1. Symlink the repo's www directory into an active webserver on your computer.
1. To start on testing the backend, take a look at the sql in www/admin/tables.sql

# License

The MIT License (MIT)

Copyright © 2015-2017 The Denver Post

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
