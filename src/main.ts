import * as Tone from 'tone';
import { updateStatusMsg, updateNoteHistory } from './core/logging.ts';
import { pitchMap, leftKeyboardKeys, rightKeyboardKeys } from './core/maps.ts';
import { states, pressedKeys } from './core/states.ts';
import { applyVisualGuideStyleChange, removeVisualGuideStyleChange } from './visual/visualguide.ts';
import { toggleStopAudioWhenReleased } from './audio/stopAudioWhenReleased.ts';
import { toggleMenu } from './components/menu.ts';
import { toggleKeyboardMode } from './audio/switchKeyboard.ts';
import { incrementWater, waterLevelDisplay, waterRewardDisplay, updateWaterMaskPosition } from './visual/water.ts';
import { toggleLights } from './visual/lights.ts';
// import { volumeValueDisplay } from './components/instruSelect.ts';
import { octaveUp, octaveDown, transposeToKey, transposeUpOne, transposeDownOne } from './audio/transposeOctave.ts';
import { toggleModal } from './components/modal.ts';
import './audio/recording.ts';


document.addEventListener("DOMContentLoaded", () => {

    // NOT IN THIS CODE: FIREBASE & ALL SERVER INTERACTION

    // ======================
    // DATA & DISPLAYS

    // span displays
    const cumKeypressDisplay = document.getElementById("cum-keypress")!; // past: cumKeypressBox
    const cumTimeDisplay = document.getElementById("cum-time")!; // past: cumTimeBox

    // ======================
    // USER VALUES & FUNCTIONS

    let cumulativeKeypress: number = parseInt(localStorage.getItem("cumulativeKeypress") ?? '0') || 0;
    let cumulativeTime: number = parseInt(localStorage.getItem("cumulativeTime") ?? '100') || 100;

    // cumulative time
    let globalStartTime: number = Date.now();

    // ===========================================
    // INITIALISE WATER

    waterLevelDisplay.textContent = `${states.currentWaterLevel} / ${states.maxWaterLevel}`;
    waterRewardDisplay.textContent = states.totalWaterReward.toString();
    updateWaterMaskPosition();

    // ===========================================
    // VOLUME CONTROL

    // volumeValueDisplay.textContent = `${states.volume}%`;


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
    document.getElementById("modal-tab")!.addEventListener("pointerdown", () => toggleModal(false));
    document.getElementById("modal-esc")!.addEventListener("pointerdown", () => toggleModal(false));
    // ===========================================
    // HANDLING KEYPRESSES
    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // when any key is pressed
    function handleKeyDown(e:any) {
        const keyPressTime: number = performance.now(); // for latency
        const key: string = getBaseKey(e.key).toLowerCase(); // catches shifted notes but not symbols

        // allow 'r' and 'Shift' to bypass preventDefault
        if (key != 'r' && key != 'shift') {
            e.preventDefault(); 
            // to stop other action e.g. shortcuts & spacebar scrolling from happening
            // r is let through to reload
        } 
        // note / transpose logic (works for all keys)
        if (key in states.letterMap && !pressedKeys.has(key)) { 
            incrementWater();
            // key in noteplaying map: play MIDI note
            pressedKeys.add(key);
            let midiNote: number = states.letterMap[key] + states.transposeValue + states.octaveAdjustment;

            if (e.shiftKey) {midiNote++;} 
            else if (leftKeyboardKeys.has(key)) {
                if (states.leftAltPressed) {midiNote++;}
            }
            else if (rightKeyboardKeys.has(key)) {
                if (states.rightAltPressed) {midiNote++;}
            }            

            updateNoteHistory(midiNote, cumulativeKeypress);
            // calculating latency 
            const audioStartTime: number = performance.now();
            const latency: number = audioStartTime - keyPressTime;
            console.log(`Latency: ${latency} ms`); 
            states.currentInstrument.triggerAttack(Tone.Frequency(midiNote, "midi"),Tone.getContext().currentTime);
            applyVisualGuideStyleChange(document.getElementById(key) as HTMLElement);

            incrementCumKeypress();
        } 
        
        else if (key in pitchMap && !pressedKeys.has(key)) {transposeToKey(key)} // transpose
        else if (key == '[') {transposeDownOne()} // transpose 1 semitone down
        else if (key == ']') {transposeUpOne()} // transpose 1 semitone up
        else if (key == 'tab') {toggleModal(!states.modalShown ? true : false)}
        else if (e.key == 'CapsLock') {toggleStopAudioWhenReleased()} // stopaudiowhenreleased
        else if (key == '\\') {toggleLights()} // lights
        else if (key == 'escape') {toggleMenu()} // menu
        else if (key == 'backspace') {toggleKeyboardMode()} // keyboardmode
        switch(e.key) { // detect arrow key: octave change
            case 'ArrowLeft':
                octaveDown();
                break;
            case 'ArrowDown':
                octaveDown();
                break;
            case 'ArrowRight':
                octaveUp();
                break;
            case 'ArrowUp':
                octaveUp();
                break;
        }         
    }
    
    function handleKeyUp(e:any) {
        const key: string = getBaseKey(e.key).toLowerCase();
        if (key in states.letterMap) {
            removeVisualGuideStyleChange(document.getElementById(key) as HTMLElement);
            pressedKeys.delete(key);
            let midiNote = states.letterMap[key] + states.transposeValue + states.octaveAdjustment;
            if (states.stopAudioWhenReleased == false) return; // IF SAMPLER && NOT E-GUITAR && NOT OTTO-SYNTH
            
            
            states.currentInstrument.triggerRelease(Tone.Frequency(midiNote, "midi"));
            states.currentInstrument.triggerRelease(Tone.Frequency(midiNote+1, "midi"));
        }
    }

    function getBaseKey(key: string): string { // unshifts shifted symbol key
        const shiftMap: Record<string, string> = {
            ':': ';',
            '<': ',',
            '>': '.',
            '?': '/',
        };
        return shiftMap[key] || key;
    }


    // ===========================================
    // CUMULATIVE NOTES PLAYED

    cumKeypressDisplay.textContent = cumulativeKeypress.toString();
    function incrementCumKeypress() { // logs each time a key is pressed
        cumulativeKeypress = parseInt(localStorage.getItem("cumulativeKeypress") ?? '0');
        cumulativeKeypress++; 
        cumKeypressDisplay.textContent = cumulativeKeypress.toString();
        localStorage.setItem("cumulativeKeypress", cumulativeKeypress.toString());
    }

    // ===========================================
    // CUMULATIVE TIME SPENT

    cumTimeDisplay.textContent = formatTime(cumulativeTime);

    function formatTime(seconds:number) {
        const hours: number = Math.floor(seconds / 3600);
        const minutes: number = Math.floor((seconds % 3600) / 60);
        const secs: number = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // start timer
    const interval = setInterval(() => {
        const currentTime: number = Date.now();
        const elapsedTime: number = Math.floor((currentTime - globalStartTime) / 1000); // to seconds
        cumulativeTime += elapsedTime;
        globalStartTime = currentTime; 
        cumTimeDisplay.textContent = formatTime(cumulativeTime);
        localStorage.setItem("cumulativeTime", cumulativeTime.toString());
    }, 1000); // updates every second

    // on page exit
    window.addEventListener("beforeunload", () => {
        clearInterval(interval); // stop timer
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - globalStartTime) / 1000); // to seconds
        cumulativeTime += elapsedTime;
        localStorage.setItem("cumulativeTime", cumulativeTime.toString());
    });



    updateStatusMsg("Initialised!");

})

// export { volumeNode };