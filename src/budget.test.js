/*jslint plusplus: true */
/*jslint nomen: true*/
/*global $:false, test:false, ok:false, equal:false, convertStringToBudget */
/* brackets-xunit: qunit */
/* brackets-xunit: includes=budget.js* */
import {convertStringToBudget} from './budget';

test("Simple numbers", function () {
    expect(convertStringToBudget("1")).toBe(1);//, "1 is 1 works for simple numbers");
    expect(convertStringToBudget("1.1")).toBe(1.1);//, "1.1 is 1.1 works for decimals");
    expect(convertStringToBudget("1000")).toBe(1000);//, "1000 is 1000");
    expect(convertStringToBudget("1k")).toBe(1000);//, "1k is 1000");
    expect(convertStringToBudget("1.1k")).toBe(1100);//, "1.1k is 1100");
    expect(convertStringToBudget("1.12K")).toBe(1120);//, "1.12K is 1120");
});
    
test("Currency Numbers", function () {
    expect(convertStringToBudget("£1")).toBe(1);//, "£1 is 1");
    expect(convertStringToBudget("£1.1")).toBe(1.1);//, "£1.1 is 1.1");
    expect(convertStringToBudget("£1000")).toBe(1000);//, "£1000 is 1000");
    expect(convertStringToBudget("£1k")).toBe(1000);//, "£1k is 1000");
    expect(convertStringToBudget("£1.1k")).toBe(1100);//, "£1.1k is 1100");
    expect(convertStringToBudget("€1")).toBe(1);//, "€1 is 1");
    expect(convertStringToBudget("$1")).toBe(1);//, "$1 is 1");
    expect(convertStringToBudget("R1")).toBe(1);//, "R1 is 1");
    expect(convertStringToBudget("$1.01c")).toBe(1.01);//, "$1.01c is 1.01");
    expect(convertStringToBudget("£1.01p")).toBe(1.01);//, "£1.01p is 1.01");
    expect(convertStringToBudget("€1,01c")).toBe(1.01);//, "€1,01c is 1.01");
    expect(convertStringToBudget("₹1,01")).toBe(1.01);//, "₹1,01 is 1.01");

});
test("Spaced Numbers", function () {
    expect(convertStringToBudget(" £1 ")).toBe(1);//, "1 is 1");
    expect(convertStringToBudget(" £1.1 ")).toBe(1.1);//, "1.1 is 1.1");
    expect(convertStringToBudget(" £1000 ")).toBe(1000);//, "1000 is 1000");
    expect(convertStringToBudget(" £1k ")).toBe(1000);//, "1k is 1000");
    expect(convertStringToBudget(" £1.1k ")).toBe(1100);//, "1.1k is 1100");
});

test("Confusing Numbers", function () {
    expect(convertStringToBudget("1.100.000")).toBe(1100000);//, "1.100.000 is 1100000 - european style");
    expect(convertStringToBudget("1.100.00")).toBe(110000);//, "1.100.00 is 110000 - european style");
    expect(convertStringToBudget("1.100.0")).toBe(11000);//, "1.100.00 is 110000 - european style");
    expect(convertStringToBudget("1.100")).toBe(1100);//, "1.100 is 1100 - european style");
    expect(convertStringToBudget("1.10")).toBe(1.1);//, "1.10 is 1.1 - UK style");
    expect(convertStringToBudget("1.1")).toBe(1.1);//, "1.1 is 1.1 - UK style");
    expect(convertStringToBudget("1,100")).toBe(1100);//, "1,100 is 1100 - UK style");
    expect(convertStringToBudget("1,100.00")).toBe(1100);//, "1,100.00 is 1100 - UK style");
    expect(convertStringToBudget("1.100.00")).toBe(110000);//, "1.100.00 is 110000 - european style");
    expect(convertStringToBudget("1,1")).toBe(1.1);//, "1,1 is 1.1 - european style");
    expect(convertStringToBudget("1,10")).toBe(1.1);//, "1,10 is 1.1 - european style");
    expect(convertStringToBudget("1,100")).toBe(1100);//, "1,1 is 1.1 - UK style");
    expect(convertStringToBudget("1.100,00")).toBe(1100);//, "1.100,00 is 1100 - european style");
    expect(convertStringToBudget("12,34,56.01")).toBe(123456.01);//, "12,34,56.01 is 123456.01 - Indian style");
});
