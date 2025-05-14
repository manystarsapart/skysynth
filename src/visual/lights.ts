// import { states } from "../core/states";
// import { waterMask } from "./water";
// import { updateStatusMsg } from "../core/logging";
// import { toggleVGWhiteBg } from "./visualguide";
// import { staticBackground } from "./background";

// lights
const lightSwitch = document.getElementById("light-switch")!;



// ===========================================
// LIGHTS

lightSwitch.addEventListener("pointerdown", toggleLights);

export function toggleLights() {
    alert("sorry! lights are currently broken...");
    // if (states.currentLightsOn) {
    //     states.currentLightsOn = false;
    //     staticBackground.classList.replace("brightness-110", "brightness-0");
    //     lightSwitch.style.backgroundColor = "#F08080";
    //     waterMask.style.display = "none";
    //     states.waterMaskShown = false;
    //     updateStatusMsg("Lights out!");
    //     toggleVGWhiteBg();

    //     document.getElementById("body")!.style.backgroundColor = "black";
    // }
    // else {
    //     states.currentLightsOn = true;
    //     staticBackground.classList.replace("brightness-0", "brightness-110");
    //     lightSwitch.style.backgroundColor = "#588157";
    //     waterMask.style.display = "block";
    //     states.waterMaskShown = true;
    //     updateStatusMsg("Lights back on!");
    //     toggleVGWhiteBg();
    // }
}

