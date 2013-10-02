/*jslint plusplus: true */
/*jslint nomen: true*/
/*global $:false, test:false, ok:false, equal:false, convertStringToBudget */
/* brackets-xunit: qunit */
/* brackets-xunit: includes=budget.js* */
(function () {
    "use strict";
    test("Simple numbers", function () {
        equal(convertStringToBudget("1"), 1, "1 is 1 works for simple numbers");
        equal(convertStringToBudget("1.1"), 1.1, "1.1 is 1.1 works for decimals");
        equal(convertStringToBudget("1000"), 1000, "1000 is 1000");
        equal(convertStringToBudget("1k"), 1000, "1k is 1000");
        equal(convertStringToBudget("1.1k"), 1100, "1.1k is 1100");
        equal(convertStringToBudget("1.12K"), 1120, "1.12K is 1120");
    });
    
    test("Currency Numbers", function () {
        equal(convertStringToBudget("£1"), 1, "£1 is 1");
        equal(convertStringToBudget("£1.1"), 1.1, "£1.1 is 1.1");
        equal(convertStringToBudget("£1000"), 1000, "£1000 is 1000");
        equal(convertStringToBudget("£1k"), 1000, "£1k is 1000");
        equal(convertStringToBudget("£1.1k"), 1100, "£1.1k is 1100");
        equal(convertStringToBudget("€1"), 1, "€1 is 1");
        equal(convertStringToBudget("$1"), 1, "$1 is 1");
        equal(convertStringToBudget("R1"), 1, "R1 is 1");
        equal(convertStringToBudget("$1.01c"), 1.01, "$1.01c is 1.01");
        equal(convertStringToBudget("£1.01p"), 1.01, "£1.01p is 1.01");
        equal(convertStringToBudget("€1,01c"), 1.01, "€1,01c is 1.01");
        equal(convertStringToBudget("₹1,01"), 1.01, "₹1,01 is 1.01");

    });
    test("Spaced Numbers", function () {
        equal(convertStringToBudget(" £1 "), 1, "1 is 1");
        equal(convertStringToBudget(" £1.1 "), 1.1, "1.1 is 1.1");
        equal(convertStringToBudget(" £1000 "), 1000, "1000 is 1000");
        equal(convertStringToBudget(" £1k "), 1000, "1k is 1000");
        equal(convertStringToBudget(" £1.1k "), 1100, "1.1k is 1100");
    });

    test("Confusing Numbers", function () {
        equal(convertStringToBudget("1.100.000"), 1100000, "1.100.000 is 1100000 - european style");
        equal(convertStringToBudget("1.100.00"),  110000, "1.100.00 is 110000 - european style");
        equal(convertStringToBudget("1.100.0"),   11000, "1.100.00 is 110000 - european style");
        equal(convertStringToBudget("1.100"),     1100, "1.100 is 1100 - european style");
        equal(convertStringToBudget("1.10"),      1.1, "1.10 is 1.1 - UK style");
        equal(convertStringToBudget("1.1"),       1.1, "1.1 is 1.1 - UK style");
        equal(convertStringToBudget("1,100"),     1100, "1,100 is 1100 - UK style");
        equal(convertStringToBudget("1,100.00"),  1100, "1,100.00 is 1100 - UK style");
        equal(convertStringToBudget("1.100.00"),  110000, "1.100.00 is 110000 - european style");
        equal(convertStringToBudget("1,1"),       1.1, "1,1 is 1.1 - european style");
        equal(convertStringToBudget("1,10"),      1.1, "1,10 is 1.1 - european style");
        equal(convertStringToBudget("1,100"),     1100, "1,1 is 1.1 - UK style");
        equal(convertStringToBudget("1.100,00"),  1100, "1.100,00 is 1100 - european style");
        equal(convertStringToBudget("12,34,56.01"),  123456.01, "12,34,56.01 is 123456.01 - Indian style");
    });

}());