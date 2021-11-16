"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertStringToBudget = convertStringToBudget;

/*jslint plusplus: true */

/*jslint nomen: true*/

/*global $:false, test:false, ok:false, equal:false */
function convertStringToBudget(input) {
  "use strict";

  var pointReg = /\./g,
      commaReg = /\,/g,
      initCurrReg = /[£$R€₹]/g,
      endCurrReg = /[pc]/g,
      pointMatch = input.match(pointReg),
      commaMatch = input.match(commaReg),
      multiply1000 = false,
      returnValue = 0; //Strip Spaces

  input = input.trim(); //Strip starting currency

  input = input.replace(initCurrReg, ""); //Strip ending currency

  input = input.replace(endCurrReg, "");

  if (input[input.length - 1] === "k" || input[input.length - 1] === "K") {
    input = input.replace("k", "").replace("K", "");
    multiply1000 = true;
  }

  if (pointMatch) {
    if (pointMatch.length >= 2) {
      //"multiple decimal points, possibly european"
      input = input.replace(pointReg, "");
    } else if (input.match(pointReg).length === 1) {
      //"1 decimal point, check decimal places"
      if (input.split(".")[1].length > 2) {
        //over 2 decimal places, it's european
        input = input.replace(pointReg, "");
      }
    }
  }

  if (commaMatch) {
    if (commaMatch.length >= 2) {
      //"multiple commas, must be UK"
      input = input.replace(commaReg, "");
    } else if (input.match(commaReg).length === 1) {
      //"1 comma, check decimal places"
      if (input.split(",")[1].length < 3) {
        //less than 3 decimal places, it's european
        input = input.replace(commaReg, ".");
      } else {
        input = input.replace(commaReg, "");
      }
    }
  }

  returnValue = parseFloat(input, 10);

  if (multiply1000) {
    returnValue = returnValue * 1000;
  }

  return returnValue;
}