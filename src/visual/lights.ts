import { states } from "../core/states";
import { waterMask } from "./water";
import { updateStatusMsg } from "../core/logging";
import { toggleVGWhiteBg } from "./visualguide";

// lights
const lightSwitch = document.getElementById("light-switch")!;
const staticBackground = document.getElementById("static-background")!;


// ===========================================
// LIGHTS

lightSwitch.addEventListener("pointerdown", toggleLights);

export function toggleLights() {
    if (states.currentLightsOn) {
        states.currentLightsOn = false;
        staticBackground.classList.replace("brightness-110", "brightness-0");
        lightSwitch.style.backgroundColor = "#F08080";
        waterMask.style.display = "none";
        updateStatusMsg("Lights out!");
        toggleVGWhiteBg();
    }
    else {
        states.currentLightsOn = true;
        staticBackground.classList.replace("brightness-0", "brightness-110");
        lightSwitch.style.backgroundColor = "#588157";
        waterMask.style.display = "block";
        updateStatusMsg("Lights back on!");
        toggleVGWhiteBg();
    }
}

