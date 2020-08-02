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

To get running use the following.

First get mongo running:
```bash
brew tap mongodb/brew
brew install mongodb-community@4.2
brew services start mongodb-community@4.2
```

And then start a dev server like:

```
MONGOATLAS_CONNECTION=mongodb://localhost:27017/digiguruSeating node socketExampleExpress.js
```

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

