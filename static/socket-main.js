import { DylanSeating } from "./dylanSeatingHitched.js";

if (typeof window.io !== "undefined") {
    window.socket = window.io.connect("/");
}

window.myDylanSeating = new DylanSeating();
