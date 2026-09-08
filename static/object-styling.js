(function initialiseObjectStyling(window) {
    "use strict";

    var palette = [
            { name: "Blush", value: "#f5c6c8" },
            { name: "Peach", value: "#f7d2b2" },
            { name: "Butter", value: "#f7e7a9" },
            { name: "Mint", value: "#cce8cf" },
            { name: "Aqua", value: "#c8e5e7" },
            { name: "Powder blue", value: "#cbdaf0" },
            { name: "Lavender", value: "#d9cbee" },
            { name: "Rose", value: "#edc9dc" }
        ],
        defaults = {
            guest: "#f7e7a9",
            "round-table": "#d9cbee",
            desk: "#cbdaf0",
            chair: "#cce8cf"
        },
        typeLabels = {
            guest: "Guest",
            "round-table": "Round table",
            desk: "Desk",
            chair: "Chair"
        },
        selectedModel = null,
        selectedType = null,
        labelSyncQueued = false;

    function getEditorElements() {
        return {
            root: document.getElementById("objectEditor"),
            hint: document.getElementById("objectEditorHint"),
            fields: document.getElementById("objectEditorFields"),
            type: document.getElementById("selectedObjectType"),
            name: document.getElementById("txtObjectName"),
            palette: document.getElementById("pastelPalette")
        };
    }

    function normaliseColour(colour, type) {
        var allowed = palette.some(function (entry) {
            return entry.value === colour;
        });
        return allowed ? colour : defaults[type];
    }

    function clamp(value) {
        return Math.max(0, Math.min(255, Math.round(value)));
    }

    function channelToHex(value) {
        return clamp(value).toString(16).padStart(2, "0");
    }

    function mixColour(colour, target, amount) {
        var sourceRed = parseInt(colour.slice(1, 3), 16),
            sourceGreen = parseInt(colour.slice(3, 5), 16),
            sourceBlue = parseInt(colour.slice(5, 7), 16),
            targetRed = parseInt(target.slice(1, 3), 16),
            targetGreen = parseInt(target.slice(3, 5), 16),
            targetBlue = parseInt(target.slice(5, 7), 16);

        return "#" +
            channelToHex(sourceRed + ((targetRed - sourceRed) * amount)) +
            channelToHex(sourceGreen + ((targetGreen - sourceGreen) * amount)) +
            channelToHex(sourceBlue + ((targetBlue - sourceBlue) * amount));
    }

    function fillFor(type, colour) {
        var fixedColour = normaliseColour(colour, type),
            highlight,
            shade;

        if (type !== "round-table" && type !== "desk") {
            return fixedColour;
        }

        highlight = mixColour(fixedColour, "#ffffff", 0.48);
        shade = mixColour(fixedColour, "#66758d", 0.14);
        return "135-" + highlight + "-" + fixedColour + "-" + shade;
    }

    function modelPosition(model) {
        if (!model || typeof model.GetX !== "function" || typeof model.GetY !== "function") {
            return null;
        }
        return { x: model.GetX(), y: model.GetY() };
    }

    function syncLabel(model) {
        var position;
        if (!model || !model.styleLabel) {
            return;
        }
        position = modelPosition(model);
        if (!position) {
            return;
        }
        model.styleLabel.attr({
            x: position.x,
            y: position.y + (model.__objectStyleType === "chair" ? -18 : 0),
            text: model.name || ""
        });
        if (model.name) {
            model.styleLabel.show();
            model.styleLabel.toFront();
        } else {
            model.styleLabel.hide();
        }
    }

    function syncAllLabels() {
        var app = window.myDylanSeating,
            tables,
            guests;
        labelSyncQueued = false;
        if (!app) {
            return;
        }
        tables = app.getTables ? app.getTables() : [];
        guests = app.getGuests ? app.getGuests() : [];
        guests.forEach(syncLabel);
        tables.forEach(function (table) {
            syncLabel(table);
            (table.tableSeatList || []).forEach(syncLabel);
        });
    }

    function queueLabelSync() {
        if (!labelSyncQueued) {
            labelSyncQueued = true;
            window.requestAnimationFrame(syncAllLabels);
        }
    }

    function ensureLabel(model, type) {
        var position;
        if (type === "guest" || model.styleLabel || !model.graphic || !model.graphic.paper) {
            return;
        }
        position = modelPosition(model) || { x: 0, y: 0 };
        model.styleLabel = model.graphic.paper.text(position.x, position.y, model.name || "");
        model.styleLabel.attr({
            fill: "#253650",
            "font-family": "Inter, ui-sans-serif, system-ui, sans-serif",
            "font-size": type === "chair" ? 10 : 12,
            "font-weight": 700
        });
        if (model.styleLabel.node) {
            model.styleLabel.node.style.pointerEvents = "none";
        }
        syncLabel(model);
    }

    function applyName(model, type, name) {
        if (!model) {
            return;
        }
        if (type === "guest" && typeof model.SetName === "function") {
            model.SetName(name);
        } else {
            model.name = name;
        }
        syncLabel(model);
    }

    function applyColour(model, type, colour) {
        var fixedColour = normaliseColour(colour, type);
        if (!model || !model.graphic) {
            return;
        }
        model.colour = fixedColour;
        model.graphic.attr({ fill: fillFor(type, fixedColour) });
    }

    function persistenceType(type) {
        if (type === "round-table" || type === "desk") {
            return "table";
        }
        return type;
    }

    function persist(model, type, current) {
        var data;
        if (!window.socket || !window.socket.connected || !window.myPlanID) {
            return;
        }
        data = {
            objectType: persistenceType(type),
            id: model.id,
            current: current
        };
        if (type === "chair" && model.table) {
            data.table = model.table.id;
            data.seatNumber = model.seatNumber;
        }
        window.socket.emit("EditObjectStyle", {
            plan: { _id: window.myPlanID },
            data: data
        });
    }

    function renderPalette() {
        var editor = getEditorElements();
        if (!editor.palette || editor.palette.children.length) {
            return;
        }
        palette.forEach(function (entry) {
            var button = document.createElement("button");
            button.type = "button";
            button.className = "colour-swatch";
            button.dataset.colour = entry.value;
            button.title = entry.name;
            button.setAttribute("aria-label", entry.name);
            button.style.setProperty("--swatch-colour", entry.value);
            button.addEventListener("click", function () {
                if (!selectedModel || !selectedType) {
                    return;
                }
                applyColour(selectedModel, selectedType, entry.value);
                persist(selectedModel, selectedType, { colour: entry.value });
                updateEditor();
            });
            editor.palette.appendChild(button);
        });
    }

    function updateEditor() {
        var editor = getEditorElements();
        if (!editor.root) {
            return;
        }
        renderPalette();
        if (!selectedModel || !selectedType) {
            editor.hint.hidden = false;
            editor.fields.hidden = true;
            editor.type.textContent = "Nothing selected";
            return;
        }
        editor.hint.hidden = true;
        editor.fields.hidden = false;
        editor.type.textContent = typeLabels[selectedType] || "Object";
        editor.name.value = selectedModel.name || "";
        Array.from(editor.palette.querySelectorAll(".colour-swatch")).forEach(function (button) {
            var isSelected = button.dataset.colour === selectedModel.colour;
            button.classList.toggle("is-selected", isSelected);
            button.setAttribute("aria-pressed", isSelected ? "true" : "false");
        });
    }

    function select(model, type) {
        selectedModel = model;
        selectedType = type || (model && model.__objectStyleType);
        updateEditor();
    }

    function register(model, type, initial) {
        var originalToJson;
        if (!model || model.__objectStylingRegistered) {
            return model;
        }
        initial = initial || {};
        model.__objectStylingRegistered = true;
        model.__objectStyleType = type;
        if (type !== "guest") {
            model.name = initial.name || model.name || "";
        }
        model.colour = normaliseColour(initial.colour, type);
        applyColour(model, type, model.colour);
        ensureLabel(model, type);

        originalToJson = model.ToJson;
        if (typeof originalToJson === "function") {
            model.ToJson = function styledToJson() {
                var json = originalToJson.call(model);
                json.name = model.name || "";
                json.colour = model.colour;
                return json;
            };
        }

        if (model.graphic && typeof model.graphic.mouseover === "function") {
            model.graphic.mouseover(function () {
                select(model, type);
            });
        }
        queueLabelSync();
        return model;
    }

    function findModel(data) {
        var app = window.myDylanSeating,
            tables,
            table;
        if (!app || !data) {
            return null;
        }
        if (data.objectType === "guest") {
            return (app.getGuests() || []).find(function (guest) {
                return String(guest.id) === String(data.id);
            });
        }
        tables = app.getTables() || [];
        if (data.objectType === "table") {
            return tables.find(function (item) {
                return String(item.id) === String(data.id);
            });
        }
        if (data.objectType === "chair") {
            table = tables.find(function (item) {
                return String(item.id) === String(data.table);
            });
            return table && (table.tableSeatList || []).find(function (chair) {
                return String(chair.id) === String(data.id) || Number(chair.seatNumber) === Number(data.seatNumber);
            });
        }
        return null;
    }

    function applyRemoteStyle(data) {
        var model = findModel(data),
            type;
        if (!model || !data.current) {
            return;
        }
        type = model.__objectStyleType || data.objectType;
        if (Object.prototype.hasOwnProperty.call(data.current, "name")) {
            applyName(model, type, data.current.name);
        }
        if (data.current.colour) {
            applyColour(model, type, data.current.colour);
        }
        if (model === selectedModel) {
            updateEditor();
        }
    }

    function finishInitialisation() {
        var editor = getEditorElements(),
            board = document.getElementById("board"),
            observer;
        renderPalette();
        if (editor.name && !editor.name.dataset.objectStylingBound) {
            editor.name.dataset.objectStylingBound = "true";
            editor.name.addEventListener("change", function () {
                var nextName;
                if (!selectedModel || !selectedType) {
                    return;
                }
                nextName = editor.name.value.trim();
                applyName(selectedModel, selectedType, nextName);
                persist(selectedModel, selectedType, { name: nextName });
            });
        }
        if (board && !board.dataset.objectStylingObserved) {
            board.dataset.objectStylingObserved = "true";
            observer = new MutationObserver(queueLabelSync);
            observer.observe(board, { attributes: true, childList: true, subtree: true });
        }
        if (window.socket && typeof window.socket.on === "function") {
            window.socket.on("EditObjectStyleResponse", applyRemoteStyle);
        }
        updateEditor();
        queueLabelSync();
    }

    window.DylanSeatingObjectStyling = {
        palette: palette.slice(),
        defaultColours: Object.assign({}, defaults),
        fillFor: fillFor,
        register: register,
        select: select,
        finishInitialisation: finishInitialisation,
        syncLabels: syncAllLabels
    };
}(window));