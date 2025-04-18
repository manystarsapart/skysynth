import { states } from '../core/states.ts';
import { leftKeyboardKeys, rightKeyboardKeys } from '../core/maps.ts';
import { pressedKeys, activeKeyTimeouts } from '../core/states.ts';
import * as Tone from 'tone';
import { midiToNote, midiToOctave } from '../core/logging.ts';
import { refreshKeypressHandlers } from '../core/keypress.ts';
import { transcribeKeypress } from '../sheets/transcribe.ts';

// visual guide
const notesDivL = document.getElementById("notes-div-left")!;
const notesDivR = document.getElementById("notes-div-right")!;

export const shiftIndicator = document.getElementById("shift-indicator")!;
export const leftAltIndicator = document.getElementById("l-alt-indicator")!;
export const rightAltIndicator = document.getElementById("r-alt-indicator")!;

// detects for SHIFT pressed & released AND alt pressed & released

document.addEventListener('keydown', function(e) {
    if (e.key === 'Shift') {
        states.shiftPressed = true;
        shiftIndicator.style.backgroundColor = "#588157";
        updateVisualGuideOnOneSide(0);
        updateVisualGuideOnOneSide(1);

        if (states.isTranscribing === true) transcribeKeypress(false, e.key, null, true); // TRANSCRIBE

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

        if (states.isTranscribing === true) transcribeKeypress(false, e.key, null, true); // TRANSCRIBE
    } 
    else if (e.key === 'Alt' && e.location === 2) {
        // right alt key
        e.preventDefault();
        states.rightAltPressed = true;
        rightAltIndicator.style.backgroundColor = "#588157";
        updateVisualGuideOnOneSide(1);

        if (states.isTranscribing === true) transcribeKeypress(false, e.key, null, true); // TRANSCRIBE
    }

   
});
document.addEventListener('keyup', function(e) {
    if (e.key === 'Shift') {
        states.shiftPressed = false;
        shiftIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(0);
        updateVisualGuideOnOneSide(1);
        if (states.isTranscribing === true) transcribeKeypress(false, e.key, null, false); 
    }
    else if (e.key === 'Alt' && e.location === 1 && states.leftAltPressed) {
        // left alt key
        states.leftAltPressed = false;
        leftAltIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(0);
        if (states.isTranscribing === true) transcribeKeypress(false, e.key, null, false); 
    } 
    else if (e.key === 'Alt' && e.location === 2 && states.rightAltPressed) {
        // right alt key
        states.rightAltPressed = false;
        rightAltIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(1);
        if (states.isTranscribing === true) transcribeKeypress(false, e.key, null, false); 
    }


});


document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        disableSemitoneUp();
    }
    });

window.addEventListener('focus',disableSemitoneUp);


function disableSemitoneUp() { // only activated on visibility change
    
    if (states.shiftPressed) { // catch shift being held when tabbing away 
        states.shiftPressed = false;
        shiftIndicator.style.backgroundColor = "";
        
    }
    if (states.leftAltPressed) {
        states.leftAltPressed = false;
        leftAltIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(0);
    }
    if (states.rightAltPressed) {
        states.rightAltPressed = false;
        rightAltIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(1);
    }
    if (pressedKeys.size != 0) { // catch notes being held when tabbing away
        pressedKeys.forEach(element => {
            let releaseNote: number = states.letterMap[element] + states.transposeValue + states.octaveAdjustment;
            pressedKeys.delete(element);
            removeVisualGuideStyleChange(document.getElementById(element) as HTMLElement);
            states.currentInstrument.triggerRelease(Tone.Frequency(releaseNote, "midi"));
            states.currentInstrument.triggerRelease(Tone.Frequency(releaseNote, "midi"));
            states.currentInstrument.triggerRelease(Tone.Frequency(releaseNote+1, "midi"));
        });
    }

    updateVisualGuideOnOneSide(0);
    updateVisualGuideOnOneSide(1);

    // MAY WANT TO TRANSCRIBE THIS AS WELL. WHEN VISIBILITY CHANGES FROM USER TABBING IN AND OUT DURING TRANSCRIPTION  
}


export function updateVisualGuide() {
    notesDivL.innerHTML = mapNumbersToNotes(0)!;
    notesDivR.innerHTML = mapNumbersToNotes(1)!;
    refreshKeypressHandlers();
    if (!states.currentLightsOn) {
        toggleVGWhiteBg();
        if (shiftIndicator.classList.contains("bg-white/80")) {
            shiftIndicator.classList.toggle("bg-white/80");
        }
        if (leftAltIndicator.classList.contains("bg-white/80")) {
            leftAltIndicator.classList.toggle("bg-white/80");
        }
        if (rightAltIndicator.classList.contains("bg-white/80")) {
            rightAltIndicator.classList.toggle("bg-white/80");
        }
        for (const child of notesDivL.children) {
            if (child.classList.contains("bg-white/80")) {
                child.classList.toggle("bg-white/80");
            }
        }
        for (const child of notesDivR.children) {
            if (child.classList.contains("bg-white/80")) {
                child.classList.toggle("bg-white/80");
            }
        }
    }
}

    
export function updateVisualGuideOnOneSide(leftright: number) {
    // 0: left
    // 1: right
    const operationalDiv = leftright ? notesDivR : notesDivL
    // operationalDiv.innerHTML = mapNumbersToNotes(transpose, leftright)!;
    operationalDiv.innerHTML = mapNumbersToNotes(leftright);
    refreshKeypressHandlers();
    if (!states.currentLightsOn) {
        for (const child of operationalDiv.children) {
            if (child.classList.contains("bg-white/80")) {
                child.classList.toggle("bg-white/80");
            }
        }
    }
}

// ===========================================
// VISUAL GUIDE IMPROVED

function mapNumbersToNotes(leftright: number) {
    const finalHTML: string[] = [];
    const keyboardKeysArray: string[] = Array.from(leftright === 0 ? leftKeyboardKeys : rightKeyboardKeys);
    keyboardKeysArray.forEach((item) => {
        // console.log(`keyID: ${index}, key: ${item}`);
        let finalMIDI: number = states.letterMap[item] + states.transposeValue + states.octaveAdjustment; 
        if (states.shiftPressed && !states.leftAltPressed && !states.rightAltPressed) finalMIDI++;
        else if (leftright === 0 && states.leftAltPressed) finalMIDI++;
        else if (leftright === 1 && states.rightAltPressed) finalMIDI++;
        finalHTML.push(createNoteDiv(item, midiToNote(finalMIDI), midiToOctave(finalMIDI)));
      });
    return finalHTML.join('');
}


function createNoteDiv(id: string, note: string, octave: number) {
    return `<div id="${id}" class="keyboard-key flex flex-col items-center justify-center p-2 rounded-4xl border-3 text-center h-30 w-30 relative bg-white/80">
                <div>
                    ${note}<sub class="text-lg">${octave}</sub>
                </div>
                <span class="text-2xl">${id.toUpperCase()}</span>
            </div>`;
}

// ===========================================


export function toggleVGWhiteBg() {
    shiftIndicator.classList.toggle("bg-white/80");
    leftAltIndicator.classList.toggle("bg-white/80");
    rightAltIndicator.classList.toggle("bg-white/80");
    let visualGuideChildrenL = document.getElementById("notes-div-left")!.children;
    let visualGuideChildrenR = document.getElementById("notes-div-right")!.children;
    for (let i=0; i<visualGuideChildrenL.length; i++) {
        visualGuideChildrenL[i].classList.toggle("bg-white/80");
    }
    for (let i=0; i<visualGuideChildrenR.length; i++) {
        visualGuideChildrenR[i].classList.toggle("bg-white/80");
    }
}



// ===========================================
// APPLYING STYLE CHANGES TO DIV ON PRESS

export function applyVisualGuideStyleChange(key:HTMLElement) {
    // cancel pending removal

    if (activeKeyTimeouts.has(key)) {
        clearTimeout(activeKeyTimeouts.get(key));
        activeKeyTimeouts.delete(key);
    }
    // key.classList.remove('bg-white/80');
    key.classList.add(states.stopAudioWhenReleased ? 'key-active-instant' : 'key-active');
    void key.offsetWidth; // force reflow
}

    
export function removeVisualGuideStyleChange(key:HTMLElement) {

    key.classList.remove('key-active-instant');
    
    if (states.stopAudioWhenReleased) {
        key.classList.remove('key-active');
    } else {
        const timeoutId = setTimeout(() => {
            key.classList.remove('key-active');
            activeKeyTimeouts.delete(key);
        }, 100); // 100ms because duration-100
        activeKeyTimeouts.set(key, timeoutId);
    }
    void key.offsetWidth; // force reflow
}