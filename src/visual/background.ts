import { states } from "../core/states";

export const staticBackground = document.getElementById("static-background")!;
const toggleBackgroundButton = document.getElementById("toggle-background-button")!;

toggleBackgroundButton.addEventListener("pointerdown", toggleBackground);

function toggleBackground() {
    const background = staticBackground as HTMLImageElement;
    background.src = `assets/${states.backgroundShown ? "white.jpg" : "SAOlake.jpg"}`;

    states.backgroundShown = !states.backgroundShown;
}   