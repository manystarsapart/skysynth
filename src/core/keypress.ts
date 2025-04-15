import * as Tone from 'tone';
import { pressedKeys, states } from "./states";
import { incrementWater } from "../visual/water";
import { updateCharacter } from "../visual/character";
import { leftKeyboardKeys, rightKeyboardKeys, pitchMap } from "./maps";
import { updateNoteHistory } from "./logging";
import { applyVisualGuideStyleChange, leftAltIndicator, removeVisualGuideStyleChange, rightAltIndicator, shiftIndicator, updateVisualGuideOnOneSide } from '../visual/visualguide';
import { transposeToKey, transposeDownOne, transposeUpOne, octaveDown, octaveUp } from '../audio/transposeOctave';
import { toggleModal } from '../components/modal';
import { toggleStopAudioWhenReleased } from '../audio/stopAudioWhenReleased';
import { toggleLights } from '../visual/lights';
import { toggleMenu } from '../components/menu';
import { toggleKeyboardMode } from '../audio/switchKeyboard';

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
    const keyPressTime: number = performance.now(); // for latency
    
    if (key in states.letterMap && !pressedKeys.has(key)) { 
        incrementWater();
        updateCharacter(false);
        pressedKeys.add(key);
        let midiNote: number = states.letterMap[key] + states.transposeValue + states.octaveAdjustment;
        if (states.shiftPressed) {midiNote++;} 
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
        console.log(`keypress calc: ${latency} ms`); 

        states.currentInstrument.triggerAttack(Tone.Frequency(midiNote, "midi"),Tone.getContext().currentTime);
        applyVisualGuideStyleChange(document.getElementById(key) as HTMLElement);

        incrementCumKeypress();
    } 
    else if (key in pitchMap && !pressedKeys.has(key)) {transposeToKey(key)} // transpose
        else if (key == '[') {transposeDownOne()} // transpose 1 semitone down
        else if (key == ']') {transposeUpOne()} // transpose 1 semitone up
        else if (key == 'tab') {toggleModal(!states.modalShown ? true : false)}
        else if (key == 'capslock') {toggleStopAudioWhenReleased()} // stopaudiowhenreleased
        else if (key == '\\') {toggleLights()} // lights
        else if (key == 'escape') {toggleMenu()} // menu
        else if (key == 'backspace') {toggleKeyboardMode()} // keyboardmode
        switch(key) { // detect arrow key: octave change
            case 'arrowleft':
                octaveDown();
                break
            case 'arrowdown':
                octaveDown();
                break;
            case 'arrowright':
                octaveUp();
                break;
            case 'arrowup':
                octaveUp();
                break;
        }         
        // ONLY PUT TRANSCRIBE FUNCTION HERE AFTER EVERYTHING RUNS
        // transcribe using midiNote as MIDI, input e.key
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
// increment keypress

function incrementCumKeypress() { // logs each time a key is pressed
    cumulativeKeypress = parseInt(localStorage.getItem("cumulativeKeypress") ?? '0');
    cumulativeKeypress++; 
    cumKeypressDisplay.textContent = cumulativeKeypress.toString();
    localStorage.setItem("cumulativeKeypress", cumulativeKeypress.toString());
}


