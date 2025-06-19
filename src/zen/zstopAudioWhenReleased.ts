import { states, activeKeyTimeouts } from "./zstates";

// ===========================================
// STOP AUDIO WHEN RELEASED



export function toggleStopAudioWhenReleased(manualState: boolean | null = null) {
    if (manualState !== null) {
        states.stopAudioWhenReleased = manualState;
    } else {
        states.stopAudioWhenReleased = !states.stopAudioWhenReleased;
    }
    console.log(`Set release mode to ${states.stopAudioWhenReleased ? "Instant release" : "Smooth release"}.`)
    
    // clear pending animations when changing modes
    activeKeyTimeouts.forEach((timeout, key) => {
        clearTimeout(timeout);
        key.classList.remove('key-active');
        activeKeyTimeouts.delete(key);
    });
}

