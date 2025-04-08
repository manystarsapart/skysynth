import { states } from "../core/states";
import { activeKeyTimeouts } from "../core/states";
import { updateStatusMsg } from "../core/logging";

// ===========================================
// STOP AUDIO WHEN RELEASED

const stopAudioWhenReleasedButton = document.getElementById("stop-audio-when-released-button")!;

stopAudioWhenReleasedButton.addEventListener("pointerdown", ()=>{
    toggleStopAudioWhenReleased();
})

export function toggleStopAudioWhenReleased(manualState: boolean | null = null) {
    if (manualState !== null) {
        states.stopAudioWhenReleased = manualState;
    } else {
        states.stopAudioWhenReleased = !states.stopAudioWhenReleased;
    }
    stopAudioWhenReleasedButton.style.backgroundColor = states.stopAudioWhenReleased ? "#588157" : "#F08080";
    stopAudioWhenReleasedButton.textContent = states.stopAudioWhenReleased ? "Instant release" : "Smooth release";
    updateStatusMsg(`Set release mode to ${states.stopAudioWhenReleased ? "Instant release" : "Smooth release"}.`)
    
    // clear pending animations when changing modes
    activeKeyTimeouts.forEach((timeout, key) => {
        clearTimeout(timeout);
        key.classList.remove('key-active');
        activeKeyTimeouts.delete(key);
    });
}

