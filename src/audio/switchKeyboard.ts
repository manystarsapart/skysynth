import { states } from "../core/states";
import { keyboardMode0, keyboardMode1, keyboardMode2 } from "../core/maps";
import { updateVisualGuide } from "../visual/visualGuide";
import { updateStatusMsg } from "../core/logging";

const switchKeyboardButton = document.getElementById("switch-keyboard-button")!;

// ===========================================
// SWITCH KEYBOARDS

// let states.currentKeyboardMode = 0
// 0: +12 (default)
// 1: +1 (accidentals)

switchKeyboardButton.addEventListener('pointerdown', toggleKeyboardMode);

export function toggleKeyboardMode() {
    if (states.currentKeyboardMode === 0) {
        // current +12, toggle to +1
        states.currentKeyboardMode = 1;
        states.letterMap = keyboardMode1;
        switchKeyboardButton.textContent = "+1";
        updateVisualGuide();
    } else if (states.currentKeyboardMode === 1) {
        // current +1, toggle to -1
        states.currentKeyboardMode = 2;
        states.letterMap = keyboardMode2;
        switchKeyboardButton.textContent = "-1";
        updateVisualGuide();
    } else {
        // current -1, toggle to +12
        states.currentKeyboardMode = 0;
        states.letterMap = keyboardMode0;
        switchKeyboardButton.textContent = "+12";
        updateVisualGuide();
    }
    console.log(`keyboard mode changed. current mode: ${states.currentKeyboardMode}`);
    updateStatusMsg(`keyboard mode changed to: ${states.currentKeyboardMode}`);
}
