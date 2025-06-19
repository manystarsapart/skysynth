import * as Tone from 'tone';
import { pressedKeys, states } from "./zstates";
import { leftKeyboardKeys, rightKeyboardKeys, pitchMap, keyboardMode1, keyboardMode2, keyboardMode0 } from "../core/maps";
import { applyVisualGuideStyleChange, leftAltIndicator, removeVisualGuideStyleChange, rightAltIndicator, shiftIndicator, updateVisualGuide, updateVisualGuideOnOneSide } from './zvisualGuide';
import { transposeToKey, transposeDownOne, transposeUpOne, octaveDown, octaveUp } from './ztransposeOctave';
import { toggleStopAudioWhenReleased } from './zstopAudioWhenReleased';

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

document.addEventListener("DOMContentLoaded", () => {

    refreshKeypressHandlers(); // POINTER EVENT SUPPORT

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
        states.currentInstrument.triggerAttack(Tone.Frequency(midiNote, "midi"),Tone.getContext().currentTime);
        console.log("PLAYING NOTE: " + midiNote);
        applyVisualGuideStyleChange(document.getElementById(key) as HTMLElement);
    } 
    else if (key in pitchMap && !pressedKeys.has(key)) {
        transposeToKey(key)
    } // transpose
    else if (key == '[') {
        transposeDownOne();
    } // transpose 1 semitone down
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
    // ONLY PUT TRANSCRIBE FUNCTION HERE AFTER EVERYTHING RUNS
    // transcribe using midiNote as MIDI, input e.key
    // if (states.isTranscribing === true) transcribeKeypress((key in states.letterMap && !pressedKeys.has(key)), key, midiNote, false);   
} 

export function registerKeyUp(key:string) {
    if (key in states.letterMap) {
        removeVisualGuideStyleChange(document.getElementById(key) as HTMLElement);
        pressedKeys.delete(key);
        let midiNote = states.letterMap[key] + states.transposeValue + states.octaveAdjustment;
        if (states.stopAudioWhenReleased == false) return; // IF SAMPLER && NOT E-GUITAR && NOT OTTO-SYNTH
        states.currentInstrument.triggerRelease(Tone.Frequency(midiNote, "midi"));
        states.currentInstrument.triggerRelease(Tone.Frequency(midiNote+1, "midi"));
    }
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