/*jslint nomen:true, esnext:true */
/*global $:false*/
/**
 * @license DylanSeating v1
 *
 * (c) 2011-2012 by digiguru (Adam Hall)
 *
 * License: Creative Commons 3.0 (http://creativecommons.org/licenses/by-nc/3.0/)
 * Prequisites : jQuery, underscore, rapheal
 **/

(function() {
    "use strict";
    class Client {
        log (msg, callback) {
            var $li = $("<li>" + msg + "</li>").hide();
            $li.appendTo($("#console")).slideDown(callback);
        }
    }

    class Receiver {
        constructor(client) {
            this.data = 1;
            this.client = client;
            this.client.log("Data starts off with " + this.data);
        }
        increase (callback) {
            this.data++;
            this.client.log("Increment. My data is now " + this.data, callback);
        }
        decrease (callback) {
            this.data--;
            this.client.log("Decrement. My data is now " + this.data, callback);
        }
    }

    class Invoker {
        constructor(client) {
            this.client = client;
            this.undoActions = [];
            this.redoActions = [];
        }
        undo (callback) {
            var action = this.undoActions.pop();
            if (action) {
                this.redoActions.push(action.opposite());
                return action.run(callback);
            } else {
                this.client.log("can't undo - no more actions", callback);
            }

        }
        redo (callback) {
            var action = this.redoActions.pop();
            if (action) {
                this.undoActions.push(action.opposite());
                return action.run(callback);
            } else {
                this.client.log("can't redo - no more actions", callback);
            }
        }
        call (action, callback) {
            this.undoActions.push(action);
            return action.run(callback);
        }
    }

    class BaseCommand {
        constructor(reciever) {
            this.reciever = reciever;
            this.reverse = false;
        }
        run (callback) {
            if (!this.reverse) {
                return this.forward(callback);
            } else {
                return this.backward(callback);
            }
        }
        opposite () {
            this.reverse = !this.reverse;
            return this;
        }
    }

    class ExampleCommand extends BaseCommand {
        forward (callback) {
            this.reciever.increase(callback);
        }
        backward (callback) {
            this.reciever.decrease(callback);
        }
    }

    var c = new Client();
    var r = new Receiver(c);
    var i = new Invoker(c);
    i.call(new ExampleCommand(r), function () {
        i.call(new ExampleCommand(r), function () {

            i.undo(function () {
                i.undo(function () {
                    i.undo(function () {
                        i.redo(function () {
                            i.redo(function () {
                                i.redo();
                            });
                        });
                    });

                });
            });
        });
    });
}());