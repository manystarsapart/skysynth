import * as Tone from 'tone';
import { pressedKeys, states } from "./states";
import { incrementWater } from "../visual/water";
import { updateCharacter } from "../visual/character";
import { leftKeyboardKeys, rightKeyboardKeys, pitchMap } from "./maps";
import { updateNoteHistory } from "./logging";
import { applyVisualGuideStyleChange, leftAltIndicator, removeVisualGuideStyleChange, rightAltIndicator, shiftIndicator, updateVisualGuideOnOneSide } from '../visual/visualguide';
import { transposeToKey, transposeDownOne, transposeUpOne, octaveDown, octaveUp } from '../audio/transposeOctave';
import { toggleStopAudioWhenReleased } from '../audio/stopAudioWhenReleased';
import { toggleLights } from '../visual/lights';
import { toggleMenu } from '../components/menu';
import { toggleKeyboardMode } from '../audio/switchKeyboard';
import { transcribeKeypress } from '../sheets/transcribe';

let cumulativeKeypress: number = parseInt(localStorage.getItem("cumulativeKeypress") ?? '0') || 0;

const cumKeypressDisplay = document.getElementById("cum-keypress")!; // past: cumKeypressBox
document.addEventListener("DOMContentLoaded", () => {
    cumKeypressDisplay.textContent = cumulativeKeypress.toString();
    refreshKeypressHandlers(); // POINTER EVENT SUPPORT


    shiftIndicator.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        states.shiftPressed = true;
        shiftIndicator.style.backgroundColor = "#588157";
        updateVisualGuideOnOneSide(0);
        updateVisualGuideOnOneSide(1);
        transcribeKeypress(false, "shift", null, true, true);
    })
    shiftIndicator.addEventListener('pointerup', () => {
        states.shiftPressed = false;
        shiftIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(0);
        updateVisualGuideOnOneSide(1);
        transcribeKeypress(false, "shift", null, true, false);
    })
    leftAltIndicator.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        states.leftAltPressed = true;
        leftAltIndicator.style.backgroundColor = "#588157";
        updateVisualGuideOnOneSide(0);
        transcribeKeypress(false, "altL", null, true, true, "left");
    })
    leftAltIndicator.addEventListener('pointerup', () => {
        states.leftAltPressed = false;
        leftAltIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(0);
        transcribeKeypress(false, "altL", null, true, false, "left");
    })
    rightAltIndicator.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        states.rightAltPressed = true;
        rightAltIndicator.style.backgroundColor = "#588157";
        updateVisualGuideOnOneSide(1);
        transcribeKeypress(false, "altR", null, true, true, "right");
    })
    rightAltIndicator.addEventListener('pointerup', () => {
        states.rightAltPressed = false;
        rightAltIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(1);
        transcribeKeypress(false, "altR", null, true, false, "right");
    })
})

// detects for SHIFT pressed & released AND alt pressed & released

document.addEventListener('keydown', function(e) {
    if (e.key === 'Shift') {
        states.shiftPressed = true;
        shiftIndicator.style.backgroundColor = "#588157";
        updateVisualGuideOnOneSide(0);
        updateVisualGuideOnOneSide(1);

        if (states.isTranscribing === true) transcribeKeypress(false, "shift", null, true, true); // TRANSCRIBE

        // if (!currentLightsOn) {
        //     // toggleVGWhiteBg();
        //     if (shiftIndicator.classList.contains("bg-white/80")) {
        //         shiftIndicator.classList.toggle("bg-white/80");
        //     }
        //     if (leftAltIndicator.classList.contains("bg-white/80")) {
        //         leftAltIndicator.classList.toggle("bg-white/80");
        //     }
        //     if (rightAltIndicator.classList.contains("bg-white/80")) {
        //         rightAltIndicator.classList.toggle("bg-white/80");
        //     }
        // }
    } 
    else if (e.key === 'Alt' && e.location === 1) {
        // left alt key
        e.preventDefault();
        states.leftAltPressed = true;
        leftAltIndicator.style.backgroundColor = "#588157";
        updateVisualGuideOnOneSide(0);

        if (states.isTranscribing === true) transcribeKeypress(false, "altL", null, true, true, "left"); // TRANSCRIBE
    } 
    else if (e.key === 'Alt' && e.location === 2) {
        // right alt key
        e.preventDefault();
        states.rightAltPressed = true;
        rightAltIndicator.style.backgroundColor = "#588157";
        updateVisualGuideOnOneSide(1);

        if (states.isTranscribing === true) transcribeKeypress(false, "altR", null, true, true, "right"); // TRANSCRIBE
    }

});

document.addEventListener('keyup', function(e) {
    if (e.key === 'Shift') {
        states.shiftPressed = false;
        shiftIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(0);
        updateVisualGuideOnOneSide(1);
        if (states.isTranscribing === true) transcribeKeypress(false, "shift", null, true, false); 
    }
    else if (e.key === 'Alt' && e.location === 1 && states.leftAltPressed) {
        // left alt key
        states.leftAltPressed = false;
        leftAltIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(0);
        if (states.isTranscribing === true) transcribeKeypress(false, "altL", null, true, false, "left"); 
    } 
    else if (e.key === 'Alt' && e.location === 2 && states.rightAltPressed) {
        // right alt key
        states.rightAltPressed = false;
        rightAltIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(1);
        if (states.isTranscribing === true) transcribeKeypress(false, "altR", null, true, false, "right"); 
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
    if (states.isTranscribing === true) transcribeKeypress(false, "space", null, true, true); // TRANSCRIBE
    updateVisualGuideOnOneSide(0);
    updateVisualGuideOnOneSide(1);
}

function tempOctaveBackDown() {
    states.spacePressed = false;
    spaceIndicator.style.backgroundColor = "";
    octaveDown();
    if (states.isTranscribing === true) transcribeKeypress(false, "space", null, false, true); // TRANSCRIBE
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

    // console.log("refreshed keypress handlers");
}

export function registerKeyDown(key:string) {
    // const keyPressTime: number = performance.now(); // for latency
    let midiNote: number = 0;

    if (key in states.letterMap && !pressedKeys.has(key)) { 
        incrementWater();
        updateCharacter(false);
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
        // calculating latency 
        // const audioStartTime: number = performance.now();
        // const latency: number = audioStartTime - keyPressTime;
        // console.log(`keypress calc: ${latency} ms`); 

        states.currentInstrument.triggerAttack(Tone.Frequency(midiNote, "midi"),Tone.getContext().currentTime);
        applyVisualGuideStyleChange(document.getElementById(key) as HTMLElement);

        incrementCumKeypress();

        if (states.isTranscribing) {
            transcribeKeypress(true, key, midiNote, true, false);
        }
        
    } 
    else if (key in pitchMap && !pressedKeys.has(key)) {
        transposeToKey(key)
        if (states.isTranscribing) {
            transcribeKeypress(false, key, null, false, false);
        }
    } // transpose
    else if (key == '[') {
        transposeDownOne();
        if (states.isTranscribing) {
            transcribeKeypress(false, key, null, false, false);
        }
    } // transpose 1 semitone down
    else if (key == ']') {
        transposeUpOne()
        if (states.isTranscribing) {
            transcribeKeypress(false, key, null, false, false);
        }
    } // transpose 1 semitone up
    else if (key == 'capslock') {toggleStopAudioWhenReleased()} // stopaudiowhenreleased
    else if (key == '\\') {toggleLights()} // lights
    else if (key == 'escape') {toggleMenu()} // menu
    else if (key == 'backspace') {toggleKeyboardMode()} // keyboardmode
    switch(key) { // detect arrow key: octave change
        case 'arrowleft':
        case 'arrowdown':
            octaveDown();
            if (states.isTranscribing) {
                transcribeKeypress(false, key, null, false, false);
            }
            break;

        case 'arrowright':
        case 'arrowup':
            octaveUp();
            if (states.isTranscribing) {
                transcribeKeypress(false, key, null, false, false);
            }
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
        if (states.isTranscribing) {transcribeKeypress(true, key, midiNote, false, false);}
        if (states.stopAudioWhenReleased == false) return; // IF SAMPLER && NOT E-GUITAR && NOT OTTO-SYNTH
        states.currentInstrument.triggerRelease(Tone.Frequency(midiNote, "midi"));
        states.currentInstrument.triggerRelease(Tone.Frequency(midiNote+1, "midi"));
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