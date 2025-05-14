import { updateStatusMsg } from "../core/logging";
import { states } from "../core/states";

export const staticBackground = document.getElementById("static-background")!;
const toggleBackgroundButton = document.getElementById("toggle-background-button")!;

toggleBackgroundButton.addEventListener("pointerdown", toggleBackground);

function toggleBackground() {
    states.backgroundShown = !states.backgroundShown;
    const background = staticBackground as HTMLImageElement;
    background.classList.toggle("hidden");
    toggleBackgroundButton.classList.remove(states.backgroundShown ? "bg-[#F08080]" : "bg-[#588157]");
    toggleBackgroundButton.classList.add(!states.backgroundShown ? "bg-[#F08080]" : "bg-[#588157]");
    // background.src = `assets/${states.backgroundShown ? "white.jpg" : "SAOlake.jpg"}`;
    updateStatusMsg("background toggled to: " + states.backgroundShown);


}   