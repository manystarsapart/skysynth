import { updateStatusMsg } from './core/logging.ts';
// import { states } from './core/states.ts';
import { toggleStopAudioWhenReleased } from './audio/stopAudioWhenReleased.ts';
import { toggleKeyboardMode } from './audio/switchKeyboard.ts';
import { toggleLights } from './visual/lights.ts';
import { octaveUp, octaveDown, transposeUpOne, transposeDownOne } from './audio/transposeOctave.ts';
import { hideAllModals, toggleModal } from './components/modal.ts';
import './audio/recording.ts';
import './core/cumTime.ts';
import { keyEventToBaseKey, registerKeyDown, registerKeyUp } from './core/keypress.ts';
import { states } from './core/states.ts';
import './sheets/sheetPlayer.ts'
import './visual/background.ts'
// import changelogMD from '/CHANGELOG.md?raw';
// import showdown from 'showdown';




document.addEventListener("DOMContentLoaded", () => {

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

    // NOT IN THIS CODE: FIREBASE & ALL SERVER INTERACTION

    // ===========================================




    // ===========================================
    // CONTROL GUIDE

    document.getElementById("last-updated-date")!.textContent = states.skysynthLastUpdateDate;
    document.getElementById("current-version")!.textContent = states.skysynthVersion;


    document.getElementById("modal-backspace")!.addEventListener("pointerdown", toggleKeyboardMode);
    document.getElementById("modal-transpose-down")!.addEventListener("pointerdown", transposeDownOne);
    document.getElementById("modal-transpose-up")!.addEventListener("pointerdown", transposeUpOne);
    document.getElementById("modal-arrow-left")!.addEventListener("pointerdown", () => octaveDown());
    document.getElementById("modal-arrow-down")!.addEventListener("pointerdown", () => octaveDown());
    document.getElementById("modal-arrow-right")!.addEventListener("pointerdown", () => octaveUp());
    document.getElementById("modal-arrow-up")!.addEventListener("pointerdown", () => octaveUp());
    document.getElementById("modal-shift")!.addEventListener("pointerdown", () => document.getElementById("shift-indicator")!.style.backgroundColor = "#588157");
    document.getElementById("modal-shift")!.addEventListener("pointerup", () => document.getElementById("shift-indicator")!.style.backgroundColor = "");
    document.getElementById("modal-alt-l")!.addEventListener("pointerdown", () => document.getElementById("l-alt-indicator")!.style.backgroundColor = "#588157");
    document.getElementById("modal-alt-l")!.addEventListener("pointerup", () => document.getElementById("l-alt-indicator")!.style.backgroundColor = "");
    document.getElementById("modal-alt-r")!.addEventListener("pointerdown", () => document.getElementById("r-alt-indicator")!.style.backgroundColor = "#588157");
    document.getElementById("modal-alt-r")!.addEventListener("pointerup", () => document.getElementById("r-alt-indicator")!.style.backgroundColor = "");
    document.getElementById("modal-capslock")!.addEventListener("pointerdown", () => toggleStopAudioWhenReleased());
    document.getElementById("modal-\\")!.addEventListener("pointerdown", toggleLights);
    document.getElementById("modal-tab")!.addEventListener("pointerdown", () => {hideAllModals(); toggleModal(true, "transcribe")});
    document.getElementById("modal-delete")!.addEventListener("pointerdown", () => {hideAllModals(); toggleModal(true, "debug")});
    document.getElementById("modal-esc")!.addEventListener("pointerdown", () => hideAllModals);

    // ===========================================
    // HANDLING KEYPRESSES
    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values

    document.addEventListener('keydown', (e) => registerKeyDown(keyEventToBaseKey(e)));
    document.addEventListener('keyup', (e) => registerKeyUp(keyEventToBaseKey(e)));

    updateStatusMsg("Initialised!");

})