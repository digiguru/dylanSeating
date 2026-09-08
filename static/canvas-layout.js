(function configureDylanSeatingCanvasLayout(window) {
    "use strict";

    var Raphael = window.Raphael,
        objectStyling = window.DylanSeatingObjectStyling,
        defaultColours = objectStyling && objectStyling.defaultColours ? objectStyling.defaultColours : {
            guest: "#f7e7a9",
            "round-table": "#d9cbee",
            desk: "#cbdaf0"
        },
        TOOLBOX_LEFT = 20,
        TOOLBOX_TOP = 72,
        TOOLBOX_WIDTH = 200,
        TOOLBOX_RIGHT = TOOLBOX_LEFT + TOOLBOX_WIDTH,
        ITEM_CENTER_X = TOOLBOX_LEFT + (TOOLBOX_WIDTH / 2),
        ITEM_FIRST_Y = 120,
        ITEM_SPACING = 70,
        LEGACY_ITEM_X = 650,
        LEGACY_TOOLBOX_LEFT = 600,
        TOOLBOX_FILL = "135-#f8fbff-#edf8f2-#f5effb",
        initialising = true;

    if (!Raphael || !Raphael.fn || !Raphael.el) {
        return;
    }

    function parseTranslation(transform) {
        var match;

        if (typeof transform !== "string") {
            return null;
        }

        match = /^t(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/i.exec(transform);
        if (!match) {
            return null;
        }

        return {
            x: Number(match[1]),
            y: Number(match[2])
        };
    }

    function toolboxItemY(legacyY) {
        return ITEM_FIRST_Y + ((legacyY / 50) * ITEM_SPACING);
    }

    function toolboxFillFor(type) {
        if (type === "guest") {
            return defaultColours.guest;
        }
        if (type === "table") {
            return objectStyling && objectStyling.fillFor ?
                objectStyling.fillFor("round-table", defaultColours["round-table"]) :
                defaultColours["round-table"];
        }
        if (type === "desk") {
            return objectStyling && objectStyling.fillFor ?
                objectStyling.fillFor("desk", defaultColours.desk) :
                defaultColours.desk;
        }
        return null;
    }

    function wrapToolboxCreateObject(model) {
        var createObject;

        if (!model || model.canvasLayoutWrapped || typeof model.createObject !== "function") {
            return;
        }

        createObject = model.createObject;
        model.canvasLayoutWrapped = true;
        model.createObject = function createToolboxObject(x, y) {
            var currentX = typeof model.GetX === "function" ? model.GetX() : x,
                currentY = typeof model.GetY === "function" ? model.GetY() : y,
                inToolbox = currentX <= TOOLBOX_RIGHT;

            if (inToolbox) {
                return createObject.call(model);
            }

            if (x === undefined || y === undefined) {
                return createObject.call(model, currentX, currentY);
            }

            return createObject.call(model, x, y);
        };
    }

    var originalRect = Raphael.fn.rect,
        originalTransform = Raphael.el.transform,
        originalAttr = Raphael.el.attr;

    Raphael.fn.rect = function alignedRect(x, y, width, height, radius) {
        var rect;
        if (initialising && x === LEGACY_TOOLBOX_LEFT && y === 20 && width === 200 && height === 600) {
            rect = originalRect.call(this, TOOLBOX_LEFT, TOOLBOX_TOP, width, height, radius);
            rect.__dylanToolboxBackground = true;
            return rect;
        }
        return originalRect.apply(this, arguments);
    };

    Raphael.el.transform = function alignedTransform(transform) {
        var translation = initialising ? parseTranslation(transform) : null;

        if (translation && translation.x === LEGACY_ITEM_X && translation.y >= 0 && translation.y <= 100) {
            return originalTransform.call(this, "t" + ITEM_CENTER_X + "," + toolboxItemY(translation.y));
        }

        return originalTransform.apply(this, arguments);
    };

    Raphael.el.attr = function alignedAttr(name, value) {
        var attrs,
            translation,
            itemFill;

        if (!initialising || !name || typeof name !== "object" || Array.isArray(name)) {
            return originalAttr.apply(this, arguments);
        }

        attrs = Object.assign({}, name);
        wrapToolboxCreateObject(attrs.model);

        if (this.__dylanToolboxBackground) {
            attrs.fill = TOOLBOX_FILL;
            attrs.stroke = "#9fb3c8";
            attrs["stroke-width"] = 1.25;
        }

        itemFill = attrs.model && toolboxFillFor(attrs.model.type);
        if (itemFill) {
            attrs.fill = itemFill;
            attrs.stroke = "#52637d";
        }

        if (attrs.ox === LEGACY_ITEM_X && attrs.oy >= 0 && attrs.oy <= 100) {
            attrs.ox = ITEM_CENTER_X;
            attrs.oy = toolboxItemY(attrs.oy);
        }

        translation = parseTranslation(attrs.transform);
        if (translation && translation.x >= 640 && translation.x <= 760 && translation.y >= 400 && translation.y <= 550) {
            attrs.transform = "t" + (translation.x - 580) + "," + translation.y;
        }

        return originalAttr.call(this, attrs);
    };

    window.DylanSeatingCanvasLayout = {
        finishInitialisation: function finishInitialisation() {
            initialising = false;
        },
        visualTokens: {
            toolboxFill: TOOLBOX_FILL,
            guest: defaultColours.guest,
            table: defaultColours["round-table"],
            desk: defaultColours.desk
        }
    };
}(window));