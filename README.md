DylanSeating.js
===============

This is an experiment with [NodeJS](http://nodejs.org/), [Soket.IO](http://socket.io/) and [RaphaelJS](http://raphaeljs.com/).

The premise is to make a really basic navigation. No right clicks, no peculiar quasimods. Just a straight forward rich exciting UI.

After being inspired by new fangled awsome sites like [Trello](http://trello.com) I thought collaberation would be a perfect match to a table planner, brides and grooms can design their seating plan for their big day with the minimum of fuss.

Example Site
============

I have created a free Heroku to test the product. 

http://digiguru.herokuapp.com/


Development Site
================

The project now targets Node 24 and uses current Express, Mongoose, Socket.IO,
Jest and Puppeteer releases. Install dependencies and build the browser assets
before starting it:

```bash
npm ci
npm run build
```

The build copies the supported browser distributions of jQuery, Underscore,
Raphaël and Socket.IO from `node_modules` into `static/vendor`, then creates a
deployable `public` directory. These generated files are not committed.

To run validation locally:

```bash
npm run check
npm run test:unit
npx puppeteer browsers install chrome
npm run test:browser
```

The browser test uses the Chrome version required by the installed Puppeteer
release. The CI workflow installs it, along with its Linux libraries, for you.

To run the application, set a MongoDB connection string and start the server:

```
MONGOATLAS_CONNECTION=mongodb://localhost:27017/digiguruSeating npm start
```

The server now reports a clear startup error when this variable is missing,
rather than attempting a connection during module import.

Vercel deployment
=================

Vercel runs `npm run build`, which creates a deployable `public` directory.
The static client is served from that directory and the Socket.IO server is
exposed as the Node.js function at `/api/socket-io`.

Set these environment variables in Vercel for both Preview and Production:

```bash
MONGOATLAS_CONNECTION=<your MongoDB Atlas connection string>
```

For reliable live updates when Vercel runs more than one function instance,
also configure a Redis-compatible service and set:

```bash
REDIS_URL=<your Redis connection string>
```

The browser connects directly by WebSocket to
`/api/socket-io/socket.io`; Socket.IO long-polling is intentionally disabled
because Vercel Functions require the WebSocket transport.

Next Up Tasks
=============

 * Make the actions that go to and from the server a collection
   Basically all functions that go to and from the server are
   single objects - "PlaceGuestOnNewSeat" will create a new
   seat and then place a guest on it - really it should be a
   collection of ["CreateNewSeat", "MoveGuestToSeat"]

Future Ideas
============

 * Redis storage rather than mongo (don't really use the full power of mongo, redis would be faster)
 * OAuth integration
 * mobile / tablet investigation
 * test harness
 
Development Milestones
======================


Dec 2011

 * Learnt Rapheal
 * Made a sandbox site
 * Made desks movable
 * Made desks rotatable
 * Made seats removable
 * Made toolbar to add / drag new things to the scene

Jan 2012

 * Made seats addable
 * Draggable, rotatable guests
 * Upgraded to Rapheal 2.0.1 (Thanks @DmitryBaranovskiy)
 * Animated most actions
 * Used http://jsbeuautifier.org/ to format the code
 * Z-Index fixes
 * Performance
 * Started to create a backend in Node.JS
 * General refactoring
 * Learnt socket.io

Feb 2012

 * Learnt Node
 * Learnt Mongo
 * Added Sockets.io integration
 * Released to Heroku
 * Added momento pattern for undo ability
 * Linked up to server
 * Honoured the location object {x,y} rather than separated
 * Added some awesome icons
 * Stuck chairs to the desks (when they move)
 * Added persistence to a single floor plan

Mar 2012

 * Chose a creative commons license
 * Made a dropdown to select multiple plans
 * Sorted out alot of the inconsistencies in fully loading & clearing data
 * Learnt jQuery Deferred pattern
 * Deferred resolve on object load
 * Deferred resolve on object remove
 * Made guests nameable
 * Refactoring
 * Seat objects being loaded correctly
 * Add plan if the db doesn't contain any
 
Apr 2012
 
 * Buttons now disableable
 * Ability to add plans (by clicking the github button)
 

Help Wanted
===========

Please - if you are inspired by this project you can help!

I always am happy to discuss coding practice, but I would love anyone to contribute with the following skills...

 * Nice textures. Have a lovely tiling wood effect? Drop me a file!
 * Performance tuning. Do you know quadtree? Show me!
 * Accessibility advice. Are you blind? Tell me how would you plan an event!

If you have any feedback then let me know.
