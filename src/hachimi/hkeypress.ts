import * as Tone from 'tone';
import { pressedKeys, states } from "./hstates";
import { leftKeyboardKeys, rightKeyboardKeys, pitchMap, keyboardMode1, keyboardMode2, keyboardMode0 } from "../core/maps";
import { applyVisualGuideStyleChange, leftAltIndicator, removeVisualGuideStyleChange, rightAltIndicator, shiftIndicator, updateVisualGuide, updateVisualGuideOnOneSide } from './hvisualGuide';
import { transposeToKey, transposeDownOne, transposeUpOne, octaveDown, octaveUp } from './htransposeOctave';
import { activeKeyTimeouts } from './hstates';
import { updateNoteHistory } from '../core/logging';
import { toggleMenu } from '../components/menu';


let cumulativeKeypress: number = parseInt(localStorage.getItem("cumulativeKeypress") ?? '0') || 0;

const cumKeypressDisplay = document.getElementById("cum-keypress")!; // past: cumKeypressBox

// =====================================================================
// HELPERS & MISC
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

export function toggleKeyboardMode() {
    if (states.currentKeyboardMode === 0) {
        // current +12, toggle to +1
        states.currentKeyboardMode = 1;
        states.letterMap = keyboardMode1;
        updateVisualGuide();
    } else if (states.currentKeyboardMode === 1) {
        // current +1, toggle to -1
        states.currentKeyboardMode = 2;
        states.letterMap = keyboardMode2;
        updateVisualGuide();
    } else {
        // current -1, toggle to +12
        states.currentKeyboardMode = 0;
        states.letterMap = keyboardMode0;
        updateVisualGuide();
    }
    console.log(`keyboard mode changed. current mode: ${states.currentKeyboardMode}`);
}


// =====================================================================
// POINTER

document.addEventListener("DOMContentLoaded", () => {
    cumKeypressDisplay.textContent = cumulativeKeypress.toString();
    refreshKeypressHandlers(); // POINTER EVENT SUPPORT
    toggleStopAudioWhenReleased(true); // BECAUSE HACHIMI SHOULD DEFAULT TO STOP WHEN RELEASED
    octaveUp();

    shiftIndicator.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        states.shiftPressed = true;
        shiftIndicator.style.backgroundColor = "#588157";
        updateVisualGuideOnOneSide(0);
        updateVisualGuideOnOneSide(1);
    })
    shiftIndicator.addEventListener('pointerup', () => {
        states.shiftPressed = false;
        shiftIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(0);
        updateVisualGuideOnOneSide(1);
    })
    leftAltIndicator.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        states.leftAltPressed = true;
        leftAltIndicator.style.backgroundColor = "#588157";
        updateVisualGuideOnOneSide(0);
    })
    leftAltIndicator.addEventListener('pointerup', () => {
        states.leftAltPressed = false;
        leftAltIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(0);
    })
    rightAltIndicator.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        states.rightAltPressed = true;
        rightAltIndicator.style.backgroundColor = "#588157";
        updateVisualGuideOnOneSide(1);
    })
    rightAltIndicator.addEventListener('pointerup', () => {
        states.rightAltPressed = false;
        rightAltIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(1);
    })
})

// =====================================================================
// detects for SHIFT pressed & released AND alt pressed & released

document.addEventListener('keydown', function(e) {
    if (e.key === 'Shift') {
        states.shiftPressed = true;
        shiftIndicator.style.backgroundColor = "#588157";
        updateVisualGuideOnOneSide(0);
        updateVisualGuideOnOneSide(1);
    } 
    else if (e.key === 'Alt' && e.location === 1) {
        // left alt key
        e.preventDefault();
        states.leftAltPressed = true;
        leftAltIndicator.style.backgroundColor = "#588157";
        updateVisualGuideOnOneSide(0);
    } 
    else if (e.key === 'Alt' && e.location === 2) {
        // right alt key
        e.preventDefault();
        states.rightAltPressed = true;
        rightAltIndicator.style.backgroundColor = "#588157";
        updateVisualGuideOnOneSide(1);
    }

});

document.addEventListener('keyup', function(e) {
    if (e.key === 'Shift') {
        states.shiftPressed = false;
        shiftIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(0);
        updateVisualGuideOnOneSide(1);
    }
    else if (e.key === 'Alt' && e.location === 1 && states.leftAltPressed) {
        // left alt key
        states.leftAltPressed = false;
        leftAltIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(0);
    } 
    else if (e.key === 'Alt' && e.location === 2 && states.rightAltPressed) {
        // right alt key
        states.rightAltPressed = false;
        rightAltIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(1);
    }


});


export const spaceIndicator = document.getElementById("space-indicator")!;
document.addEventListener('keydown', (e)=>{
    if (e.key === ' ' && !states.spacePressed) {
        e.preventDefault();
        tempOctaveUp();
    }
});

spaceIndicator.addEventListener('pointerdown', (e)=>{
    if (!states.spacePressed) {
        e.preventDefault();
        tempOctaveUp();
    }
})

document.addEventListener('keyup', (e)=>{
    if (e.key === ' ') {
        e.preventDefault();
        tempOctaveBackDown();
    }
})

spaceIndicator.addEventListener('pointerup', (e)=>{
    e.preventDefault();
    tempOctaveBackDown();
})

function tempOctaveUp() {
    states.spacePressed = true;
    spaceIndicator.style.backgroundColor = "#588157";
    octaveUp();
    updateVisualGuideOnOneSide(0);
    updateVisualGuideOnOneSide(1);
}

function tempOctaveBackDown() {
    states.spacePressed = false;
    spaceIndicator.style.backgroundColor = "";
    octaveDown();
    updateVisualGuideOnOneSide(0);
    updateVisualGuideOnOneSide(1);
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

export let keyEventToBaseKey = (keyEvent:KeyboardEvent) => {
    if (keyEvent.key != 'r' && keyEvent.key != 'shift') {
    keyEvent.preventDefault(); 

    // TEMPORARILY DISABLED

    // to stop other action e.g. shortcuts & spacebar scrolling from happening
    // r is let through to reload
    }
    return getBaseKey(keyEvent.key).toLowerCase();
}

// =====================================================================

// to call below using keyboard:
// registerKeyDown(keyEventToBaseKey(e));

const keyString = "qwertasdfgzxcvbyuiophjkl;nm,./";

export function refreshKeypressHandlers() {

    for (let i = 0; i < 30; i++) {
        let keyIDToAddHandler = keyString[i];
        const keyDiv = document.getElementById(keyIDToAddHandler)!;
        keyDiv.style.touchAction = 'none';
        keyDiv.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            registerKeyDown(keyIDToAddHandler);
        })
        
        keyDiv.addEventListener('pointerup', (e) => {
            e.preventDefault();
            registerKeyUp(keyIDToAddHandler);
        })
    }

    console.log("refreshed keypress handlers");
}

export function registerKeyDown(key:string) {
    // const keyPressTime: number = performance.now(); // for latency
    let midiNote: number = 0;

    if (key in states.letterMap && !pressedKeys.has(key)) { 
        

        pressedKeys.add(key);
        midiNote = states.letterMap[key] + states.transposeValue + states.octaveAdjustment;
        if (states.shiftPressed) {midiNote++;} 
        else if (leftKeyboardKeys.has(key)) {
            if (states.leftAltPressed) {midiNote++;}
        }
        else if (rightKeyboardKeys.has(key)) {
            if (states.rightAltPressed) {midiNote++;}
        }            
        updateNoteHistory(midiNote, cumulativeKeypress);

        switch (states.hachimiCount % 3) {
            case 0:
                console.log("ha" + midiNote);
                states.instrHa.triggerAttack(Tone.Frequency(midiNote, "midi"),Tone.getContext().currentTime);
                break;
            case 1:
                console.log("chi" + midiNote);
                states.instrChi.triggerAttack(Tone.Frequency(midiNote, "midi"),Tone.getContext().currentTime);
                break;
            case 2:
                console.log("mi" + midiNote);
                states.instrMi.triggerAttack(Tone.Frequency(midiNote, "midi"),Tone.getContext().currentTime);
                break;               
        }

        incrementCumKeypress();

        applyVisualGuideStyleChange(document.getElementById(key) as HTMLElement);

        // HACHIMI HACHIMI HACHIMI
        states.hachimiCount++;
    } 
    else if (key in pitchMap && !pressedKeys.has(key)) {
        transposeToKey(key)
    } // transpose
    else if (key == '[') {
        transposeDownOne();
    } // transpose 1 semitone down
    // else if (key == '\\') {toggleLights()} // lights
        else if (key == 'escape') {toggleMenu()} // menu
    else if (key == ']') {
        transposeUpOne()
    } // transpose 1 semitone up
    else if (key == 'capslock') {toggleStopAudioWhenReleased()} // stopaudiowhenreleased
    else if (key == 'backspace') {toggleKeyboardMode()} // keyboardmode
    switch(key) { // detect arrow key: octave change
        case 'arrowleft':
        case 'arrowdown':
            octaveDown();
            break;

        case 'arrowright':
        case 'arrowup':
            octaveUp();
            break;
    }         
} 

export function registerKeyUp(key:string) {
    if (key in states.letterMap) {
        removeVisualGuideStyleChange(document.getElementById(key) as HTMLElement);
        pressedKeys.delete(key);
        let midiNote = states.letterMap[key] + states.transposeValue + states.octaveAdjustment;
        if (states.stopAudioWhenReleased == false) return; // IF SAMPLER && NOT E-GUITAR && NOT OTTO-SYNTH
        // states.currentInstrument.triggerRelease(Tone.Frequency(midiNote, "midi"));
        // states.currentInstrument.triggerRelease(Tone.Frequency(midiNote+1, "midi"));
        states.instrHa.triggerRelease(Tone.Frequency(midiNote, "midi")); 
        states.instrHa.triggerRelease(Tone.Frequency(midiNote+1, "midi"));
        states.instrChi.triggerRelease(Tone.Frequency(midiNote, "midi")); 
        states.instrChi.triggerRelease(Tone.Frequency(midiNote+1, "midi"));
        states.instrMi.triggerRelease(Tone.Frequency(midiNote, "midi")); 
        states.instrMi.triggerRelease(Tone.Frequency(midiNote+1, "midi"));
        // attempt: kill all hachimi <----------------------------------------------------- if anything breaks, FIX THIS FIRST. 
    }
}

// ======================
// increment keypress

function incrementCumKeypress() { // logs each time a key is pressed
    cumulativeKeypress = parseInt(localStorage.getItem("cumulativeKeypress") ?? '0') || 0;
    cumulativeKeypress++; 
    cumKeypressDisplay.textContent = cumulativeKeypress.toString();
    localStorage.setItem("cumulativeKeypress", cumulativeKeypress.toString());
}

// ======================
// mobile

document.addEventListener('pointerdown', (e:PointerEvent) => {
    const target: HTMLElement = e.target as HTMLElement;
    if (target.closest('.keyboard-key')) { 
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('pointerup', (e:PointerEvent) => {
    const target: HTMLElement = e.target as HTMLElement;
    if (target.closest('.keyboard-key')) {
        e.preventDefault();
    }
}, { passive: false });