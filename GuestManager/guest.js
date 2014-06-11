/*jslint nomen: true, plusplus: true */
/*global $, document, window, alert */
$(document).ready(function () {
    "use strict";
    $('#toolUserGuide').hover(function () {
        var width = $(window).width(),
            height = $(window).height();
        $('body').append('<div id="guideOverlay"></div><div id="userGuideContainer" style="width:' + width + 'px; height:' + height + 'px;"></div>');
        $('#guideOverlay').fadeIn();
        $('#userGuideContainer').fadeIn();
    }, function () {
        $('#guideOverlay').remove();
        $('#userGuideContainer').remove();
    });

});


$(document).ready(function () {
    "use strict";
    $('#toolHeadingGuide').hover(function () {
        var width = $(window).width(),
            height = $(window).height();
        $('body').append('<div id="headingOverlay"></div><div id="userGuideContainer" style="width:' + width + 'px; height:' + height + 'px;"></div>');
        $('#headingOverlay').fadeIn();
        $('#userGuideContainer').fadeIn();
    }, function () {
        $('#headingOverlay').remove();
        $('#userGuideContainer').remove();
    });

});


// Begin of file Planner/javascriptGuest.js

var asmxUrl = "/API/Planning/JSWSGuest.asmx/";
var clearState = false;
var hoverStatus = false;
var lastsel;
var guestColumn;
var currentGroup;
var newGroup;
var deleteGuestID;
var addAnother = false;
var groupStatus = false;
var RSVPStatus = false;
var checkRSVP;
var IsAccompanyingGuestSave = false;
var InlineRSVP;
var grouping = "clear";
var newGroupID;
var guestGroupID = [];
var linkParentID;
var linkChildLead;
var linkParentLead;
var linkChildID;
var linkParentGroupID;
var linkChildGroupID;
var linkParentAgeGroupID;
var linkChildAgeGroupID;
var linkParentAccompanistID;
var linkChildAccompanistID;
var hasEnterKeyExecuted = false;
var isFirstLoad = true;
var newReplacedGroup = "";
var isQuickAddCompleted = true;
var accountType = "gmail";
var isChildGuest = "false";
var $HitchedAjaxOptions = {
    type: "POST",
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    dataFilter: function (data, type) {
        "use strict";
        return $.parseJSON(data);
    },
    error: function (result) {
        "use strict";
        isQuickAddCompleted = true;
        alert("Error in server:" + result.status + ' ' + result.statusText);
    },
    cache: true
};
// Modified By Nick
// Important -  To resolve the  JQGrid issues  i.e. grouping of  column with NULL values, we did following modifications
// a.  If the Group name is null then we are returning "Z-NULL" value from the database..
// b. Using the formatter class, we are displaying blank if the group value is "Z-NULL". We have used "Z-NULL" value because if we use the empty value then during grouping, JQGrid shows "Ungrouped" item first, but we need to show the groups first in alphabetical order and last "Ungrouped" items..
// c. To handle RSVP null value, we have used  RSVPType property which contain 0 - Decline, 1- Accept and 2 -  AwaitingResponse  values. All the remaining operations are hanlded using the RSVP property.

function loading(id) {
    "use strict";
    alert("change loading panel stuff");
    $(id).loader();
    $(id).trigger("loader.show");
    /*
    var LoadingPanel = id;
    LoadingPanel.append("<div class='loading-panel' style='position:absolute;overflow: auto; width:" + LoadingPanel.width() + "px; height: " + LoadingPanel.height() + "px; z-index:5; background-color:#FFF; opacity:0.7; filter:alpha(opacity=70); '></div>");
    var paddingLeft = (LoadingPanel.width() / 2);
    var paddingTop = (LoadingPanel.height() / 2);
    LoadingPanel.append("<div class='loading-panel' style='background:url(/images/icons/loader-bg.png) 0 0 no-repeat; position:absolute; left: " + paddingLeft + "px; top: " + paddingTop + "px; z-index:6;'><img src='/images/loader.gif'/></div>");
     */
}

function changeGrouping(groupName) {
    "use strict";
    if (groupName) {
        if (groupName === "SortGuestName" || groupName === "clear") {
            $("#list").jqGrid('groupingRemove', true);
            $("#list").trigger('reloadGrid');
        } else {
            $("#list").jqGrid('groupingGroupBy', groupName);
            $("#list").jqGrid('setGridParam', {
                grouping: true
            });
            $("#list").trigger('reloadGrid');
        }
    }
}

var gSummaryReset = new (function GuestSummaryReset() {
    "use strict";
    var exports;

    function CallBackResetGuestSummary(result) {

        if (result.d !== null) {
            var resultSummary = {};
            resultSummary = result.d;
            $("#lblInvited").html(resultSummary.TotalInvited);
            $("#lblAccepted").html(resultSummary.TotalAccepted);
            $("#lblDeclined").html(resultSummary.TotalDeclined);

        }
        isQuickAddCompleted = true;
    }

    function ResetGuestSummary(weddingID) {
        var q = $HitchedAjaxOptions;
        q.url = asmxUrl + "GetGuestSummary";
        q.data = "{weddingID:" + weddingID + "}";
        q.success = CallBackResetGuestSummary;
        $.ajax(q);
    }
    exports.ResetGuestSummary = ResetGuestSummary;
    return exports;
}())();

var guestMan = new (function GuestManager() {
    "use strict";
    var exports;

    function clearHiddenFieldValues() {
        $(".hdnAdult").val('');
        $(".hdnChild").val('');
        $(".hdnBabies").val('');
        $(".hdnVegetarian").val('');
    }

    function prepopulateGuestDetails() {
        var q = $HitchedAjaxOptions,
            guestDetails = {
                Name: $(".hdnMemberName").val(),
                Email: $(".hdnMemberEmail").val(),
                RSVP: true,
                AgeGroupID: 1
            },
            ids = "",
            events = $(".chkGuestEvents span");
        
        $(".chkGuestEvents span").each(function () {
            ids = ids + $(this).attr('alt') + "|";
        });
        guestDetails.Events = ids;
        
        q.url = asmxUrl + "AddGuest";
        q.data = "{guestDetail:" + JSON.stringify(guestDetails) + ",weddingID:" + $(".hdnWeddingID").val() + "}";
        q.success = CallBackGuestList;
        $.ajax(q);
    }
    
    function CallBackGetGuest(result) {
        if (result.d) {
            var guestResult = {};
            guestResult = result.d;

            //Modified By Nick - To Bind the guest list to JQGrid at once instead of binding row by row.
            $("#list").jqGrid('clearGridData');
            $("#list").jqGrid('addRowData', "ID", guestResult.ResultList);

            gSummaryReset.ResetGuestSummary($('.hdnWeddingID').val());

            if ($(".ddlGuestType :selected").text() === 'All Guests') {
                clearHiddenFieldValues();
            }

            $(".hdnAdult").val(1);
            $(".hdnChild").val(2);
            $(".hdnBabies").val(3);

            if ($(".ddlGuestType :selected").text() !== 'All Guests') {
                $("#list").find("img").each(function () {
                    if ($(this).attr('title') === "link") {
                        $(this).css("display", "none");
                    }
                });
            }

            if (!guestResult.ResultList.length && $(".ddlGuestType :selected").text() === 'All Guests') {
                prepopulateGuestDetails();
            }
        }

        if (groupStatus) {
            changeGrouping(grouping);
        }

        //ResizeJQGridColumns();
        $("#list").find(".loading-panel").remove();
    }

    function GetGuest() {
        var q = $HitchedAjaxOptions,
            guestFilter = {},
            $ddl = $(".ddlGuestType :selected"),
            eventType = $ddl.val(),
            eventText = $ddl.text();
        q.url = asmxUrl + "GetGuest";
        
        if (eventType) {
            //This needs to consider the Event ID for "Wedding breakfast", "Evenign Reception" and future dynamic events
            guestFilter.Events = eventType;
            guestFilter.AgeGroupID = null;
            guestFilter.IsVegetarian = null;
        } else {

            if (eventText === 'All Guests') {
                guestFilter.Events = null;
                guestFilter.AgeGroupID = null;
                guestFilter.IsVegetarian = null;
            }
            if (eventText === 'All Adults') {
                guestFilter.AgeGroupID = $(".hdnAdult").val();
                guestFilter.Events = null;
                guestFilter.IsVegetarian = null;
            }
            if (eventText === 'All Children') {
                guestFilter.AgeGroupID = $(".hdnChild").val();
                guestFilter.Events = null;
                guestFilter.IsVegetarian = null;
            }
            if (eventText === 'All Babies') {
                guestFilter.AgeGroupID = $(".hdnBabies").val();
                guestFilter.Events = null;
                guestFilter.IsVegetarian = null;
            }
            if (eventText === 'All Vegetarian') {
                $(".hdnVegetarian").val(true);
                guestFilter.IsVegetarian = $(".hdnVegetarian").val();
                guestFilter.Events = null;
                guestFilter.AgeGroupID = null;
            }

        }

        q.data = "{weddingID:" + $('.hdnWeddingID').val() + ",guestFilter:" + JSON.stringify(guestFilter) + "}";
        loading($("#list"));
        q.success = CallBackGetGuest;
        $.ajax(q);

    }

    function RefreshGuestList() {
        $('.ddlGuestType').attr('selectedIndex', 0);
        GetGuest();
    }

    function CallBackGuestList(result) {
        $("#chkDeleteAll").attr('checked', false);
        $("#ddlGuestMark").attr('selectedIndex', 0);
        RefreshGuestList();
    }

    exports.GetGuest = GetGuest;
    exports.RefreshGuestList = RefreshGuestList;
    exports.CallBackGuestList = CallBackGuestList;

    return exports;

}())();

(function () {
    "use strict";

    function applyDeleteGuest(rowObject) {
        deleteGuestID = rowObject.ID;
        $("#ancdeleteguest").css('display', 'block');
        $("#btnDeleteGuest").trigger('click');
        $("#GuestName").html(rowObject.Name);
        if (!rowObject.IsLeadGuest) {
            $("#leadguestdelete").css('display', 'block');
        } else {
            $("#leadguestdelete").css('display', 'none');
        }
    }

    function callBackDeleteGuest(result, rowObject) {
        if (result.d) {
            $("#btnSeatedGuest").trigger('click');
            $("#btnRemoveSeated").click(function () {
                applyDeleteGuest(rowObject);
            });
        } else {
            applyDeleteGuest(rowObject);
        }
    }

    function deleteGuest(rowObject) {
        var q = $HitchedAjaxOptions;
        q.url = asmxUrl + "IsGuestSeated";
        q.data = "{guestID:" + rowObject.ID + "}";
        q.success = function (data) {
            callBackDeleteGuest(data, rowObject);
        };
        $.ajax(q);
    }

}());

var guestApply = new (function () {
    "use strict";
    
    function deleteLeadGuest(deleteChild) {
        var q = $HitchedAjaxOptions;
        q.url = asmxUrl + "DeleteLeadGuest";
        q.data = "{id:" + deleteGuestID + ",deleteChild:" + deleteChild + "}";
        q.success = guestMan.CallBackGuestList;
        $.ajax(q);
    }
    
    function applyLeadOrChildGuest() {
        if ($("#leadguestdelete").is(":visible")) {
            if ($("input[name='deleteguest']:checked").val() == 0) {
                deleteLeadGuest(true);
            }
            if ($("input[name='deleteguest']:checked").val() == 1) {
                deleteLeadGuest(false);
            }
            $.fancybox.close();
        } else {
            $.fancybox.close();
            var q = $HitchedAjaxOptions;
            q.url = asmxUrl + "DeleteGuest";
            q.data = "{ID:" + deleteGuestID + "}";
            q.success = guestMan.CallBackGuestList;
            $.ajax(q);
        }
    }
    return {
        applyLeadOrChildGuest: applyLeadOrChildGuest
    };
}())();

function DeleteLeadOrChildGuest() {
    guestApply.applyLeadOrChildGuest();
}

function InitializeGridData() {
    guestMan.GetGuest();
}
var guestValidation = new (function() {
    
    function ShowErrormessage(message) {
        $("#lblCommonMessage").css('display', 'block');
        $("#lblCommonMessage").html(message);
        $("#lblCommonMessage").attr('class', 'CommonMessageError');
    }

    function ShowAccompanyingErrormessage(message) {
        $("#lblAccompanyingMessage").css('display', 'block');
        $("#lblAccompanyingMessage").html(message);
        $("#lblAccompanyingMessage").attr('class', 'CommonMessageError');
    }
    
    
    function ValidatePostCode() {
        var rePostCode = new RegExp($(".hdnPostCode").val());
        return rePostCode.test($(".txtAddress6").val());
    }

    function ValidateTelephone() {
        var rePhone = new RegExp("^([0-9 ])+$");
        return rePhone.test($(".txtPhone").val());
    }

    function ValidateEmail() {
        var reEmail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        return reEmail.test($(".txtEmail").val());
    }

    function ValidateAccompanyingEmail() {
        var reEmail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        return reEmail.test($(".txtAccompanyingEmail").val());
    }
    
    function ValidateEmailAddress() {
        if ($("#txtEmailID").val() !== "") {
            var userInput = $("#txtEmailID").val();
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

            if (pattern.test(userInput) === false) {
                $("#lblAccountError").css("display", "block");
                $("#lblAccountError").html("Please enter valid email address");
                return false;
            } else {
                return true;
            }
        }
    }
    
    function ValidateAccountDetails() {
        if ($("#txtEmailID").val() == "") {
            $("#lblAccountError").css("display", "block");
            $("#lblAccountError").html("Please enter email address");
            return false;
        } else if ($("#txtPassword").val() == "") {
            $("#lblAccountError").css("display", "block");
            $("#lblAccountError").html("Please enter password");
            return false;
        } else {
            return true;
        }
    }
    
    function ValidateGuest() {
        var errorList = [];

        if (jQuery.trim($(".txtName").val()) == '') {
            errorList.push("Please enter guest name")
        }
        // Commented postcode validation because of overseas guests
        //    if (jQuery.trim($(".txtAddress6").val()) != '') {
        //        if ($(".hdnPostCode").val() != "") {
        //            if (ValidatePostCode() == false) {
        //                errorList.push("Please enter valid postcode")
        //            }
        //        }
        //    }
        if (jQuery.trim($(".txtPhone").val()) != '') {
            if (ValidateTelephone() == false) {
                errorList.push("Please enter valid telephone number")
            }
        }
        if (jQuery.trim($(".txtEmail").val()) != '') {
            if (ValidateEmail() == false) {
                errorList.push("Please enter valid email address")
            }
        }
        if (errorList.length > 0) {
            var message = "";
            jQuery.each(errorList, function (index, item) {
                message = message + (index + 1) + '. ' + item + '<br/>';
            });
            ShowErrormessage('Sorry, there was error because...' + '<br/>' + message);
            return false
        } else {
            return true;
        }
    }
    
    function ValidateAccompanyingGuest() {
        var errorList = [];

        if (jQuery.trim($(".txtAccompanyingName").val()) == '') {

            errorList.push("Please enter guest name")
        }

        if (jQuery.trim($(".txtAccompanyingEmail").val()) != '') {
            if (ValidateAccompanyingEmail() == false) {
                errorList.push("Please enter valid email address")
            }
        }

        if (errorList.length > 0) {
            var message = "";
            jQuery.each(errorList, function (index, item) {
                message = message + (index + 1) + '. ' + item + '<br/>';
            });
            ShowAccompanyingErrormessage('Sorry, there was error because...' + '<br/>' + message);
            return false
        }

    }
    return {
        ValidatePostCode: ValidatePostCode,
        ValidateTelephone: ValidateTelephone,
        ValidateEmail: ValidateEmail,
        ValidateAccompanyingEmail: ValidateAccompanyingEmail,
        ValidateEmailAddress: ValidateEmailAddress,
        ValidateAccountDetails: ValidateAccountDetails,
        ValidateAccompanyingGuest: ValidateAccompanyingGuest,
        ValidateGuest : ValidateGuest
    }
    
}())();

var updateGuest = new (function() {
    function UpdateMarkedGuests(ids, invitation, IsVegeterian) {
        var q = $HitchedAjaxOptions;
        q.url = asmxUrl + "UpdateMarkedGuests";
        q.data = "{ids:'" + ids + "',weddingID:" + $(".hdnWeddingID").val() + ",invitation:" + invitation + ",isVegeterian:" + IsVegeterian + "}";
        q.success = guestMan.CallBackGuestList;
        $.ajax(q);
    }

    function UpdateMarkedGuestsRSVP(ids, RSVP) {
        var q = $HitchedAjaxOptions;
        q.url = asmxUrl + "UpdateMarkedGuestsRSVP";
        q.data = "{ids:'" + ids + "',weddingID:" + $(".hdnWeddingID").val() + ",rsvp:" + RSVP + "}";
        q.success = guestMan.CallBackGuestList;
        $.ajax(q);
    }
    return {
        UpdateMarkedGuests: UpdateMarkedGuests,
        UpdateMarkedGuestsRSVP: UpdateMarkedGuestsRSVP
    };
}())();


(function() {

    function LinkMarkedGuest() {

        if (GetMarkedGuests() === true) {
            $("#btnLinkMarkedGuests").trigger('click');

            $("#btnLinkGuests").click(function () {
                var accompanyingGuestIDs = "";
                $("#MarkedGuests li").find('input[type=radio]').each(function () {
                    if ($(this).is(":checked") === false) {
                        accompanyingGuestIDs = accompanyingGuestIDs + $(this).attr("id") + "|";
                    }

                });
                var q = $HitchedAjaxOptions;
                q.url = asmxUrl + "LinkMarkedGuest";
                q.data = "{id:'" + $("#MarkedGuests li").find('input[type=radio]:checked').attr("id") + "',accompanyingGuestIDs:'" + accompanyingGuestIDs + "'}";
                q.success = guestMan.CallBackGuestList;
                $.ajax(q);
                $.fancybox.close();
            });
        }
    }
    function GetMarkedGuests() {
        var markedGuestHTML = "",
            guestCount = 0;

        $("#MarkedGuests").html("");
        $("#list").find('tr').each(function () {
            if ($(this).find('input[type=checkbox]').is(':checked')) {

                guestCount = guestCount + 1;
                if (markedGuestHTML == "") {
                    markedGuestHTML = markedGuestHTML + "<ul><li><input type='radio' checked='checked' value='" + $(this).find('input[type=checkbox]').val() + "'  name='rdoSelectedGuests' id='" + $(this).find('input[type=checkbox]').attr('id') + "'  /><label>" + $(this).find(".colGuestName").attr('title') + "</label></li>"
                } else {
                    markedGuestHTML = markedGuestHTML + "<li><input type='radio' name='rdoSelectedGuests' value='" + $(this).find('input[type=checkbox]').val() + "' id='" + $(this).find('input[type=checkbox]').attr('id') + "'  /><label>" + $(this).find(".colGuestName").attr('title') + "</label></li>"
                }
            }

        });
        if (guestCount >= 2) {
            $("#MarkedGuests").append(markedGuestHTML + "</ul>");
            return true;
        } else {
            alert("Please tick at least two guest in your list to link them together");
            return false;
        }
    }
}());
(function() {
    function GetUnLinkedMarkedGuests() {
        var markedGuestHTML = "",
            guestCount = 0;
        $("#UnlinkMarkedGuests").html("");
        $("#list").find('tr').each(function () {
            if ($(this).find('input[type=checkbox]').is(':checked')) {

                guestCount = parseInt(guestCount, 10) + 1;
                if (markedGuestHTML == "") {
                    markedGuestHTML = markedGuestHTML + "<ul><li><label id='" + $(this).find('input[type=checkbox]').attr('id') + "' >" + $(this).find(".colGuestName").attr('title') + "</label></li>"
                } else {
                    markedGuestHTML = markedGuestHTML + "<li><li><label id='" + $(this).find('input[type=checkbox]').attr('id') + "' >" + $(this).find(".colGuestName").attr('title') + "</label></li>"
                }
            }

        });
        if (parseInt(guestCount, 10) >= 1) {
            $("#UnlinkMarkedGuests").append(markedGuestHTML + "</ul>");
            return true;
        } else {
            alert("Please tick at least one accompanying guest in your list to unlink");
            return false;
        }
    }

    function UnlinkMarkedGuest() {
        if (GetUnLinkedMarkedGuests() === true) {
            $("#btnUnlinkMarkedGuests").trigger('click');

            $("#btnUnlinkGuests").click(function () {
                var accompanyingGuestIDs = "";
                $("#UnlinkMarkedGuests li").find('label').each(function () {
                    accompanyingGuestIDs = accompanyingGuestIDs + $(this).attr("id") + "|";
                });
                var q = $HitchedAjaxOptions;
                q.url = asmxUrl + "UnlinkMarkedGuest";
                q.data = "{ids:'" + accompanyingGuestIDs + "'}";
                q.success = guestMan.CallBackGuestList;
                $.ajax(q);
                $.fancybox.close();
            });
        }

    }
}())();
(function() {
    function UpdateMultipleGuestStatus() {
        var ids = "",
            invitation = null,
            RSVP = null,
            IsVegeterian = null;
        $("#list").find('input[type=checkbox]:checked').each(function () {
            ids = ids + $(this).attr('id') + "|";
        });
        if (ids !== "") {
            switch (parseInt($("#ddlGuestMark :selected").val(), 10)) {

            case 1: //Invited
                invitation = true;
                updateGuest.UpdateMarkedGuests(ids, invitation, IsVegeterian);
                break;
            case 2: //Invitation Not Sent
                invitation = false;
                updateGuest.UpdateMarkedGuests(ids, invitation, IsVegeterian);
                break;
            case 3: //RSVP Accepted
                RSVP = true;
                updateGuest.UpdateMarkedGuestsRSVP(ids, RSVP);
                break;
            case 4: //RSVP Declined
                RSVP = false;
                var q = $HitchedAjaxOptions;
                q.url = asmxUrl + "FindSeatedGuest";
                q.data = "{IDs:'" + ids + "'}";
                q.success = function callbackFindSeatedGuest(result) {
                    $("#SeatedGuests").empty();
                    var guestNameList = new Array();
                    guestNameList = result.d;
                    if (result.d != null && result.d.length > 0) {
                        for (var i = 0; i < guestNameList.length; i++) {
                            $("#tmpSeatedGuests").tmpl(guestNameList[i]).appendTo("#SeatedGuests");
                        }
                        $("#btnMultipleSeated").trigger('click');
                        $("#btnMultipleRemoveSeated").click(function () {
                            $.fancybox.close();
                            updateGuest.UpdateMarkedGuestsRSVP(ids, RSVP);
                        });
                    } else {
                        updateGuest.UpdateMarkedGuestsRSVP(ids, RSVP);
                    }
                }
                $.ajax(q);
                break;
            case 5: //RSVP Awaiting Response
                RSVP = null;
                var q = $HitchedAjaxOptions;
                q.url = asmxUrl + "FindSeatedGuest";
                q.data = "{IDs:'" + ids + "'}";
                q.success = function callbackFindSeatedGuest(result) {
                    $("#SeatedGuests").empty();
                    var guestNameList = new Array();
                    guestNameList = result.d;
                    if (result.d != null && result.d.length > 0) {
                        for (var i = 0; i < guestNameList.length; i++) {
                            $("#tmpSeatedGuests").tmpl(guestNameList[i]).appendTo("#SeatedGuests");
                        }
                        $("#btnMultipleSeated").trigger('click');
                        $("#btnMultipleRemoveSeated").click(function () {
                            $.fancybox.close();
                            updateGuest.UpdateMarkedGuestsRSVP(ids, RSVP);
                        });
                    } else {
                        updateGuest.UpdateMarkedGuestsRSVP(ids, RSVP);
                    }
                }
                $.ajax(q);
                break;
            case 6: //Vegetarian
                IsVegeterian = true;
                updateGuest.UpdateMarkedGuests(ids, invitation, IsVegeterian);
                break;
            case 7: //Not Vegetarian
                IsVegeterian = false;
                updateGuest.UpdateMarkedGuests(ids, invitation, IsVegeterian);
                break;
            }
        } else {
            $("#ddlGuestMark").attr('selectedIndex', 0);
            alert("There are no guests selected in your guest list. Please tick at least 1 guest in your list to update.");
        }

    }
}());















/*These ones are required for jqGrid*/
function EditGuestRSVP(ID, value, EventStatus) {
    if (EventStatus == false) {
        alert("This guest has not had an invitation sent. Please tick 'Invited' before ticking RSVP");
        return false;
    }
    RSVPStatus = true;
    InlineRSVP = value;
    var RSVPValue;
    if (InlineRSVP == true || InlineRSVP == false)
        RSVPValue = null;

    if (InlineRSVP == 'tickDisabled')
        RSVPValue = true;

    if (InlineRSVP == 'crossDisabled')
        RSVPValue = false;

    if (RSVPValue == null || RSVPValue == false) {
        var q = $HitchedAjaxOptions;
        q.url = asmxUrl + "IsGuestSeated";
        q.data = "{guestID:" + ID + "}";
        q.success = function (result) {
            if (result.d == true) {
                $("#btnSeatedGuest").trigger('click');
                $("#btnRemoveSeated").click(function () {
                    updateGuest.UpdateMarkedGuestsRSVP(ID, RSVPValue);
                    $.fancybox.close();
                });
            } else {
                updateGuest.UpdateMarkedGuestsRSVP(ID, RSVPValue);
            }
        }

        $.ajax(q);
    } else {
        updateGuest.UpdateMarkedGuestsRSVP(ID, RSVPValue);
    }
}

function EditInlineFields(ID) {
    var callBackUpdateInlineFields = function () {
        hasEnterKeyExecuted = false;
        guestMan.RefreshGuestList();
    };
    $("#ddlGuestMark").removeAttr("disabled");
    
    var q = $HitchedAjaxOptions;
    q.url = asmxUrl + "GetGuestDetailsByID";
    q.data = "{ID:" + ID + "}";
    $.ajax(q).
    done(function CallBackInlineFields(data) {
        if (result.d != null) {
            var guestDetails = new Object();
            guestDetails = result.d;
            var updateDetails = new Object();
            updateDetails.TitleID = guestDetails.TitleID
            updateDetails.Name = guestDetails.Name
            updateDetails.Addresse = guestDetails.Addresse
            updateDetails.Phone = guestDetails.Phone
            updateDetails.Email = guestDetails.Email
            updateDetails.MaleGender = guestDetails.MaleGender
            updateDetails.AgeGroupID = guestDetails.AgeGroupID
            updateDetails.IsVegetarian = guestDetails.IsVegetarian
            updateDetails.Notes = guestDetails.Notes
            updateDetails.GuestsGroupID = guestDetails.GuestsGroupID
            updateDetails.Events = guestDetails.Events
            updateDetails.RSVP = guestDetails.RSVP
            updateDetails.ID = guestDetails.ID
            updateDetails.AccompanistGuestID = guestDetails.AccompanistGuestID
            updateDetails.AddressID = guestDetails.AddressID
            updateDetails.Address1 = guestDetails.Address1
            updateDetails.Address4 = guestDetails.Address4
            updateDetails.Address5 = guestDetails.Address5
            updateDetails.Address6 = guestDetails.Address6
            updateDetails.Address6 = guestDetails.Phone
            if ($(".InlineEvents").is(":visible")) {
                var ids = ""
                var events = $("#AddEvent" + ID).find(".chkGuestEvents span");
                $(events).find('input[type=checkbox]:checked').each(function () {
                    ids = ids + $(this).parent().attr('alt') + "|";
                });

                updateDetails.Events = ids;
            }

            if ($(".InlineAddress").is(":visible")) {
                if ($("#txtAddressLine1" + ID).val() != 'Address Line1')
                    updateDetails.Address1 = $("#txtAddressLine1" + ID).val();

                if ($("#txtAddressLine2" + ID).val() != 'Address Line2')
                    updateDetails.Address4 = $("#txtAddressLine2" + ID).val();

                if ($("#txtCounty" + ID).val() != 'County')
                    updateDetails.Address5 = $("#txtCounty" + ID).val();

                if ($("#txtPostCode" + ID).val() != 'PostCode')
                    updateDetails.Address6 = $("#txtPostCode" + ID).val();

                if ($("#txtTelephone" + ID).val() != 'Telephone')
                    updateDetails.Phone = $("#txtTelephone" + ID).val();

                if ($("#txtAddressLine1" + ID).val() == 'Address Line1' && $("#txtAddressLine2" + ID).val() == 'Address Line2' && $("#txtCounty" + ID).val() == 'County' && $("#txtPostCode" + ID).val() == 'PostCode' && $("#txtTelephone" + ID).val() == 'Telephone') {
                    updateDetails.Address1 = null;
                    updateDetails.Address4 = null;
                    updateDetails.Address5 = null;
                    updateDetails.Address6 = null;
                    updateDetails.Phone = null;
                }

            }

            if ($(".InlineEmail").is(":visible")) {
                if ($("#txtEmail" + ID).val() != 'Email Address')
                    updateDetails.Email = $("#txtEmail" + ID).val();

            }

            if ($(".InlineNote").is(":visible")) {
                if ($("#txtNote" + ID).val() != 'Enter Notes')
                    updateDetails.Notes = $("#txtNote" + ID).val();
            }
            if (RSVPStatus == true) {

                if (InlineRSVP == true || InlineRSVP == false)
                    updateDetails.RSVP = null;

                if (InlineRSVP == 'tickDisabled')
                    updateDetails.RSVP = true;

                if (InlineRSVP == 'crossDisabled')
                    updateDetails.RSVP = false;
            }

            if ($(".InlineEvents").is(":visible")) {
                var l = $HitchedAjaxOptions;
                l.url = asmxUrl + "IsGuestSeated";
                l.data = "{guestID:" + updateDetails.ID + "}";
                l.success = function callbackIsGuestSeated(result) {
                    if (result.d !== null) {
                        if (result.d == true) {
                            $("#btnSeatedGuest").trigger('click');
                            $("#btnRemoveSeated").click(function () {
                                $.fancybox.close();
                                var m = $HitchedAjaxOptions;
                                m.url = asmxUrl + "UpdateGuest";
                                m.data = "{guestDetail:" + JSON.stringify(updateDetails) + "}";
                                m.success = callBackUpdateInlineFields;
                                $.ajax(m);
                                RSVPStatus = false;
                                InlineRSVP = null;

                            });
                        } else {
                            var n = $HitchedAjaxOptions;
                            n.url = asmxUrl + "UpdateGuest";
                            n.data = "{guestDetail:" + JSON.stringify(updateDetails) + "}";
                            n.success = callBackUpdateInlineFields;
                            $.ajax(n);
                            RSVPStatus = false;
                            InlineRSVP = null;
                        }
                    }
                }
                $.ajax(l);
            } else {
                var o = $HitchedAjaxOptions;
                o.url = asmxUrl + "UpdateGuest";
                o.data = "{guestDetail:" + JSON.stringify(updateDetails) + "}";
                o.success = callBackUpdateInlineFields;
                $.ajax(o);
                RSVPStatus = false;
                InlineRSVP = null;
            }
        } 
    };  
}

/*end ones required for jqGrid*/



function GetAccompanyingGuest(id) {
    var q = $HitchedAjaxOptions;
    q.url = asmxUrl + "GetAccompanyingGuest";
    q.data = "{id:" + id + ",weddingID:" + $('.hdnWeddingID').val() + "}";
    q.success = CallBackAccompanyingGuest;
    $.ajax(q).
    done(function(result) {
        if (result.d.length > 0) {
            $("#AccompanyingGuestList").empty();
            $("#DivAccompanyingGuest").empty();
            var AccompanyingGuestList = new Array();
            AccompanyingGuestList = result.d;
            $("#tmpAccompanyingGuestList").tmpl(AccompanyingGuestList).appendTo("#AccompanyingGuestList");
            $("#tmpAccompanyingGuestList").tmpl(AccompanyingGuestList).appendTo("#DivAccompanyingGuest");
            $("#lblAccGuestCount").html(result.d.length);
            $("#lblCount").html(result.d.length);
            $("#AccompanyingGuestList").css("display", "block");
            $("#DivAccompanyingGuest").css("display", "block");
        } else {
            $("#lblAccGuestCount").html("0");
            $("#lblCount").html("0");
            $("#AccompanyingGuestList").css("display", "none");
            $("#DivAccompanyingGuest").css("display", "none");
        }
        guestMan.RefreshGuestList();
    });
}

function UnlinkGuest(id, AccompanistGuestID) {
    var q = $HitchedAjaxOptions;
    q.url = asmxUrl + "UnlinkGuest";
    q.data = "{id:" + id + "}";
    $.ajax(q).
    done(function (data) {
        GetAccompanyingGuest(AccompanistGuestID)
    };
}

function SaveGuestAndAnother() {
    addAnother = true;
    SaveAccompanyingGuest();
}

function DropDownGuestSave() {
    addAnother = false;
    if ($('.ddlexistingGuests option:selected').attr('lang') != "null" && $(".hdnAddressID").val() != "") {
        $("#btnSameAddress").trigger('click');
        return false;
    }
    var q = $HitchedAjaxOptions;
    q.url = asmxUrl + "LinkGuest";
    q.data = "{id:" + $('.ddlexistingGuests option:selected').val() + ",accompanyingGuestID:" + $(".hdnGuestID").val() + "}";
    q.success = callbackSaveAccompanyingGuestDetails;
    $.ajax(q);
}

function DropDownGuestSaveDetails() {
    var q = $HitchedAjaxOptions;
    q.url = asmxUrl + "LinkGuest";
    q.data = "{id:" + $('.ddlexistingGuests option:selected').val() + ",accompanyingGuestID:" + $(".hdnGuestID").val() + "}";
    q.success = callbackSaveAccompanyingGuestDetails;
    $.ajax(q);
}

function DropDownGuestAndAnother() {
    addAnother = true;
    if ($('.ddlexistingGuests option:selected').attr('lang') != "null" && $(".hdnAddressID").val() != "") {
        $("#btnSameAddress").trigger('click');
        return false;
    }
    var q = $HitchedAjaxOptions;
    q.url = asmxUrl + "LinkGuest";
    q.data = "{id:" + $('.ddlexistingGuests option:selected').val() + ",accompanyingGuestID:" + $(".hdnGuestID").val() + "}";
    q.success = callbackDropDownGuestAndAnother;
    $.ajax(q).done(function(result) {
        guestMan.RefreshGuestList();
        ClearAccompanyingGuestDetails();
        fillFiltredGuests($(".hdnEditGroupID").val());
        addAnother = false;
        GetAccompanyingGuest($(".hdnGuestID").val());
    });
}

function ShowEditAccompayingGuest() {
    $(".accompanyingList").css("display", "none");
    $("#addAccompanyingGuest").css("display", "none");
    $(".NewAccompanyingGuest").css("display", "none");
    $("#SaveAndAddAnother").css("display", "none");
    $("#editAccompanyingGuest").css("display", "block");
    $("#existingGuestContent").css("display", "none");
    $("#accompanyingGuestContent").css("display", "block");
}

function GetGuestDetailsByID(ID) {
    GetAccompanyingGuest(ID);
    $(".accompanyingList").css("display", "block");
    $("#addguest").css("display", "none");
    $("#editguest").css("display", "block");
    var q = $HitchedAjaxOptions;
    q.url = asmxUrl + "GetGuestDetailsByID";
    q.data = "{ID:" + ID + "}";
    q.success = CallBackGetGuestDetailsByID;
    $.ajax(q);
}

function CallBackGetGuestDetailsByID(result) {
    if (result.d != null) {
        var guestDetails = new Object();
        guestDetails = result.d;
        $(".hdnAddressID").val(guestDetails.AddressID);
        $('.ddlTitle').attr('selectedIndex', guestDetails.TitleID);
        $(".txtName").val(guestDetails.Name);
        $(".txtSurname").val(guestDetails.Surname);
        $(".txtAddresse").val(guestDetails.Addresse);
        $(".txtAddress1").val(guestDetails.Address1);
        $(".txtAddress4").val(guestDetails.Address4);
        $(".txtAddress5").val(guestDetails.Address5);
        $(".txtAddress6").val(guestDetails.Address6);
        $(".txtPhone").val(guestDetails.Phone);
        $(".txtEmail").val(guestDetails.Email);
        if (guestDetails.MaleGender == false)
            $('#ddlSex').attr('selectedIndex', 1);
        if (guestDetails.MaleGender == true)
            $('#ddlSex').attr('selectedIndex', 2);
        if (guestDetails.MaleGender == null)
            $('#ddlSex').attr('selectedIndex', 0);

        $(".rdoGuestAgeGroup input:radio[value=" + guestDetails.AgeGroupID + "]").attr('checked', true);
        if (guestDetails.IsVegetarian == true)
            $('input[name=chkVegiterian]:checkbox').attr('checked', 'checked');
        else
            $('input[name=chkVegiterian]:checkbox').attr('checked', false);
        $(".txtNotes").val(guestDetails.Notes);
        PrePopulateGuestGroup(guestDetails.GuestsGroupID);
        $(".hdnEditGroupID").val(guestDetails.GuestsGroupID);
        var str = guestDetails.Events;
        if (str != null) {
            var ids = str.split("|");
            for (i = 0; i < ids.length; i++) {
                $(".chkGuestEvents span").each(function () {
                    if ($(this).attr('alt') == ids[i]) {
                        $(this).find('input').attr('checked', true);
                    }
                });
            }
        }
        DisplayHideRSVP();
        checkRSVP = guestDetails.RSVP;
        if (guestDetails.RSVP == true)
            $("#rdoAccepted ").attr('checked', true);
        if (guestDetails.RSVP == false)
            $("#rdoDeclined ").attr('checked', true);
    }
    $(".EditGuest").trigger('click');
}


function EditGuest(rowObject) {

    $(".hdnGuestID").val(rowObject.ID);
    $(".hdnAccompanyingGuestID").val(rowObject.AccompanistGuestID);
    if (rowObject.AccompanistGuestID != null) {
        ShowEditAccompayingGuest();
        $("#lblAccompanyingGuestName").html(rowObject.AccompanyingGuestName);
        $(".ddlAccompanyingTitle").attr('selectedIndex', rowObject.TitleID);
        $(".txtAccompanyingName").val(rowObject.Name);
        $(".txtAccompanyingSurname").val(rowObject.Surname);
        $(".txtAccompanyingEmail").val(rowObject.Email);
        if (rowObject.MaleGender == false)
            $('#ddlAccompanyingGender').attr('selectedIndex', 1);
        if (rowObject.MaleGender == true)
            $('#ddlAccompanyingGender').attr('selectedIndex', 2);
        if (rowObject.MaleGender == null)
            $('#ddlAccompanyingGender').attr('selectedIndex', 0);

        $(".rdoAccompanyingAgeGroup input:radio[value=" + rowObject.AgeGroupID + "]").attr('checked', true);
        if (rowObject.IsVegetarian == true)
            $('input[name=chkAccompanyingVeg]:checkbox').attr('checked', 'checked');
        else
            $('input[name=chkAccompanyingVeg]:checkbox').attr('checked', false);

        $(".txtAccompanyingNotes").val(rowObject.Notes);

        $(".hdnEditGroupID").val(rowObject.GuestsGroupID);
        var str = rowObject.Events;
        if (str != null) {
            var ids = str.split("|");
            for (i = 0; i < ids.length; i++) {
                $(".chkGuestEvents span").each(function () {
                    if ($(this).attr('alt') == ids[i]) {
                        $(this).find('input').attr('checked', true);
                    }
                });
            }
        }
        DisplayHideRSVP();
        checkRSVP = rowObject.RSVP;
        if (rowObject.RSVP == true)
            $("#rdoAccompanyingAccepted ").attr('checked', true);
        if (rowObject.RSVP == false)
            $("#rdoAccompanyingDeclined ").attr('checked', true);

        $(".EditAccompanyingGuest").trigger('click');

    } else {
        GetAccompanyingGuest(rowObject.ID);
        $(".accompanyingList").css("display", "block");
        $("#addguest").css("display", "none");
        $("#editguest").css("display", "block");

        $(".hdnAddressID").val(rowObject.AddressID);
        $('.ddlTitle').attr('selectedIndex', rowObject.TitleID);
        $(".txtName").val(rowObject.Name);
        $(".txtSurname").val(rowObject.Surname);
        $(".txtAddresse").val(rowObject.Addresse);
        $(".txtAddress1").val(rowObject.Address1);
        $(".txtAddress4").val(rowObject.Address4);
        $(".txtAddress5").val(rowObject.Address5);
        $(".txtAddress6").val(rowObject.Address6);
        $(".txtPhone").val(rowObject.Phone);
        $(".txtEmail").val(rowObject.Email);
        if (rowObject.MaleGender == false)
            $('#ddlSex').attr('selectedIndex', 1);
        if (rowObject.MaleGender == true)
            $('#ddlSex').attr('selectedIndex', 2);
        if (rowObject.MaleGender == null)
            $('#ddlSex').attr('selectedIndex', 0);

        $(".rdoGuestAgeGroup input:radio[value=" + rowObject.AgeGroupID + "]").attr('checked', true);
        if (rowObject.IsVegetarian == true)
            $('input[name=chkVegiterian]:checkbox').attr('checked', 'checked');
        else
            $('input[name=chkVegiterian]:checkbox').attr('checked', false);
        $(".txtNotes").val(rowObject.Notes);
        PrePopulateGuestGroup(rowObject.GuestsGroupID);
        $(".hdnEditGroupID").val(rowObject.GuestsGroupID);
        var str = rowObject.Events;
        if (str != null) {
            var ids = str.split("|");
            for (i = 0; i < ids.length; i++) {
                $(".chkGuestEvents span").each(function () {
                    if ($(this).attr('alt') == ids[i]) {
                        $(this).find('input').attr('checked', true);
                    }
                });
            }
        }
        DisplayHideRSVP();
        checkRSVP = rowObject.RSVP;
        if (rowObject.RSVP == true)
            $("#rdoAccepted ").attr('checked', true);
        if (rowObject.RSVP == false)
            $("#rdoDeclined ").attr('checked', true);

        $(".EditGuest").trigger('click');
    }

}

function checkBox(e) {

    e = e || event; /* get IE event ( not passed ) */
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    if ($("#chkDeleteAll").is(':checked')) {
        $("#list").find('input[type=checkbox]').each(function () {
            $(this).attr("checked", true);
        });
    } else {
        $("#list").find('input[type=checkbox]').each(function () {
            $(this).attr("checked", false);
        });
    }
}

function DeleteMultipleGuest() {
    var ids = "";
    $("#list").find('input[type=checkbox]:checked').each(function () {
        ids = ids + $(this).attr('id') + "|";
    });
    if (ids != "") {
        var q = $HitchedAjaxOptions;
        q.url = asmxUrl + "FindSeatedGuest";
        q.data = "{IDs:'" + ids + "'}";
        q.success = function callbackFindSeatedGuest(result) {
            $("#SeatedGuests").empty();
            var guestNameList = new Array();
            guestNameList = result.d;
            if (result.d != null && result.d.length > 0) {
                for (var i = 0; i < guestNameList.length; i++) {
                    $("#tmpSeatedGuests").tmpl(guestNameList[i]).appendTo("#SeatedGuests");
                }
                $("#btnMultipleSeated").trigger('click');
                $("#btnMultipleRemoveSeated").click(function () {
                    $.fancybox.close();
                    if (confirm("Are you sure you want to delete selected guest(s)?") == true) {
                        var q = $HitchedAjaxOptions;
                        q.url = asmxUrl + "DeleteMultipleGuest";
                        q.data = "{IDs:'" + ids + "'}";
                        q.success = guestMan.CallBackGuestList;
                        $.ajax(q);
                    }
                });
            } else {
                if (confirm("Are you sure you want to delete selected guest(s)?") == true) {
                    var q = $HitchedAjaxOptions;
                    q.url = asmxUrl + "DeleteMultipleGuest";
                    q.data = "{IDs:'" + ids + "'}";
                    q.success = guestMan.CallBackGuestList;
                    $.ajax(q);
                }
            }
        }
        $.ajax(q);
    } else
        alert("Please select at least one guest to delete");
}

function EscapeChar(str) {
    if (str != null || str != undefined) {
        str = str.replace(/\'/g, "&#39;");
        str = str.replace(/\"/g, "&#34;");
        return str;
    }
}




function BindJqGridData() {
    var screenWidth = $('#contentMain').width(),
        
        selectRow = function (id) {
            $("#list").jqGrid('restoreRow', lastsel);
            $("#list").jqGrid('editRow', id, true);
            lastsel = id;
        },
        
        checkLeadGuest = function (ID) {
            
            $("#list").find('input[type=checkbox]').each(function () {
                if ($(this).attr('id') == ID && $(this).is(":checked") == false) {
                    $("#list").find('input[type=checkbox]').each(function () {
                        if ($(this).val() == ID)
                            $(this).attr("checked", false);
                    });
                    return false;
                } else {
                    if ($(this).val() == ID)
                        $(this).attr("checked", true);
                }
            });
            
        };
    
    $(window).resize(function () {
        screenWidth = $('#contentMain').width();
        $("#list").setGridWidth(screenWidth);
    });
    
    $("#list").jqGrid({
        datatype: "local",
        width: screenWidth, // Change the table width here!
        height: 'auto',
        colNames: [
            '<input type="checkbox" id="chkDeleteAll" onclick="checkBox(event)" />',
            'No',
            'Guest Name',
            'Group',
            'Email<br />Entered',
            'Address<br />Entered',
            'Invited',
            'RSVP',
            'Notes',
            'Edit',
            'GuestsGroupID',
            'AccompanistGuestID',
            'AgeGroupID',
            'IsLeadGuest',
            'IsVegetarian',
            'Email',
            'Address1',
            'Address4',
            'Address5',
            'Address6',
            'Notes',
            'Name'
        ],
        colModel: [
            {
                name: '',
                align: 'center',
                classes: 'colGuestCheck',
                formatter: function (cellvalue, options, rowObject) {
                    /*This bit cleans up to row*/
                    rowObject.AccompanyingGuestName = EscapeChar(rowObject.AccompanyingGuestName);
                    rowObject.Address1 = EscapeChar(rowObject.Address1);
                    rowObject.Address4 = EscapeChar(rowObject.Address4);
                    rowObject.Address5 = EscapeChar(rowObject.Address5);
                    rowObject.Address6 = EscapeChar(rowObject.Address6);
                    rowObject.Addresse = EscapeChar(rowObject.Addresse);

                    rowObject.SortGuestName = EscapeChar(rowObject.SortGuestName);
                    rowObject.Name = EscapeChar(rowObject.Name);
                    rowObject.Surname = EscapeChar(rowObject.Surname);
                    rowObject.GroupName = EscapeChar(rowObject.GroupName);
                    rowObject.Notes = EscapeChar(rowObject.Notes);
                    rowObject.Email = EscapeChar(rowObject.Email);
                    
                    var inputText = $('<input type="checkbox" title="select" class="chkSelectGuest" data-id="' + rowObject.ID 
                                      + '" data-islead="' + rowObject.IsLeadGuest 
                                      + '" data-groupid="' + rowObject.GuestsGroupID 
                                      + '" data-agegroup="' + rowObject.AgeGroupID 
                                      + '" data-accompanist="' + rowObject.AccompanistGuestID 
                                      + '" value="' + rowObject.AccompanistGuestID 
                                      + '" id="' + rowObject.ID + '"/>');
                    if ($(".hdnMemberName").val() === rowObject.Name) {
                        inputText.attr("disabled","disabled");
                    }
                    return inputText[0].outerHTML;
                }
            },
            {
                key: true,
                name: 'ID',
                groupname: 'ID',
                index: 'ID',
                classes: 'colID',
                hidden: true,
                editable: false
            },
            {
                name: 'SortGuestName',
                groupname: 'SortGuestName',
                index: 'SortGuestName',
                align: 'left',
                classes: 'colGuestName',
                editable: false,
                formatter: function (cellvalue, options, rowObject) {
                    //onclick='EditGuest(" + JSON.stringify(rowObject) + ")'
                    var lastname = rowObject.Surname ? " " + rowObject.Surname : "";
                    var text = "<img src='/images/icons/guest/seprator.png' style='padding-right:5px;'  class='guestManagerScreen' alt='seprator' title='seprator' />" + 
                        "<img src='/images/icons/guest/link-guest-icon.png' style='padding:3px 5px 5px 0; vertical-align:middle;' alt='Accompanying Guest' title='Accompanying Guest' />" + 
                        "<a data-row='" + JSON.stringify(rowObject) 
                            + "' class='aGuestName' href='#ancAddAccompanyingGuest' title='Guest Name'>" 
                            + rowObject.Name + lastname + "</a>";
                    
                    if (rowObject.IsVegetarian) {
                        text + "<img src='/images/icons/guest/vegiterian.png'  alt='vegeterian' title='vegeterian' />";
                    }
                    
                    return text;
                },
                sorttype: function (cell, rowObject) {
                    if (rowObject.SortGuestName.indexOf("|") > 0) {
                        var guestArray = rowObject.SortGuestName.split("|");
                        return guestArray[0];
                    } else
                        return cell;
                }
            },
            {
                name: 'GroupName',
                groupname: 'GroupName',
                index: 'GroupName',
                classes: 'colGuestGroup',
                align: 'left',
                editable: false,
                formatter: function (cellvalue, options, rowObject) {
                    if (rowObject.AccompanistGuestID)
                        return "<img src='/images/icons/guest/dot.png'  alt='disabled' title='disabled' />";
                    else if (!rowObject.GuestsGroupID)
                        return "";
                    else if (rowObject.GroupName)
                        return rowObject.GroupName;

                },
                sorttype: function (cell) {
                    return cell;
                }
            },
            {
                name: 'EmailStatus',
                index: 'EmailStatus',
                groupname: 'EmailStatus',
                classes: 'colGuestEmail',
                align: 'center',
                formatter: function (cellvalue, options, rowObject) { // Email Column width
                    //onclick='EditGuestEmail(" + rowObject.ID + ")'
                    
                    
                    //onchange='EmailChange(" + rowObject.ID + ")' onclick='EnterEmail(" + rowObject.ID + ")'  onblur='EmailChange(" + rowObject.ID + ")'
                    var anchor = "<div class='divEmail' data-id='" + rowObject.ID + "'>"
                            + "<a class='aEditEmail' href='javascript:void(0);'  >",
                        icon = "<img src='/images/icons/guest/tickDisabled.png' class='guestListIcons'  alt='Email' title='Email' />",
                        anchorEnd = "</a>",
                        emailEdit = "<div class='InlineEmail' id='InlineEmail" + rowObject.ID + "' style='display:none;margin: 15px 0px 10px 10px;'>" +
                            "<ul class='guestInput'>" +
                                "<li><div><input width='200'  maxlength='50' id='txtEmail" + rowObject.ID + "' type='text' class='txtAddGuest'  value='Email Address' /></div></li>" +
                                "<li><a href='javascript:void(0);' class='updateEmail primary-btn'><span>Update</span></a>&nbsp;" +
                                    "<a href='javascript:void(0);' class='cancelEmail secondary-btn'><span>Cancel</span></a></li>" +
                            "</ul>" +
                        "</div>",
                        end = "</div>";
                    
                    if (rowObject.EmailStatus) {
                         icon = "<img src='/images/icons/guest/guestListTick.png' class='guestListIcons'  alt='Email' title='Email' />";
                    }
                    return anchor + icon + anchorEnd + emailEdit + end;
                },
                sorttype: function (cell) {
                    return cell;
                }
            },
            {
                name: 'AddressStatus',
                index: 'AddressStatus',
                groupname: 'AddressStatus',
                classes: 'colGuestAddress',
                align: 'center',
                formatter: function (cellvalue, options, rowObject) { // Address Column width
                    var start = "<div class='divAddress' data-row='" + JSON.stringify(rowObject) + "' data-id='" + rowObject.ID + "'>"
                            +   "<a class='aEditAddress' href='javascript:void(0);'>",
                        tickIcon =     "<img src='/images/icons/guest/guestListTick.png' class='guestListIcons' alt='Address' title='Address' />",
                        disabledIcon = "<img src='/images/icons/guest/tickDisabled.png'  class='guestListIcons' alt='Address' title='Address' />",
                        end = "</a><div class='InlineAddress' id='InlineAddress" + rowObject.ID + "' style='display:none;margin: 15px 0px 10px 10px;'><ul class='guestInput'><li><div><input  maxlength='50' id='txtAddressLine1" + rowObject.ID + "' type='text' class='txtAddGuest' onchange='Line1Change(" + rowObject.ID + ")' onclick='EnterLine1(" + rowObject.ID + ")' onblur='Line1Change(" + rowObject.ID + ")' value='Address Line1' /></div></li><li><div><input  maxlength='50' id='txtAddressLine2" + rowObject.ID + "'  type='text' class='txtAddGuest' onchange='Line2Change(" + rowObject.ID + ")' onclick='EnterLine2(" + rowObject.ID + ")' onblur='Line2Change(" + rowObject.ID + ")' value='Address Line2' /></div></li><li><div ><input  maxlength='25' id='txtCounty" + rowObject.ID + "'  type='text' class='txtAddGuest' onchange='CountyChange(" + rowObject.ID + ")' onclick='EnterCounty(" + rowObject.ID + ")'  onblur='CountyChange(" + rowObject.ID + ")' value='County' /></div></li><li><div><input  maxlength='15' id='txtPostCode" + rowObject.ID + "'  type='text' class='txtAddGuest' onchange='PostCodeChange(" + rowObject.ID + ")' onclick='EnterPostCode(" + rowObject.ID + ")' onblur='PostCodeChange(" + rowObject.ID + ")' value='PostCode' /></div></li><li><div><input  maxlength='15' id='txtTelephone" + rowObject.ID + "'  type='text' class='txtAddGuest' onchange='TelephoneChange(" + rowObject.ID + ")' onclick='EnterTelephone(" + rowObject.ID + ")' onblur='TelephoneChange(" + rowObject.ID + ")' value='Telephone' /></div></li><li><a href='javascript:void(0);' onclick='EditInlineFields(" + rowObject.ID + ")' class='primary-btn'><span>Update</span></a>&nbsp; <a href='javascript:void(0);' onclick='CloseInlineEdit(" + rowObject.ID + ")' class='secondary-btn'><span>Cancel</span></a></li></ul></div></div>";
                    
                    if (rowObject.AccompanistGuestID == null) {
                        if (rowObject.AddressStatus !== false)
                            return start + tickIcon + end;
                        else
                            return start + disabledIcon + end;
                    } else
                        return "<img src='/images/icons/guest/dot.png'  alt='disabled' title='disabled' />";

                },
                sorttype: function (cell) {
                    return cell;
                }
            },
            {
                name: 'EventsStatus',
                index: 'EventsStatus',
                groupname: 'EventsStatus',
                classes: 'colGuestEvent',
                align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    if (rowObject.AccompanistGuestID == null) {
                        if (rowObject.EventsStatus == false)
                            return "<a href='javascript:void(0);' onclick='EditGuestEvents(" + rowObject.ID + ")' ><img src='/images/icons/guest/tickDisabled.png' class='guestListIcons' alt='events' title='events' /></a> <div class='InlineEvents' id='InlineEvents" + rowObject.ID + "' style='display:none;' ><ul><li id='AddEvent" + rowObject.ID + "' class='EventList' ></li><li><a href='javascript:void(0);'  onclick='EditInlineFields(" + rowObject.ID + ")'style='width:50%' class='primary-btn'><span>Update</span></a><a href='javascript:void(0);'  onclick='CloseInlineEdit(" + rowObject.ID + ")'style='width:50%; margin-top:2px;' class='secondary-btn'><span>Cancel</span></a></li></ul></div>";
                        else
                            return "<a href='javascript:void(0);' onclick='EditGuestEvents(" + rowObject.ID + "," + '"' + EscapeChar(rowObject.Events) + '"' + ")' ><img src='/images/icons/guest/guestListTick.png' class='guestListIcons' alt='events' title='events' /></a> <div class='InlineEvents' id='InlineEvents" + rowObject.ID + "' style='display:none;' ><ul><li id='AddEvent" + rowObject.ID + "' class='EventList' ></li><li><a href='javascript:void(0);'  onclick='EditInlineFields(" + rowObject.ID + ")' class='primary-btn' style='width:50%'><span>Update</span></a>&nbsp; <a href='javascript:void(0);'  onclick='CloseInlineEdit(" + rowObject.ID + ")' class='secondary-btn' style='width:50%; margin-top:2px;'><span>Cancel</span></a></li></ul></div>";
                    } else
                        return "<img src='/images/icons/guest/dot.png'  alt='disabled' title='disabled' />";

                },
                sorttype: function (cell) {
                    return cell;
                }
            },
        // Modified By Nick - Use the RSVPType virtual column value instead of "RSVP" column to handle the grouping with NULL values issues in JQGrid.
            {
                name: 'RSVPType',
                index: 'RSVPType',
                groupname: 'RSVPType',
                classes: 'colGuestRSVP',
                align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    if (cellvalue == 0)
                        return "<a href='javascript:void(0);' onclick=EditGuestRSVP(" + rowObject.ID + ",'tickDisabled'," + rowObject.EventsStatus + ") ><img src='/images/icons/guest/tickDisabled.png'  alt='RSVP' title='RSVP' /></a>&nbsp;&nbsp;<a href='javascript:void(0);' onclick='EditGuestRSVP(" + rowObject.ID + "," + rowObject.RSVP + ")' ><img src='/images/icons/guest/guestListcross.png' alt='RSVP' title='RSVP' /></a>";
                    else if (cellvalue == 1)
                        return "<a href='javascript:void(0);' onclick='EditGuestRSVP(" + rowObject.ID + "," + rowObject.RSVP + ")' ><img src='/images/icons/guest/guestListTick.png' alt='RSVP' title='RSVP' /></a>&nbsp;&nbsp;<a href='javascript:void(0);' onclick=EditGuestRSVP(" + rowObject.ID + ",'crossDisabled'," + rowObject.EventsStatus + ") ><img src='/images/icons/guest/crossDisabled.png' alt='RSVP' title='RSVP' /></a>";
                    else if (cellvalue == 2)
                        return "<a href='javascript:void(0);' onclick=EditGuestRSVP(" + rowObject.ID + ",'tickDisabled'," + rowObject.EventsStatus + ") ><img src='/images/icons/guest/tickDisabled.png'  alt='RSVP' title='RSVP' /></a>&nbsp;&nbsp;<a href='javascript:void(0);' onclick=EditGuestRSVP(" + rowObject.ID + ",'crossDisabled'," + rowObject.EventsStatus + ") ><img src='/images/icons/guest/crossDisabled.png'alt='RSVP' title='RSVP' /></a>";

                },
                sorttype: function (cell) {
                    return cell;
                }
        },
            {
                name: 'NotesStatus',
                index: 'NotesStatus',
                groupname: 'NotesStatus',
                classes: 'colGuestNotes',
                align: 'center',
                valign: 'bottom',
                formatter: function (cellvalue, options, rowObject) {
                    if (rowObject.NotesStatus == false)
                        return "<a href='javascript:void(0);' onclick='EditGuestNote(" + rowObject.ID + ")' ><img src='/images/icons/guest/tickDisabled.png' alt='Notes' title='Notes' /></a><div class='InlineNote' id='InlineNote" + rowObject.ID + "' style='display:none;margin: 15px 0px 10px 10px;float:right;'><ul class='guestInput'><li><div><textarea rows='3' id='txtNote" + rowObject.ID + "' class='txtAddNote' onchange='NoteChange(" + rowObject.ID + ")' onclick='EnterNote(" + rowObject.ID + ")' onblur='NoteChange(" + rowObject.ID + ")' value='Note' >Enter Notes</textarea></div></li><li><a href='javascript:void(0);' onclick='EditInlineFields(" + rowObject.ID + ")' class='primary-btn'><span>Update</span></a>&nbsp; <a href='javascript:void(0);' onclick='CloseInlineEdit(" + rowObject.ID + ")' class='secondary-btn'><span>Cancel</span></a></li></ul></div>";
                    else
                        return "<a href='javascript:void(0);' onclick='EditGuestNote(" + rowObject.ID + "," + '"' + EscapeChar(rowObject.Notes) + '"' + ")' ><img src='/images/icons/guest/guestListTick.png' alt='Notes' title='Notes' /></a><div class='InlineNote' id='InlineNote" + rowObject.ID + "' style='display:none;margin: 15px 0px 10px 10px;float:right;'><ul class='guestInput'><li><div><textarea rows='3' id='txtNote" + rowObject.ID + "' class='txtAddNote' onchange='NoteChange(" + rowObject.ID + ")' onclick='EnterNote(" + rowObject.ID + ")' onblur='NoteChange(" + rowObject.ID + ")'  ></textarea></div></li><li><a href='javascript:void(0);' onclick='EditInlineFields(" + rowObject.ID + ")' class='primary-btn'><span>Update</span></a>&nbsp; <a href='javascript:void(0);' onclick='CloseInlineEdit(" + rowObject.ID + ")' class='secondary-btn'><span>Cancel</span></a></li></ul></div>";
                },
                sorttype: function (cell) {
                    return cell;
                }
            },
            {
                name: 'Edit',
                index: 'Edit',
                classes: 'colGuestEdit',
                align: 'center',
                sortable: false,
                formatter: function (cellvalue, options, rowObject) {
                    if (rowObject.AccompanistGuestID != null)
                        return "<a href='#ancAddAccompanyingGuest' onclick='EditGuest(" + JSON.stringify(rowObject) + ")' ><img src='/images/icons/guest/edit.png' alt='Edit' title='Edit'/></a>&nbsp;&nbsp;<a href='javascript:void(0);'  onclick='DeleteGuest(" + JSON.stringify(rowObject) + ")' ><img src='/images/icons/guest/trash.png' alt='Delete' title='Delete'/></a>";
                    else
                        return "<a href='#ancAddGuest' onclick='EditGuest(" + JSON.stringify(rowObject) + ")' ><img src='/images/icons/guest/edit.png' alt='Edit' title='Edit'/></a>&nbsp;&nbsp;<a href='javascript:void(0);'  onclick='DeleteGuest(" + JSON.stringify(rowObject) + ")' ><img src='/images/icons/guest/trash.png' alt='Delete' title='Delete' /></a>";
                }
            }, {
                name: 'GuestsGroupID',
                index: 'GuestsGroupID',
                hidden: true
            },
            {
                name: 'AccompanistGuestID',
                index: 'AccompanistGuestID',
                hidden: true
            },
            {
                name: 'IsLeadGuest',
                index: 'IsLeadGuest',
                hidden: true
            },
            {
                name: 'IsVegetarian',
                index: 'IsVegetarian',
                hidden: true
            },
            {
                name: 'Email',
                index: 'Email',
                hidden: true
            },
            {
                name: 'Address1',
                index: 'Address1',
                hidden: true
            },
            {
                name: 'Address4',
                index: 'Address4',
                hidden: true
            },
            {
                name: 'Address5',
                index: 'Address5',
                hidden: true
            },
            {
                name: 'Address6',
                index: 'Address6',
                hidden: true
            },
            {
                name: 'GuestsGroupID',
                index: 'GuestsGroupID',
                hidden: true
            },
            {
                name: 'Notes',
                index: 'Notes',
                hidden: true
            },
            {
                name: 'Name',
                index: 'Name',
                hidden: true
            }
        ],
        shrinkToFit: true,
        rowNum: 10000,
        loadonce: true,
        viewrecords: true,
        sortname: 'SortGuestName',
        sortable: false,
        grouping: true,
        groupingView: {
            groupField: ['GroupName'],
            groupColumnShow: [true],
            groupText: ['<b>{0}</b>'],
            groupCollapse: false,
            groupOrder: ['asc'],
            groupSummary: [true],
            groupDataSorted: true
        },
        /*footerrow: true,*/
        /*userDataOnFooter: true,*/
        caption: "",
        loadComplete: function () {
            //      $(".totalGuests").html("Total Guests: " + parseInt(jQuery("#list").getGridParam("reccount") + 1));
            var i, names = this.p.groupingView.sortnames[0],
                l = names.length;
            data = this.p.data, rows = this.rows;
            l = data.length;
            guestGroupID = [];
            var flag = false;
            for (i = 0; i < l; i++) {
                if (guestGroupID.length > 0) {
                    $.each(guestGroupID, function (index) {
                        var id = guestGroupID[index].split("-");
                        if (data[i].GuestsGroupID == id[0]) {
                            flag = true;
                            return false;
                        } else
                            flag = false;
                    });
                    if (flag == false)
                        guestGroupID.push(data[i].GuestsGroupID + "-" + data[i].GroupName);
                } else
                    guestGroupID.push(data[i].GuestsGroupID + "-" + data[i].GroupName);

                $(rows.namedItem(this.id + "ghead_" + i)).find("b").each(function () {
                    $(this).parents('tr').addClass('sortableHeader');
                    $(this).parents('td').attr('colspan', '9');

                    if (guestColumn == 3) {
                        $(".jqfoot").each(function (index) {
                            var GroupName = $("#listghead_" + index).closest(".jqgroup").find("b").html();
                            $(this).html("<td colspan='9' class='quickAddRow'><textarea type='text' class='txtAddGuest' id='txtAddGuest" + index + "'  onchange='GuestChange(" + index + ")' onclick='EnterGuest(" + index + ")' onkeydown='GroupQuickAdd(" + index + "," + '"' + EscapeChar(GroupName) + '"' + ")' onblur='GuestChange(" + index + ")' rows='1'>Add new guest</textarea> <a href='javascript:void(0);' onclick='SaveGuestGroupwise(" + index + "," + '"' + EscapeChar(GroupName) + '"' + ")' class='primary-btn newGuestQuickAdd'><span>Add</span></a></td>");
                            $("#MainQuickAddGuest").css("display", "none");
                        });
                    }
                    if (guestColumn == 3 && (names[i] == 'null' || names[i] == "" || names[i] == "Z-NULL"))
                        $(this).html("Ungrouped");
                    else
                        $(this).html(names[i]);

                    if (guestColumn == 4 && names[i] == 'true')
                        $(this).html("Email Entered");

                    if (guestColumn == 4 && names[i] == 'false')
                        $(this).html("Email not Entered");

                    if (guestColumn == 5 && names[i] == 'false')
                        $(this).html("Address not Entered");


                    if (guestColumn == 5 && names[i] == 'true')
                        $(this).html("Address Entered");

                    if (guestColumn == 6 && names[i] == 'false')
                        $(this).html("Invitation not Sent");


                    if (guestColumn == 6 && names[i] == 'true')
                        $(this).html("Invitation Sent");


                    if (guestColumn == 7 && (names[i] == 'false' || names[i] == 0)) {
                        $(this).html("RSVP Declined");
                        $("#list").find("img").each(function () {
                            if ($(this).attr('title') == "link")
                                $(this).css("display", "none");
                        });
                    }

                    if (guestColumn == 7 && (names[i] == 'true' || names[i] == 1)) {
                        $(this).html("RSVP Accepted");
                        $("#list").find("img").each(function () {
                            if ($(this).attr('title') == "link")
                                $(this).css("display", "none");
                        });
                    }

                    if (guestColumn == 7 && (names[i] == 'null' || names[i] == 2)) {
                        $(this).html("RSVP Awaiting Response");
                        $("#list").find("img").each(function () {
                            if ($(this).attr('title') == "link")
                                $(this).css("display", "none");
                        });
                    }

                    if (guestColumn == 8 && names[i] == 'false') {
                        $(this).html("Notes not entered");
                        $("#list").find("img").each(function () {
                            if ($(this).attr('title') == "link")
                                $(this).css("display", "none");
                        });
                    }
                    if (guestColumn == 8 && names[i] == 'true') {
                        $(this).html("Notes entered");
                        $("#list").find("img").each(function () {
                            if ($(this).attr('title') == "link")
                                $(this).css("display", "none");
                        });
                    }
                });
            }
        },

        onSortCol: function (index, columnIndex, sortOrder) {
            //alert("index:" + index + "&columnIndex:" + columnIndex + "&sortOrder:" + sortOrder);
            $(".ddlGuestType").attr('selectedIndex', 0);
            grouping = index;
            if (grouping === "SortGuestName")
                groupStatus = false;
            else
                groupStatus = true;
            guestColumn = columnIndex;
            changeGrouping(grouping);
        },
        onSelectRow: function (id) {
            

            if (id && id !== lastsel) {
                selectRow(id);
            }
        },
        gridComplete: function () {
            $(".divEmail .aEditEmail").click(function() {
                EditGuestEmail($(this).closest(".divEmail").data("id"));
            });
            /*
            onchange='EmailChange(" + rowObject.ID + ")' 
            onclick='EnterEmail(" + rowObject.ID + ")'  
            onblur='EmailChange(" + rowObject.ID + ")'*/
            $(".divEmail .txtAddGuest")
                .change(function() {  
                    EmailChange($(this).closest(".divEmail").data("id"));
                })
                .blur(function() {  
                    EmailChange($(this).closest(".divEmail").data("id"));
                })
                .click(function() {
                    EnterEmail($(this).closest(".divEmail").data("id"));
                });
            $(".divEmail .updateEmail").click(function() {
                EditInlineFields($(this).closest(".divEmail").data("id"));
            });
            $(".divEmail .cancelEmail").click(function() {
                CloseInlineEdit($(this).closest(".divEmail").data("id"));
            });
            
            /*
              end = "</a><div class='InlineAddress' id='InlineAddress" + rowObject.ID + "' style='display:none;margin: 15px 0px 10px 10px;'><ul class='guestInput'><li><div><input  maxlength='50' id='txtAddressLine1" + rowObject.ID + "' type='text' class='txtAddGuest' onchange='Line1Change(" + rowObject.ID + ")' onclick='EnterLine1(" + rowObject.ID + ")' onblur='Line1Change(" + rowObject.ID + ")' value='Address Line1' /></div></li><li><div><input  maxlength='50' id='txtAddressLine2" + rowObject.ID + "'  type='text' class='txtAddGuest' onchange='Line2Change(" + rowObject.ID + ")' onclick='EnterLine2(" + rowObject.ID + ")' onblur='Line2Change(" + rowObject.ID + ")' value='Address Line2' /></div></li><li><div ><input  maxlength='25' id='txtCounty" + rowObject.ID + "'  type='text' class='txtAddGuest' onchange='CountyChange(" + rowObject.ID + ")' onclick='EnterCounty(" + rowObject.ID + ")'  onblur='CountyChange(" + rowObject.ID + ")' value='County' /></div></li><li><div><input  maxlength='15' id='txtPostCode" + rowObject.ID + "'  type='text' class='txtAddGuest' onchange='PostCodeChange(" + rowObject.ID + ")' onclick='EnterPostCode(" + rowObject.ID + ")' onblur='PostCodeChange(" + rowObject.ID + ")' value='PostCode' /></div></li><li><div><input  maxlength='15' id='txtTelephone" + rowObject.ID + "'  type='text' class='txtAddGuest' onchange='TelephoneChange(" + rowObject.ID + ")' onclick='EnterTelephone(" + rowObject.ID + ")' onblur='TelephoneChange(" + rowObject.ID + ")' value='Telephone' /></div></li><li><a href='javascript:void(0);' onclick='EditInlineFields(" + rowObject.ID + ")' class='primary-btn'><span>Update</span></a>&nbsp; <a href='javascript:void(0);' onclick='CloseInlineEdit(" + rowObject.ID + ")' class='secondary-btn'><span>Cancel</span></a></li></ul></div></div>";
             */
            $(".divAddress .aEditAddress").click(function() {
                EditGuestAddress($(this).closest(".divAddress").data("row"));
            });
            $(".divAddress .aEditAddress").click(function() {
                EditGuestAddress($(this).closest(".divAddress").data("row"));
            }); 
           
            
            $(".aGuestName").click(function() {
                EditGuest($(this).data("row"));
            });
            $(".chkSelectGuest").click(function() {
                checkLeadGuest($(this).data("id"));
            });
            $(".ui-jqgrid tr.jqgrow td").find('img').each(function () {
                if ($(this).attr('title') == 'link') {
                    var row = $(this).parent('td');
                    $(row).parent('tr').find('td').each(function () {
                        $(this).css("border-top", "white");
                    });

                }
            });

            $("#list").find(".quick-add").remove();
            $("#list").find(".quick-total").remove();
            $("#list").find("tr:last-child").after("<tr id='MainQuickAddGuest' class='quick-add ui-widget-content jqgrow ui-row-ltr'><td colspan='9' class='quickAddRow'><input value='Add new guest' type='text' class='txtAddGuest' id='txtAddGuest' onclick='EnterGuest()'  onblur='GuestChange()' rows='1' /> <a href='javascript:void(0);' class='primary-btn newGuestQuickAdd'><span>Add</span></a></td></tr>");
            $("#list").find("tr:last-child").after("<tr class='quick-total ui-widget-content jqgrow ui-row-ltr'><td colspan='9' class='guestTotalRow'><span class='totalGuests'>Total Guests: " + jQuery("#list").getGridParam("reccount") + "</span></td></tr>");

        } // end gridComplete       
    }); // end of guest jqGrid


} // end function BindJqGridData



function EditGuestAddress(rowObject) {
    var id = rowObject.ID;
    HideInlineEditPopup();
    if (rowObject.Address1 !== null)
        $("#txtAddressLine1" + id).val(rowObject.Address1);
    else
        $("#txtAddressLine1" + id).val("Address Line1");

    if (rowObject.Address4 !== null)
        $("#txtAddressLine2" + id).val(rowObject.Address4);
    else
        $("#txtAddressLine2" + id).val("Address Line2");

    if (rowObject.Address5 !== null)
        $("#txtCounty" + id).val(rowObject.Address5);
    else
        $("#txtCounty" + id).val("County");

    if (rowObject.Address6 !== null)
        $("#txtPostCode" + id).val(rowObject.Address6);
    else
        $("#txtPostCode" + id).val("PostCode");

    if (rowObject.Phone !== null)
        $("#txtTelephone" + id).val(rowObject.Phone);
    else
        $("#txtTelephone" + id).val("Telephone");

    if ($("#InlineAddress" + id).is(":hidden")) {
        $("#InlineAddress" + id).slideDown("fast");
        var top = $("#InlineAddress" + id).parent('td');
        $(top).parent('tr').find('td').each(function () {
            $(this).css("vertical-align", "top");
        });

        AllowEnterKeyToSaveAddressDetails(id);
    } else {
        $("#InlineAddress" + id).hide();
    }

}

function AllowEnterKeyToSaveAddressDetails(id) {
    $("#txtAddressLine1" + id).live("keydown", function (e) {
        return SaveAddressDetails(id, e)
    });
    $("#txtAddressLine2" + id).live("keydown", function (e) {
        return SaveAddressDetails(id, e);
    });
    $("#txtCounty" + id).live("keydown", function (e) {
        return SaveAddressDetails(id, e);
    });
    $("#txtPostCode" + id).live("keydown", function (e) {
        return SaveAddressDetails(id, e);
    });
    $("#txtTelephone" + id).live("keydown", function (e) {
        return SaveAddressDetails(id, e);
    });
}

function SaveAddressDetails(id, e) {
    var keyCode = e.keyCode || e.which;
    var enterKey = 13;
    if (keyCode == enterKey) {
        if (!hasEnterKeyExecuted) {
            hasEnterKeyExecuted = true;
            EditInlineFields(id);
        }
        return false;
    }
    return true;
}

function CloseInlineEdit(id) {
    $("#InlineAddress" + id).hide();
    $("#InlineEmail" + id).hide();
    $("#InlineNote" + id).hide();
    $("#InlineEvents" + id).hide();
    $("#ddlGuestMark").removeAttr("disabled");
    $(".ui-jqgrid tr.jqgrow td").css("vertical-align", "");
}

function EditGuestEvents(id, Events) {
    HideInlineEditPopup();
    $("#ddlGuestMark").attr("disabled", "disabled");
    $("#AddEvent" + id).html($(".EventsNames").html());
    if (Events != undefined) {
        var ids = Events.split("|");
        for (i = 0; i < ids.length; i++) {
            $("#AddEvent" + id).find(".chkGuestEvents span").each(function () {
                if ($(this).attr('alt') == ids[i]) {
                    $(this).find('input').attr('checked', true);
                }
            });
        }
    }

    if ($("#InlineEvents" + id).is(":hidden")) {
        $("#InlineEvents" + id).slideDown("fast");
        var top = $("#InlineEvents" + id).parent('td');
        $(top).parent('tr').find('td').each(function () {
            $(this).css("vertical-align", "top");
        });
    } else {
        $("#InlineEvents" + id).hide();
    }
}

function HideInlineEditPopup() {
    $(".InlineAddress").hide();
    $(".InlineEmail").hide();
    $(".InlineNote").hide();
    $(".InlineEvents").hide();
    $(".ui-jqgrid tr.jqgrow td").css("vertical-align", "");
}

function EditGuestNote(id, Notes) {
    HideInlineEditPopup();
    if (Notes != undefined)
        $("#txtNote" + id).val(Notes);
    if ($("#InlineNote" + id).is(":hidden")) {
        $("#InlineNote" + id).slideDown("fast");
        var top = $("#InlineNote" + id).parent('td');
        $(top).parent('tr').find('td').each(function () {
            $(this).css("vertical-align", "top");
        });
    } else {
        $("#InlineNote" + id).hide();
    }

}

function EditGuestEmail(id, Email) {
    HideInlineEditPopup();
    if (Email != undefined)
        $("#txtEmail" + id).val(Email);

    if ($("#InlineEmail" + id).is(":hidden")) {
        $("#InlineEmail" + id).slideDown("fast");
        var top = $("#InlineEmail" + id).parent('td');
        $(top).parent('tr').find('td').each(function () {
            $(this).css("vertical-align", "top");
        });
        AllowEnterKeyToSaveEmailDetails(id)

    } else {
        $("#InlineEmail" + id).hide();
    }

}

function AllowEnterKeyToSaveEmailDetails(id) {
    $("#txtEmail" + id).live("keydown", function (e) {
        var keyCode = e.keyCode || e.which;
        var enterKey = 13;
        if (keyCode == enterKey) {
            if (!hasEnterKeyExecuted) {
                hasEnterKeyExecuted = true;
                EditInlineFields(id);
            }
            return false;
        }
    });
}

function SaveGuestGroupwise(id, groupName) {
    var groupID;
    $.each(guestGroupID, function (index) {
        var name = guestGroupID[index].split("-");
        if (groupName == name[1]) {
            groupID = name[0];
            return false;
        }
    });
    var userName = EscapeChar($("#txtAddGuest" + id).val());

    if (isQuickAddCompleted) {
        isQuickAddCompleted = false;
        AddNewUser(userName, groupID);
    }
}

function GroupQuickAdd(id, groupName) {
    var groupID;
    $.each(guestGroupID, function (index) {
        var name = guestGroupID[index].split("-");
        if (groupName == name[1]) {
            groupID = name[0];
            return false;
        }
    });
    return AddGroupQuickAdd(id, groupID);
}

function AddGroupQuickAdd(id, groupID) {
    $("#txtAddGuest" + id).live("keydown", function (e) {
        var userName = EscapeChar($("#txtAddGuest" + id).val());
        if (userName != "" && userName != "Add new group") {
            var keyCode = e.keyCode || e.which;
            var tabKey = 9;
            var enterKey = 13;
            if (keyCode == tabKey) {
                e.preventDefault();
                if (isQuickAddCompleted) {
                    isQuickAddCompleted = false;
                    AddNewUser(userName, groupID);
                    $("#txtAddGuest" + id).val('');
                    return false;
                }
            }
            if (keyCode == enterKey) {
                e.preventDefault();
                if (isQuickAddCompleted) {
                    isQuickAddCompleted = false;
                    AddNewUser(userName, groupID);
                    $("#txtAddGuest" + id).val('');
                    return false;
                }
            }
        }
        return true;
    });
}

function EnterNote(id) {

    $("#txtNote" + id).focus();
    if ($("#txtNote" + id).val() == "Enter Notes") {
        $("#txtNote" + id).val("");
    } else {
        self.focus();
        return true;
    }
}

function NoteChange(id) {
    if ($("#txtNote" + id).val() == '') {
        $("#txtNote" + id).val('Enter Notes');
        $("#txtNote" + id).blur();
    } else {
        self.focus();
        return true;
    }

}


function EnterEmail(id) {

    $("#txtEmail" + id).focus();
    if ($("#txtEmail" + id).val() == "Email Address") {
        $("#txtEmail" + id).val("");
    }
}

function EmailChange(id) {
    if ($("#txtEmail" + id).val() == '') {
        $("#txtEmail" + id).val('Email Address');
        $("#txtEmail" + id).blur();
    }
}


function EnterLine1(id) {

    $("#txtAddressLine1" + id).focus();
    if ($("#txtAddressLine1" + id).val() == "Address Line1") {
        $("#txtAddressLine1" + id).val("");
    }
}

function Line1Change(id) {
    if ($("#txtAddressLine1" + id).val() == '') {
        $("#txtAddressLine1" + id).val('Address Line1');
        $("#txtAddressLine1" + id).blur();
    }
}

function EnterLine2(id) {

    $("#txtAddressLine2" + id).focus();
    if ($("#txtAddressLine2" + id).val() == "Address Line2") {
        $("#txtAddressLine2" + id).val("");
    }
}

function Line2Change(id) {
    if ($("#txtAddressLine2" + id).val() == '') {
        $("#txtAddressLine2" + id).val('Address Line2');
        $("#txtAddressLine2" + id).blur();
    }
}

function EnterCounty(id) {

    $("#txtCounty" + id).focus();
    if ($("#txtCounty" + id).val() == "County") {
        $("#txtCounty" + id).val("");
    }
}

function CountyChange(id) {
    if ($("#txtCounty" + id).val() == '') {
        $("#txtCounty" + id).val('County');
        $("#txtCounty" + id).blur();
    }
}

function EnterPostCode(id) {

    $("#txtPostCode" + id).focus();
    if ($("#txtPostCode" + id).val() == "PostCode") {
        $("#txtPostCode" + id).val("");
    }
}

function TelephoneChange(id) {
    if ($("#txtTelephone" + id).val() == '') {
        $("#txtTelephone" + id).val('Telephone');
        $("#txtTelephone" + id).blur();
    }
}

function EnterTelephone(id) {

    $("#txtTelephone" + id).focus();
    if ($("#txtTelephone" + id).val() == "Telephone") {
        $("#txtTelephone" + id).val("");
    }
}

function PostCodeChange(id) {
    if ($("#txtPostCode" + id).val() == '') {
        $("#txtPostCode" + id).val('PostCode');
        $("#txtPostCode" + id).blur();
    }
}

function EnterGuest(id) {
    if (id == undefined) {
        $("#txtAddGuest").focus();
        if ($("#txtAddGuest").val() == "Add new guest") {
            $("#txtAddGuest").val("");
        }
    } else {
        $("#txtAddGuest" + id).focus();
        if ($("#txtAddGuest" + id).val() == "Add new guest") {
            $("#txtAddGuest" + id).val("");
        }
    }
}

function GuestChange(id) {
    if (id == undefined) {
        if ($("#txtAddGuest").val() == '') {
            $("#txtAddGuest").val('Add new guest');
            $("#txtAddGuest").blur();
        }
    } else {
        if ($("#txtAddGuest" + id).val() == '') {
            $("#txtAddGuest" + id).val('Add new guest');
            $("#txtAddGuest" + id).blur();
        }
    }
}

function InitializeGroupData() {
    var q = $HitchedAjaxOptions;
    q.url = asmxUrl + "GetGuestGroup";
    q.data = "{weddingID:" + $('.hdnWeddingID').val() + "}";
    q.success = CallBackGroupData;
    $.ajax(q);
}

function PrePopulateGuestGroup(ID) {
    $(".ddlGuestGroup option").each(function () {
        var id = $(this).val();
        if (id != 0 && id != 1) {
            var str = new Array();
            str = id.split("-");
            if (ID == str[1]) {
                $(this).attr("selected", "true");
                if (str[0].toLowerCase() == 'false') {
                    $(".AddEdiitGroup").remove();
                    $('.ddlGuestGroup').after('<div id="delete' + str[1] + '" class="AddEdiitGroup" ><a href="javascript:void(0);" onclick="DeleteGroup(' + str[1] + ')"  ><img src="/images/icons/guest/trash.png"/></a></div>');

                } else {
                    $(".AddEdiitGroup").css("display", "none");
                }

                return false;
            }
        }
    });
}

function CallBackGroupData(result) {
    if (result.d != null) {
        var htmlOptions = '';
        htmlOptions += '<option value="0">Ungrouped</option>';
        for (var i = 0; i < result.d.length; i++) {
            htmlOptions += '<option value="' + result.d[i].IsDefault + "-" + result.d[i].ID + '">' + result.d[i].Name + '</option>';
        }
        htmlOptions += '<option value="1">Create new group</option>';
        $(".ddlGuestGroup").html(htmlOptions);
        PrePopulateGuestGroup(newGroupID);
        if (newReplacedGroup != "") {
            $(".ddlGuestGroup option:contains('" + newReplacedGroup + "')").attr("selected", "true");
        }
    }
}

function DeleteGroup(ID) {
    var q = $HitchedAjaxOptions;
    q.url = asmxUrl + "IsGroupExistAgainstGuest";
    q.data = "{guestGroupID:" + ID + "}";
    q.success = function (result) {
        if (result.d != null) {
            $(".deletegroup").css("display", "block");
            $(".hdnGroupID").val(ID);
            if (result.d == false)
                $("#haveguest").css("display", "none");
            else {
                $("#haveguest").css("display", "block");
                fillFiltredGroups(ID);
            }
        }
    }
    $.ajax(q);
}

function CancelDelete() {
    $(".deletegroup").css("display", "none");
}

function fillFiltredGuests(GuestGroupID) {
    var q = $HitchedAjaxOptions;
    q.url = asmxUrl + "GetFilteredGuest";
    if (GuestGroupID == '')
        GuestGroupID = null;
    q.data = "{weddingID:" + $(".hdnWeddingID").val() + ",guestGroupID:" + GuestGroupID + "}";
    q.success = function (result) {
        if (result.d != null) {
            var htmlOptions = '';
            htmlOptions += '<option value="0">Select</option>';
            for (var i = 0; i < result.d.length; i++) {
                if (result.d[i].Status != null || result.d[i].ID == $(".hdnGuestID").val())
                    htmlOptions += '<option value="' + result.d[i].ID + '" disabled="disabled">' + result.d[i].Name + '</option>';
                else
                    htmlOptions += '<option lang="' + result.d[i].AddressID + '" value="' + result.d[i].ID + '">' + result.d[i].Name + '</option>';

            }
            $(".ddlexistingGuests").html(htmlOptions);
        }
    }
    $.ajax(q);
}

function fillFiltredGroups(ID) {
    var q = $HitchedAjaxOptions;
    q.url = asmxUrl + "GetFilteredGuestGroup";
    q.data = "{guestGroupID:" + ID + ",weddingID:" + $(".hdnWeddingID").val() + "}";
    q.success = function (result) {
        if (result.d != null) {
            var htmlOptions = '';
            htmlOptions += '<option value="0">--Select Group--</option>';
            for (var i = 0; i < result.d.length; i++) {
                htmlOptions += '<option value="' + result.d[i].ID + '">' + result.d[i].Name + '</option>';
            }
            $("#ddlFilteredGroups").html(htmlOptions);
        }
    }
    $.ajax(q);
}

function EnterGroup() {
    $("#txtAddGroup").focus();
    if ($("#txtAddGroup").val() == "Add new group") {
        $("#txtAddGroup").val("");
    }
}

function GroupChange() {
    if ($("#txtAddGroup").val() == '') {
        $("#txtAddGroup").val('Add new group');
        $("#txtAddGroup").blur();
    }
}

function getPrimaryGuestFullName() {
    return $(".txtName").val().replace("'", "\\'") + ' ' + $(".txtSurname").val().replace("'", "\\'");
}

function getAccompanyingGuestFullName() {
    return $(".txtAccompanyingName").val().replace("'", "\\'") + ' ' + $(".txtAccompanyingSurname").val().replace("'", "\\'");
}

function AddNewUser(userNameString, groupID) {
    var userName, userNameArr;
    userNameArr = userNameString.split("\n");
    for (var i = 0; i < userNameArr.length; i++) {
        userName = $.trim(userNameArr[i]);
        if (userName != "" && userName != "Add new guest") {
            var q = $HitchedAjaxOptions;
            q.url = asmxUrl + "IsGuestNameExist";
            q.data = "{name:'" + userName + "',weddingID:" + $('.hdnWeddingID').val() + "}";
            q.success = function (data) {
                CallBackAddNewUser(data, userName, groupID)
            };
            $.ajax(q);
        }
    }
}

function CallBackAddNewUser(result, userName, groupID) {
    var confirmation = true;
    if (result.d === true) {
        confirmation = confirm("A guest already exists with the name '" + userName + "' , are you sure you want to enter another guest with the same name?");
    }
    if (confirmation) {
        if (groupID == undefined || groupID == 'null') {
            QuickAddGuest(userName);
        } else {
            QuickAddGuestWithGroup(userName, groupID);
        }
    } else {
        isQuickAddCompleted = true;
    }
}

function QuickAddGuestWithGroup(userName, groupID) {
    var q = $HitchedAjaxOptions;
    var guestDetails = new Object();
    guestDetails.Name = userName;
    guestDetails.AgeGroupID = 1;
    guestDetails.GuestsGroupID = groupID;
    q.url = asmxUrl + "AddGuest";
    q.data = "{guestDetail:" + JSON.stringify(guestDetails) + ",weddingID:" + $(".hdnWeddingID").val() + "}";
    q.success = CallBackGuestWithGroup;
    $.ajax(q);
}

function CallBackGuestWithGroup(result) {
    groupStatus = true;
    InitializeGridData();
}

function QuickAddGuest(userName) {
    var q = $HitchedAjaxOptions;
    var guestDetails = new Object();
    guestDetails.Name = userName;
    guestDetails.AgeGroupID = 1;
    q.url = asmxUrl + "AddGuest";
    q.data = "{guestDetail:" + JSON.stringify(guestDetails) + ",weddingID:" + $(".hdnWeddingID").val() + "}";
    q.success = guestMan.CallBackGuestList;
    $.ajax(q);
}

function AddGuestGroup(userNameString) {
    var userName, userNameArr;
    userNameArr = userNameString.split("\n");
    for (var i = 0; i < userNameArr.length; i++) {
        userName = $.trim(userNameArr[i]);
        userName = EscapeChar(userName);
        if (userName != "" && userName != "Add new group") {
            var q = $HitchedAjaxOptions;
            var guestGroup = new Object();
            guestGroup.Name = userName;
            q.url = asmxUrl + "AddGuestGroup";
            q.data = "{guestGroup:" + JSON.stringify(guestGroup) + ",weddingID:" + $(".hdnWeddingID").val() + "}";
            q.success = CallBackGuestGroupList;
            $.ajax(q);
        }
    }
}

function CallBackGuestGroupList(result) {
    newGroupID = result.d;
    InitializeGroupData();
    $("#addgroup").css("display", "none");
}

function CallbackUpdateGroups(result) {
    InitializeGroupData();
    $(".deletegroup").css("display", "none");
    $(".AddEdiitGroup").css("display", "none");
    guestMan.RefreshGuestList();
}

function UpdateGroups() {
    if ($("input[name='deletegroup']:checked").val() == 0) {
        var q = $HitchedAjaxOptions;
        q.url = asmxUrl + "DeleteGuestGroup";
        q.data = "{ID:" + $(".hdnGroupID").val() + "}";
        q.success = CallbackUpdateGroups;
        $.ajax(q);
    }
    if ($("input[name='deletegroup']:checked").val() == 1) {
        if ($('#ddlFilteredGroups option:selected').val() == 0) {
            alert("Please select a new group to move your guests to");
            return false;
        }
        var q = $HitchedAjaxOptions;
        q.url = asmxUrl + "MoveGuestAndDeleteGroup";
        q.data = "{ID:" + $(".hdnGroupID").val() + ",newGuestGroupID:" + $('#ddlFilteredGroups option:selected').val() + "}";
        $(".hdnEditGroupID").val($('#ddlFilteredGroups option:selected').val());
        newReplacedGroup = $('#ddlFilteredGroups option:selected').text();
        q.success = CallbackUpdateGroups;
        $.ajax(q);
    }

}

function ClearAccompanyingGuestDetails() {
    $('.ddlAccompanyingTitle').attr('selectedIndex', 0);
    $(".txtAccompanyingName").val('');
    $(".txtAccompanyingSurname").val('');
    $(".txtAccompanyingEmail").val('');
    $('#ddlAccompanyingGender').attr('selectedIndex', 0);
    $('.rdoAccompanyingAgeGroup').find('input').each(function () {
        if ($(this).val() == 1)
            $(this).attr("checked", true);
    });
    $("input[type='checkbox']").each(function () {
        $(this).removeAttr("checked");
    });
    $(".txtAccompanyingNotes").val('');
}

function ClearFields() {
    if (clearState == false) {
        $("#lblCount").html("0");
        $("#lblAccGuestCount").html("0");
        $(".hdnGuestID").val("");
        $("#txtAddGroup").val("");
        $("#AccompanyingGuestList").css("display", "none");
        $("#DivAccompanyingGuest").css("display", "none");
        $("#addAccompanyingGuest").css("display", "block");
        $("#editAccompanyingGuest").css("display", "none");
        $(".NewAccompanyingGuest").css("display", "block");
        $("#SaveAndAddAnother").css("display", "inline-block");
        $("#existingGuestContent").css("display", "block");
        $("#accompanyingGuestContent").css("display", "none");
        $('.ddlAccompanyingTitle').attr('selectedIndex', 0);
        $(".txtAccompanyingName").val('');
        $(".txtAccompanyingSurname").val('');
        $(".txtAccompanyingEmail").val('');
        $('#ddlAccompanyingGender').attr('selectedIndex', 0);
        $('.rdoAccompanyingAgeGroup').find('input').each(function () {
            if ($(this).val() == 1)
                $(this).attr("checked", true);
        });
        $(".txtAccompanyingNotes").val('');

        $("#addguest").css("display", "block");
        $("#editguest").css("display", "none");
        $("#lblCommonMessage").text("");
        $("#lblCommonMessage").css('display', 'none');
        $("#lblAccompanyingMessage").text("");
        $("#lblAccompanyingMessage").css('display', 'none');
        $('.ddlTitle').attr('selectedIndex', 0);
        $('.ddlGuestGroup').attr('selectedIndex', 0);
        $('.AddEdiitGroup').css('display', 'none');
        $("#addgroup").css('display', 'none');
        $(".txtName").val('');
        $(".txtSurname").val('');
        $(".txtAddresse").val('');
        $(".txtAddress1").val('');
        $(".txtAddress4").val('');
        $(".txtAddress5").val('');
        $(".txtAddress6").val('');
        $(".txtPhone").val('');
        $(".txtEmail").val('');
        $(".txtNotes").val('');
        $('#ddlSex').attr('selectedIndex', 0);
        $(".deletegroup").css("display", "none");
        $("input[type='checkbox']").each(function () {
            $(this).removeAttr("checked");
        });
        $("input[type='radio']").each(function () {
            $(this).removeAttr("checked");
        });
        $('.rdoGuestAgeGroup').find('input').each(function () {
            if ($(this).val() == 1)
                $(this).attr("checked", true);
        });
        DisplayHideRSVP();
    }
}

function SaveAccompanyingGuest() {

    if (guestValidation.ValidateAccompanyingGuest() != false) {

        var q = $HitchedAjaxOptions;
        q.url = asmxUrl + "IsGuestNameExist";
        q.data = "{name:'" + getAccompanyingGuestFullName() + "',weddingID:" + $('.hdnWeddingID').val() + "}";
        q.success = function (result) {
            if (result.d !== null) {
                if (result.d == true && $("#editAccompanyingGuest").is(":visible") == false) {
                    clearState = true;
                    $("#lblExistsGuest").html(getAccompanyingGuestFullName());
                    $("#btnSaveAccompanying").trigger("click");
                } else {
                    clearState = false;
                    SaveAccompanyingGuestDetails();
                }
            }
        }
        $.ajax(q);
    }
}




function SaveAccompanyingGuestDetails() {

    var q = $HitchedAjaxOptions;
    var guestDetails = new Object();
    if ($('.ddlAccompanyingTitle option:selected').val() > 0)
        guestDetails.TitleID = $('.ddlAccompanyingTitle option:selected').val();
    guestDetails.Name = $(".txtAccompanyingName").val();
    guestDetails.Surname = $(".txtAccompanyingSurname").val();
    guestDetails.Email = $(".txtAccompanyingEmail").val();
    if ($('#ddlAccompanyingGender option:selected').val() == 1)
        guestDetails.MaleGender = false;
    else
        guestDetails.MaleGender = true;

    guestDetails.AgeGroupID = $(".rdoAccompanyingAgeGroup input:radio:checked").val();

    var ids = "";
    $(".chkGuestEvents").find('input[type=checkbox]:checked').each(function () {
        ids = ids + $(this).parent().attr('alt') + "|";
    });
    guestDetails.Events = ids;

    if ($('input[name=chkAccompanyingVeg]:checkbox').is(':checked'))
        guestDetails.IsVegetarian = true;
    else
        guestDetails.IsVegetarian = false;

    guestDetails.Notes = $(".txtAccompanyingNotes").val();

    if ($("#rdoAccompanyingAccepted").is(':checked'))
        guestDetails.RSVP = true;
    if ($("#rdoAccompanyingDeclined").is(':checked'))
        guestDetails.RSVP = false;
    if ($("#addAccompanyingGuest").is(":visible")) {
        guestDetails.AccompanistGuestID = $(".hdnGuestID").val();
        q.url = asmxUrl + "AddGuest";
        q.data = "{guestDetail:" + JSON.stringify(guestDetails) + ",weddingID:" + $(".hdnWeddingID").val() + "}";
        q.success = callbackSaveAccompanyingGuestDetails;
        $.ajax(q);
    } else {

        guestDetails.ID = $(".hdnGuestID").val();
        guestDetails.GuestsGroupID = $(".hdnEditGroupID").val();
        guestDetails.AccompanistGuestID = $(".hdnAccompanyingGuestID").val();
        guestDetails.AddressID = $(".hdnAddressID").val();

        if (checkRSVP !== guestDetails.RSVP) {

            q.url = asmxUrl + "IsGuestSeated";
            q.data = "{guestID:" + guestDetails.ID + "}";
            q.success = function callbackIsGuestSeated(result) {
                if (result.d == true) {
                    $("#btnSeatedGuest").trigger('click');
                    $("#btnRemoveSeated").click(function () {
                        q.url = asmxUrl + "UpdateGuest";
                        q.data = "{guestDetail:" + JSON.stringify(guestDetails) + "}";
                        q.success = callbackSaveAccompanyingGuestDetails;
                        $.ajax(q);
                        $.fancybox.close();

                    });
                } else {
                    q.url = asmxUrl + "UpdateGuest";
                    q.data = "{guestDetail:" + JSON.stringify(guestDetails) + "}";
                    q.success = callbackSaveAccompanyingGuestDetails;
                    $.ajax(q);
                }
            }
            $.ajax(q);
        } else {
            q.url = asmxUrl + "UpdateGuest";
            q.data = "{guestDetail:" + JSON.stringify(guestDetails) + "}";
            q.success = callbackSaveAccompanyingGuestDetails;
            $.ajax(q);
        }
    }
}

function callbackSaveAccompanyingGuestDetails(result) {
    if (addAnother == false) {
        guestMan.RefreshGuestList();
        $.fancybox.close();
    } else {
        guestMan.RefreshGuestList();
        ClearAccompanyingGuestDetails();
        addAnother = false;
        GetAccompanyingGuest($(".hdnGuestID").val())
    }
}

function IsAddGuest() {
    return ($("#GuestExist").is(":visible") || $("#addguest").is(":visible"));
}

function SaveGuestDetails() {
    var q = $HitchedAjaxOptions;
    var guestDetails = new Object();

    if ($('.ddlTitle option:selected').val() > 0)
        guestDetails.TitleID = $('.ddlTitle option:selected').val();

    guestDetails.Name = $(".txtName").val();
    guestDetails.Surname = $(".txtSurname").val();
    guestDetails.Addresse = $(".txtAddresse").val();
    guestDetails.Address1 = $(".txtAddress1").val();
    guestDetails.Address4 = $(".txtAddress4").val();
    guestDetails.Address5 = $(".txtAddress5").val();
    guestDetails.Address6 = $(".txtAddress6").val();
    guestDetails.Phone = $(".txtPhone").val();
    guestDetails.Email = $(".txtEmail").val();
    if ($('#ddlSex option:selected').val() == 1)
        guestDetails.MaleGender = false;
    else
        guestDetails.MaleGender = true;

    guestDetails.AgeGroupID = $(".rdoGuestAgeGroup input:radio:checked").val();
    if ($('input[name=chkVegiterian]:checkbox').is(':checked'))
        guestDetails.IsVegetarian = true;
    else
        guestDetails.IsVegetarian = false;

    guestDetails.Notes = $(".txtNotes").val();

    if ($('.ddlGuestGroup option:selected').val() == 0 && $('.ddlGuestGroup option:selected').val() == 1)
        guestDetails.GuestsGroupID = null;
    else {
        var GroupID = new Array();
        GroupID = $('.ddlGuestGroup option:selected').val().split("-");
        guestDetails.GuestsGroupID = GroupID[1];
    }
    var ids = "";
    $(".chkGuestEvents").find('input[type=checkbox]:checked').each(function () {
        ids = ids + $(this).parent().attr('alt') + "|";
    });
    guestDetails.Events = ids;
    if ($("#rdoAccepted").is(':checked'))
        guestDetails.RSVP = true;

    if ($("#rdoDeclined").is(':checked'))
        guestDetails.RSVP = false;
    if (IsAddGuest()) {
        q.url = asmxUrl + "AddGuest";
        q.data = "{guestDetail:" + JSON.stringify(guestDetails) + ",weddingID:" + $(".hdnWeddingID").val() + "}";
        q.success = callbackSaveGuestDetails;
        $.ajax(q);
    } else {
        guestDetails.ID = $(".hdnGuestID").val();
        if ($(".txtAddress1").val() == "" && $(".txtAddress4").val() == "" && $(".txtAddress5").val() == "" && $(".txtAddress6").val() == "")
            guestDetails.AddressID = null;
        else
            guestDetails.AddressID = $(".hdnAddressID").val();
        if (checkRSVP !== guestDetails.RSVP) {
            q.url = asmxUrl + "IsGuestSeated";
            q.data = "{guestID:" + guestDetails.ID + "}";
            q.success = function callbackIsGuestSeated(result) {
                if (result.d == true) {
                    $("#btnSeatedGuest").trigger('click');
                    $("#btnRemoveSeated").click(function () {
                        q.url = asmxUrl + "UpdateGuest";
                        q.data = "{guestDetail:" + JSON.stringify(guestDetails) + "}";
                        q.success = callbackSaveGuestDetails;
                        $.ajax(q);
                        $.fancybox.close();
                    });
                } else {
                    q.url = asmxUrl + "UpdateGuest";
                    q.data = "{guestDetail:" + JSON.stringify(guestDetails) + "}";
                    q.success = callbackSaveGuestDetails;
                    $.ajax(q);
                }
            }
            $.ajax(q);
        } else {
            q.url = asmxUrl + "UpdateGuest";
            q.data = "{guestDetail:" + JSON.stringify(guestDetails) + "}";
            q.success = callbackSaveGuestDetails;
            $.ajax(q);
        }
    }
}

function callbackSaveGuestDetails(result) {

    if (IsAccompanyingGuestSave == "true") {
        ClearAccompanyingGuestDetails();
        $("#btnAddAccompanyingGuest").trigger("click");

        if ($(".hdnGuestID").val() == "") {
            $(".hdnGuestID").val(result.d);
            GetAccompanyingGuest(result.d);
            fillFiltredGuests($(".hdnEditGroupID").val());
        } else {
            GetAccompanyingGuest($(".hdnGuestID").val());
            fillFiltredGuests($(".hdnEditGroupID").val());
        }
    } else {
        fillFiltredGuests($(".hdnEditGroupID").val());
        $(".hdnGuestID").val("");
        $.fancybox.close();
        guestMan.RefreshGuestList();
    }

}

function finalGuest() {
    clearState = false;
    SaveGuestDetails();
}

function SaveGuest(Status) {
    if (guestValidation.ValidateGuest() != false && isQuickAddCompleted == true) {
        isQuickAddCompleted = false;
        if (($(".rdoGuestAgeGroup input:radio:checked").val() != 1 && $("#lblCount").html() != "0") || ($(".rdoGuestAgeGroup input:radio:checked").val() != 1 && Status == "true"))
            alert("A child/baby guest cannot be a lead guest. Please choose an adult to be a lead guest.");
        else {
            IsAccompanyingGuestSave = Status;
            if (IsAddGuest()) {
                var q = $HitchedAjaxOptions;
                q.url = asmxUrl + "IsGuestNameExist";
                q.data = "{name:'" + getPrimaryGuestFullName() + "',weddingID:" + $('.hdnWeddingID').val() + "}";
                q.success = function (result) {
                    if (result.d !== null) {
                        if (result.d == true) {
                            clearState = true;
                            $("#lblGuestName").html(getPrimaryGuestFullName());
                            $("#btnSave").trigger("click");
                        } else {
                            clearState = false;
                            SaveGuestDetails();
                        }
                    }
                }
                $.ajax(q);
            } else {
                clearState = false;
                SaveGuestDetails();
            }
        }

    }

}


function DisplayHideRSVP() {
    $(".chkGuestEvents").find('input').each(function () {
        if ($(this).is(':checked')) {
            $(".RSVParea").css("display", "block");
            return false;
        } else
            $(".RSVParea").css("display", "none");
    });

    if ($(".RSVParea").is(':visible') == false)
        $("#rdoAwaitingResponse").attr("checked", true);
}


function PrintGuest() {
    HideInlineEditPopup();
    $(".btnprint").trigger('click');
}

function ExportToExcel() {
    HideInlineEditPopup();
    $(".btnexcel").trigger('click');
}

function ExportToPDF() {
    HideInlineEditPopup();
    $(".btnpdf").trigger('click');
}

$("#txtAddGuest").live("keydown", function (e) {
    var userName = EscapeChar($("#txtAddGuest").val());
    if (userName != "") {
        var keyCode = e.keyCode || e.which;
        var tabKey = 9;
        var enterKey = 13;
        if (keyCode == tabKey) {
            e.preventDefault();
            if (isQuickAddCompleted) {
                isQuickAddCompleted = false;
                AddNewUser(userName);
            }
        }
        if (keyCode == enterKey) {
            e.preventDefault();
            if (isQuickAddCompleted) {
                isQuickAddCompleted = false;
                AddNewUser(userName);
            }
        }
    }
});

$("#list .quick-add a").live("click", function () {
    //var userName = $("#list").find(".quick-add textarea").val();
    var userName = EscapeChar($("#txtAddGuest").val());
    if (userName != "") {
        if (isQuickAddCompleted) {
            isQuickAddCompleted = false;
            AddNewUser(userName);
        }
    }

});

$("#addgroup textarea").live("keydown", function (e) {
    var userName = $("#txtAddGroup").val();
    if (userName != "") {
        var keyCode = e.keyCode || e.which;
        var tabKey = 9;
        var enterKey = 13;
        if (keyCode == tabKey) {
            e.preventDefault();
            if (isQuickAddCompleted) {
                isQuickAddCompleted = false;
                AddGuestGroup(userName);
            }
        }
        if (keyCode == enterKey) {
            e.preventDefault();
            if (isQuickAddCompleted) {
                isQuickAddCompleted = false;
                AddGuestGroup(userName);
            }
        }
    }
    return true;
});

$("#addgroup a").live("click", function () {
    var userName = $("#txtAddGroup").val();
    AddGuestGroup(userName);
    return false;
});

$.fn.fix_radios = function () {
    function focus() {
        if (!this.checked) return;
        if (!this.was_checked) {
            $(this).change();
        }
    }

    function change(e) {
        if (this.was_checked) {
            e.stopImmediatePropagation();
            return;
        }
        $("[name=" + this.name + "]").each(function () {
            this.was_checked = this.checked;
        });
    }
    return this.focus(focus).change(change);
}

$(function () {
    $("input[type=radio]").fix_radios();
    $("input[name='deletegroup']").change(function () {
        if ($(this).val() == '1')
            $("#groups").css("display", "block");
        else
            $("#groups").css("display", "none");
    });
});

function UnlinkParentGuest(id) {
    var q = $HitchedAjaxOptions;
    q.url = asmxUrl + "UnlinkGuest";
    q.success = CallbackUnlinkParentGuest;
    q.data = "{id:" + id + "}";
    $.ajax(q);

}

function CallbackUnlinkParentGuest(result) {
    $.fancybox.close();
    guestMan.RefreshGuestList();
}

function LinkChildParentGuest() {
    var q = $HitchedAjaxOptions;
    q.url = asmxUrl + "LinkGuest";
    q.data = "{id:" + linkChildID + ",accompanyingGuestID:" + linkParentID + "}";
    q.success = callbackSaveAccompanyingGuestDetails;
    $.ajax(q);
}

function LinkParentsGuest() {
    var q = $HitchedAjaxOptions;
    q.url = asmxUrl + "LinkParentsGuest";
    q.data = "{id:" + linkParentID + ",accompanyingGuestID:" + linkChildID + "}";
    q.success = callbackSaveAccompanyingGuestDetails;
    $.ajax(q);

}

function GoToParentGuest() {
    GetGuestDetailsByID($(".hdnGuestID").val());
}

function ClearGlobalVariables() {
    linkChildID = "";
    linkChildGroupID = "";
    linkChildAgeGroupID = "";
    linkChildAccompanistID = "";
    linkParentID = "";
    linkParentGroupID = "";
    linkParentAgeGroupID = "";
    linkParentAccompanistID = "";
    isChildGuest = "false";
}


$(document).ready(function () {

    if ($(".hdnUserGuide").val() == 0) {
        $("#userGuideLink").fancybox().trigger('click');
    }

    $(".chkGuestEvents").change(function () {
        DisplayHideRSVP();
    });

    $("#ParentUnLink").live('click', function () {
        UnlinkParentGuest($(".hdnGuestID").val());
    });

    $(".ddlGuestGroup").live('change', function () {

        $(".deletegroup").css("display", "none");
        if ($('.ddlGuestGroup option:selected').val() == 1)
            $("#addgroup").css("display", "block");
        else
            $("#addgroup").css("display", "none");

        var IsDefault = new Array();
        IsDefault = $('.ddlGuestGroup option:selected').val().split("-");
        if (IsDefault[0].toLowerCase() == 'false') {
            $(".AddEdiitGroup").remove();
            $('.ddlGuestGroup').after('<div id="delete' + IsDefault[1] + '" class="AddEdiitGroup" ><a href="javascript:void(0);" onclick="DeleteGroup(' + IsDefault[1] + ')"  ><img src="/images/icons/guest/trash.png"/></a></div>');
        } else
            $(".AddEdiitGroup").css("display", "none");

    });
    BindJqGridData();
    InitializeGridData();
    ClearAccountInfo();
    jQuery("#list").closest(".ui-jqgrid-bdiv").css({
        "overflow": "hidden"
    });
    $('#list').fixedtableheader();

    $(".rdoGuestAgeGroup").find("input").each(function () {
        $(this).addClass('guestInputAgeBtn');
    });

    $(".rdoGuestAgeGroup").find("label").each(function () {
        if ($(this).html() == "Adult") {
            $(this).html($(this).html() + ":");
            $(this).addClass('guestInputAgeLabel');
        } else
            $(this).html("&nbsp;" + $(this).html() + ":");
        $(this).addClass('guestInputAgeLabel');
    });

    $("#btnAddAccompanyingGuest").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {
            clearState = false;
            ClearFields();
        }
    });
    $("#btnAddGuest").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {
            clearState = false;
            ClearFields();
        }
    });
    $("#btnNo").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {
            clearState = false;
            ClearFields();
        }
    });
    $("#btnCancelExist").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {
            clearState = false;
            ClearFields();
        }
    });
    $("#btnSave").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {
            clearState = false;
            ClearFields();
        }
    });
    $("#btnSaveAccompanying").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {
            clearState = false;
            ClearFields();
        }
    });
    $(".EditGuest").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {
            clearState = false;
            ClearFields();
        }
    });
    $("#btnIsExistOk").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {
            clearState = false;
            ClearFields();
        }
    });
    $("#btnSameAddress").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {
            clearState = false;
            ClearFields();
        }
    });
    $("#btnCancelSameAddress").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {
            clearState = false;
            ClearFields();
        }
    });
    $(".EditAccompanyingGuest").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {
            clearState = false;
            ClearFields();
        }
    });
    $("#btnDeleteGuest").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {}
    });
    $("#ancLinkGuestPopup").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {}
    });
    $("#btnSeatedGuest").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {}
    });
    $("#btnMultipleSeated").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {}
    });
    $("#btnLinkMarkedGuests").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {}
    });
    $("#btnUnlinkMarkedGuests").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {}
    });
    $("#btnImportGuests").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {
            ClearAccountInfo();
        }
    });
    $("#btnImportStep2").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {
            ClearAccountInfo();
        }
    });
    $("#btnAccountImportGuests").fancybox({
        'overlayOpacity': 0.7,
        'hideOnContentClick': false,
        'scrolling': 'no',
        onClosed: function () {
            ClearAccountInfo();
        }
    });

    jQuery("#list").jqGrid('navGrid', '#psortrows', {
        edit: false,
        add: false,
        del: false
    });
    var mergeUser;

    jQuery("#list").bind('sortstop', function (event, ui) {
        // increase the margin to not be so sensitive
        var horizontalMargin = Math.abs(ui.originalPosition.left - ui.position.left);
        var verticalMargin = Math.abs(ui.originalPosition.top - ui.position.top);

        if ((horizontalMargin > 40) || (verticalMargin > 40)) {
            if (isChildGuest == "true") {

                if (linkChildID == undefined || linkParentID == undefined)
                    return false;

                if (((linkChildAccompanistID != 'null' && linkParentAccompanistID == 'null') || (linkChildAccompanistID == 'null' && linkParentAccompanistID != 'null')) || (linkChildAccompanistID == 'null' && linkParentAccompanistID == 'null')) {

                    if (linkParentID != linkChildID) {
                        if (linkChildLead == 'true' && linkParentLead == 'true')
                            LinkParentsGuest()
                        else
                            LinkChildParentGuest();
                    }
                    ClearGlobalVariables();
                } else
                    return false;
            } else {
                ClearGlobalVariables();
                $("#ancLinkGuestPopup").click();
                return false;
            }
        } else {
            return false;
        }

    });

    jQuery("#list").bind('sortchange', function (event, ui) {
        if ($(ui.helper).attr('id') == 'MainQuickAddGuest')
            return false;

        isChildGuest = $(ui.helper).find("td:nth-child(13)").html(); // Column number is harcoded, If any column is inserted between then need to change the column number accordingly
        linkChildLead = !$(ui.helper).find("input:first").data('islead');
        linkChildID = $(ui.helper).find("input:first").data('id');
        linkChildGroupID = $(ui.helper).find("input:first").data('groupid');
        linkChildAgeGroupID = $(ui.helper).find("input:first").data('agegroup');
        linkChildAccompanistID = $(ui.helper).find("input:first").data('accompanist');
        currentGroup = ui.helper.children("td:last").html();
        var tableObj = ui.placeholder.parent("tbody"),
            rowNumber = tableObj.children("tr").index(ui.placeholder);
        mergeUser = tableObj.find("tr.jqgrow:nth-child(" + rowNumber + ")");
        newGroup = mergeUser.children("td:last").html();
        tableObj.children().removeClass("merge-rows");
        mergeUser.addClass("merge-rows");
        linkParentID = mergeUser.children("td:first").find('input').data('id');
        linkParentGroupID = mergeUser.children("td:first").find('input').data('groupid');
        linkParentAgeGroupID = mergeUser.children("td:first").find('input').data('agegroup');
        linkParentAccompanistID = mergeUser.children("td:first").find('input').data('accompanist');
        linkParentLead = !mergeUser.children("td:first").find('input').data('islead');

    });

    jQuery("#list").jqGrid('sortableRows', {
        cursor: 'move',
        forcePlaceholderSize: true,
        placeholder: "ui-state-highlight"
    });

    isQuickAddCompleted = true;

}); // end of $(document).ready(function () {

(function () {
    //remove layerX and layerY
    var all = $.event.props,
        len = all.length,
        res = [];
    while (len--) {
        var el = all[len];
        if (el != 'layerX' && el != 'layerY') res.push(el);
    }
    $.event.props = res;
}());


function ImportGuests() {
    $("#btnImportGuests").trigger('click');
}

function OpenImportGuestPopup() {
    $("#btnImportGuests").trigger('click');
}

// check extension of file to be upload
function checkFileExtension(file) {
    var flag = true;
    var extension = file.substr((file.lastIndexOf('.') + 1));

    switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'zip':
    case 'rar':
    case 'pdf':
    case 'doc':
    case 'xls':
    case 'xlsx':
    case 'docx':
    case 'txt':
    case 'JPG':
    case 'JPEG':
    case 'PNG':
    case 'GIF':
    case 'ZIP':
    case 'RAR':
    case 'PDF':
    case 'DOC':
    case 'DOCX':
    case 'TXT':
        flag = true;
        break;
    default:
        flag = false;
    }

    return flag;
}

//get file path from client system
function getNameFromPath(strFilepath) {

    var objRE = new RegExp(/([^\/\\]+)$/);
    var strName = objRE.exec(strFilepath);

    if (strName == null) {
        return null;
    } else {
        return strName[0];
    }

}
// Asynchronous file upload process
function ajaxFileUpload() {

    var fileToUpload = getNameFromPath($('#fileToUpload').val());
    var filename = fileToUpload.substr(0, (fileToUpload.lastIndexOf('.')));
    if (checkFileExtension(fileToUpload)) {

        var flag = true;
        var counter = $('#hdnCountFiles').val();

        if (filename != "" && filename != null) {

            if (flag == true) {
                $("#loading").ajaxStart(function () {
                    $(this).show();
                }).ajaxComplete(function () {
                    $(this).hide();
                    return false;
                });

                $.ajaxFileUpload({
                    url: '/handlers/GuestListUpload.ashx',
                    secureuri: false,
                    fileElementId: 'fileToUpload',
                    dataType: 'json',
                    success: function (data, status) {
                        if (typeof (data.error) != 'undefined') {
                            if (data.error != '') {
                                alert(data.error);
                            } else {

                                var q = $HitchedAjaxOptions;
                                q.url = asmxUrl + "ImportExcelData";
                                q.data = "{fileName:'" + fileToUpload + "'}";
                                q.success = function CallBackImportExcelData(result) {

                                    $("#importData").html(result.d);
                                    $("#importData table tr:first").remove();
                                    if ($("#importData table tr").length > 1) {
                                        $("#filename").css('display', 'none');
                                        $("#btnImportStep2").trigger('click');
                                        //     $("#importData table").append("<thead><tr><th>First Name</th><th>Last Name</th><th>Address Line 1</th><th>Address Line 2</th><th>County</th><th>Postcode</th><th>Telephone</th><th>Email</th></tr></thead>");
                                    } else {

                                        $("#filename").html("<ul class='qq-upload-list'><li>The Excel spreadsheet you have uploaded is blank. Please check your document for the correct headings and guest details, and try uploading again.</li></ul>");
                                        $("#filename").css({
                                            display: 'block',
                                            color: 'red'
                                        });

                                    }
                                }
                                $.ajax(q);
                                $('#fileToUpload').val("");
                            }
                        }
                    },
                    error: function (data, status, e) {
                        alert(e);
                    }
                });
            } else {
                alert('file ' + filename + ' already exist')
                return false;
            }
        }
    } else {
        alert('You can upload only jpg,jpeg,pdf,doc,xls,xlsx,docx,txt,zip,rar extensions files.');
    }
    return false;

}

function SaveAccountGuestsData() {
    var accountGuests = [];
    var isGuestsSelected = false;
    var isGuestNoName = false;

    $("#DivAccountGuests").find('li').each(function (i) {
        var guestDetail = new Object();
        if ($(this).find('input').is(":checked")) {
            if ($(this).find('.GuestName').html() === '<span class="inlineEdit-placeholder">Click to edit</span>') {
                guestDetail.Name = "Name";
                //    isGuestNoName = true;
            } else {
                guestDetail.Name = $(this).find('.GuestName').html();
            }
            guestDetail.Email = $(this).find('.GuestEmail').html();
            accountGuests.push(guestDetail);
            isGuestsSelected = true;
        }
    });

    if (isGuestsSelected == true) {
        if (isGuestNoName == false) {
            var q = $HitchedAjaxOptions;
            q.url = asmxUrl + "SaveAccountGuestData";
            q.data = "{guestDetails:" + JSON.stringify(accountGuests) + ",weddingID:'" + $('.hdnWeddingID').val() + "'}";
            q.success = function CallBackSaveImportedGuestData() {
                $.fancybox.close();
                guestMan.RefreshGuestList();
            }
            $.ajax(q);
        } else {
            $("#lblErrorMessage").html('There are selected guests without names, please provide a name to import.');
            $("#lblErrorMessage").css('display', 'block');
        }
    } else {
        $("#lblErrorMessage").html('Please select at least one contact to import.');
        $("#lblErrorMessage").css('display', 'block');
    }
}

function ImportGuestsData() {
    ShowImportLoadingPanel();
    $("#importData table").tabletojson({
        headers: "FirstName,LastName,AddressLine1,AddressLine2,County,Postcode,Telephone,Email,Sex,Age Group,Vegetarian,Notes",
        complete: function (x) {
            var guestDetail = new Object();
            guestDetail = x;
            var q = $HitchedAjaxOptions;
            q.url = asmxUrl + "SaveImportedGuestData";
            q.data = "{guestDetails:" + guestDetail + ",weddingID:'" + $('.hdnWeddingID').val() + "'}";
            q.success = function CallBackSaveImportedGuestData() {
                HideImportLoadingPanel();
                $.fancybox.close();
                guestMan.RefreshGuestList();
            }
            $.ajax(q);
        }
    })
}


(function ($) {
    $.fn.tabletojson = function (options) {
        var defaults = {
            headers: null,
            attribHeaders: null,
            returnElement: null,
            complete: null
        };

        var options = $.extend(defaults, options);
        var selector = this;
        var jsonRowItem = "";
        var jsonItem = new Array();
        var jsonRow = new Array();
        var heads = [];
        var rowCounter = 1;
        var comma = ",";
        var json = "";

        if (options.headers != null) {
            options.headers = options.headers.split(' ').join('');
            heads = options.headers.split(",");
        }

        var rows = $(":not(tfoot) > tr", this).length;
        $(":not(tfoot) > tr", this).each(function (i, tr) {
            jsonRowItem = "";

            if (this.parentNode.tagName == "TFOOT") {
                return;
            }
            if (this.parentNode.tagName == "THEAD") {
                if (options.headers == null) {
                    $('th', tr).each(function (i, th) {
                        heads[heads.length] = $(th).html();
                    });
                }
            } else {

                if (options.attribHeaders != null) {
                    var h = eval("(" + options.attribHeaders + ")");

                    for (z in h) {
                        heads[heads.length] = h[z];
                    }
                }

                rowCounter++
                var headCounter = 0;
                jsonRowItem = "{";
                jsonItem.length = 0;
                $('td', tr).each(function (i, td) {
                    var re = /&nbsp;/gi;
                    var v = $(td).html().replace(re, '')
                    jsonItem[jsonItem.length] = "\"" + heads[headCounter] + "\":\"" + EscapeChar(v) + "\"";
                    headCounter++;
                });

                if (options.attribHeaders != null) {
                    for (z in h) {
                        jsonItem[jsonItem.length] = "\"" + heads[headCounter] + "\":\"" + tr[z] + "\"";
                        headCounter++;
                    }
                }

                jsonRowItem += jsonItem.join(",");
                jsonRowItem += "}";
                jsonRow[jsonRow.length] = jsonRowItem;
            }
        });
        json += "[" + jsonRow.join(",") + "]";

        if (options.complete != null) {
            options.complete(json);
        }

        if (options.returnElement == null)
            return json;
        else {
            $(options.returnElement).val(json);
            return this;
        }

    }
})(jQuery);




function ImportAccountGuests() {
    if (guestValidation.ValidateAccountDetails() === true && guestValidation.ValidateEmailAddress() === true) {
        ShowImportLoadingPanel();
        $("#txtEmailID").val();
        var password = $("#txtPassword").val();

        var xorKey = 129; /// you can have other numeric values also.

        var encryptedPassword = "";
        for (i = 0; i < password.length; ++i) {
            encryptedPassword += String.fromCharCode(xorKey ^ password.charCodeAt(i));
        }

        var q = $HitchedAjaxOptions;
        q.url = asmxUrl + "ImportAccountData";
        q.data = "{applicationName:'" + accountType + "',userName:'" + $("#txtEmailID").val() + "',password:'" + encryptedPassword + "'}";
        q.success = function CallBackImportAccountData(result) {
            HideImportLoadingPanel();
            $("#btnAccountImportGuests").trigger('click');
            if (result.d != null) {
                if (result.d.length > 0) {
                    var guestResult = new Object();
                    guestResult = result.d;
                    $("#DivAccountGuests").empty();
                    $("#tmpAccountImportedGuests").tmpl(guestResult).appendTo("#DivAccountGuests");
                    $('.editable').inlineEdit();
                }
            } else {
                $("#lblAccountError").css("display", "block");
                $("#lblAccountError").html("You don't have any contacts in your account");
            }
        };
        q.error = function () {
            $("#lblAccountError").css("display", "block");
            $("#lblAccountError").html("Please enter valid email address/password");
            HideImportLoadingPanel();
        };
        $.ajax(q);
    }
}

function ClearAccountInfo() {
    $("#filename").hide();
    $("#txtEmailID").val('');
    $("#txtPassword").val('');
    $("#lblErrorMessage").html('');
    $("#lblErrorMessage").css('display', 'none');
    $("#lblAccountError").css("display", "none");
    $("#lblAccountError").html('');
}

$(function () {
    $('.editable').inlineEdit();
});

function ChangeAccounttype() {
    ClearAccountInfo();

    if ($("#rdoGmail").is(":checked") === true) {
        accountType = "gmail";
        $(".AccountInfo").css('display', 'block');
    } else if ($("#rdoYahoo").is(":checked") === true) {
        accountType = "yahoo";
        $(".AccountInfo").css('display', 'block');
    }

}

function ContactCheckBox(e) {
    e = e || event; /* get IE event ( not passed ) */
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;

    if ($("#chkImportAll").is(':checked')) {
        $("#DivAccountGuests").find('input[type=checkbox]').each(function () {
            $(this).attr("checked", true);
        });
    } else {
        $("#DivAccountGuests").find('input[type=checkbox]').each(function () {
            $(this).attr("checked", false);
        });
    }
}

function ShowImportLoadingPanel() {
    var importLoadingPanel = $("#ancImportGuests");
    importLoadingPanel.append("<div class='loading' style='position:absolute;overflow: auto; width:" + importLoadingPanel.width() + "px; height: " + importLoadingPanel.height() + "px; z-index:5; background-color:#FFF; opacity:0.7; filter:alpha(opacity=70); '></div>");

    var paddingLeft = (importLoadingPanel.width() / 2) - (86 / 2);
    var paddingTop = (importLoadingPanel.height() / 2) - (86 / 2);

    importLoadingPanel.append("<div class='loading' style='background:url(/images/icons/loader-bg.png) 0 0 no-repeat; position:absolute; left: " + paddingLeft + "px; top: " + paddingTop + "px; z-index:6;'><img src='/images/loader.gif'/></div>");
}

function HideImportLoadingPanel() {
    $("#ancImportGuests").find(".loading").remove();
}

// end of file Planner/javascriptGuest.js