import { keyEventToBaseKey, registerKeyDown, registerKeyUp } from "./zkeypress";
import './zinstruSelect.ts';

document.addEventListener("DOMContentLoaded", () => {

    console.log("zen player");

    // notouch for mobile
    const notouchIDs:string[] = [
    "no-touch",
    "shift-indicator",
    "l-alt-indicator",
    "r-alt-indicator",
    "space-indicator",
    ]

    notouchIDs.forEach(element => {
    document.getElementById(element)!.addEventListener("pointerdown", (e) => {
        e.preventDefault();
    }, { passive: false });
    });

    document.addEventListener('keydown', (e) => registerKeyDown(keyEventToBaseKey(e)));
    document.addEventListener('keyup', (e) => registerKeyUp(keyEventToBaseKey(e)));

    console.log("Initialised!");


})

