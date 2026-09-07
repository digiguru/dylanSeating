/*jslint nomen: true, plusplus: true */
/*global document, console */
document.addEventListener('DOMContentLoaded', function () {
    "use strict";
    var list = document.getElementById("guestList"),
        btnAdd = document.getElementById("btnAdd"),
        txtInputName = document.getElementById("txtInputName"),
        guestList = [],
        createGuest = function (name) {
            var names = name.trim().split(/\s+/),
                surname = names.pop() || "",
                firstname = names.join(" ");
            return {
                firstname: firstname,
                surname: surname
            };
        },
        updateGuestListUI = function () {
            var sortedGuests = guestList.slice().sort(function (left, right) {
                    return left.surname.localeCompare(right.surname) ||
                        left.firstname.localeCompare(right.firstname);
                });

            list.replaceChildren();
            sortedGuests.forEach(function (guest) {
                var item = document.createElement("li");
                item.textContent = guest.surname + ", " + guest.firstname;
                list.appendChild(item);
            });
        },
        addGuest = function () {
            var name = txtInputName.value.trim();
            if (name) {
                guestList.push(createGuest(name));
                updateGuestListUI();
            }
            txtInputName.value = "";
            console.log(guestList);
        };

    btnAdd.addEventListener("click", addGuest);
    txtInputName.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addGuest();
        }
    });
});
