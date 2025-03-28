import { states } from "../states";
import { activeKeyTimeouts } from "../states";

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
    stopAudioWhenReleasedButton.textContent = states.stopAudioWhenReleased ? "instant release" : "smooth release";
    
    // clear pending animations when changing modes
    activeKeyTimeouts.forEach((timeout, key) => {
        clearTimeout(timeout);
        key.classList.remove('key-active');
        activeKeyTimeouts.delete(key);
    });
}

