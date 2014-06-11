/*jslint nomen: true, plusplus: true */
/*global $, document, window, alert */
$(document).ready(function () {
    "use strict";
    var $list = $("#guestList"),
        $btnAdd = $("#btnAdd"),
        $txtInputName = $("#txtInputName"),
        tmpGuest = Handlebars.compile($("#tmpGuest").html()),
        guestList = [],
        createGuest = function(name) {
            var names = name.split(" "),
                surname = _.last(names),
                firstname = _.initial(names).join(" ");
            return {
                firstname: firstname,
                surname: surname
            };
        },
        updateGuestListUI = function(newRow) {
            
            $list.html(tmpGuest(_.sortBy(guestList, "surname")));
        };
    
    $btnAdd.click(function (e) {
        var name = $txtInputName.val();
        if(name) {
            var newLine = createGuest(name);
            guestList.push(newLine);
            updateGuestListUI(newLine);
        }
        $txtInputName.val("");
        console.log(guestList);
        
    });
    $txtInputName.keypress(function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
           $btnAdd.trigger("click");
        }
    });
});