"use strict";

var _jquery = _interopRequireDefault(require("jquery"));

var _raphael = _interopRequireDefault(require("raphael"));

var _dylanSeatingHitched = require("./dylanSeatingHitched");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var myDylanSeating = new _dylanSeatingHitched.DylanSeating(_jquery["default"], _raphael["default"]);