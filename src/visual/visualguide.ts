import { states } from '../states.ts';
import { pitchMap, transposeMap, mapNumbersToNotesOctaves, preserveKeyIDLeft, preserveKeyIDRight, mapNumbersToNotesMapping, transposeList } from '../maps.ts';
import { pressedKeys, activeKeyTimeouts } from '../states.ts';
import * as Tone from 'tone';

// visual guide
const notesDivL = document.getElementById("notes-div-left")!;
const notesDivR = document.getElementById("notes-div-right")!;

const shiftIndicator = document.getElementById("shift-indicator")!;
const leftAltIndicator = document.getElementById("l-alt-indicator")!;
const rightAltIndicator = document.getElementById("r-alt-indicator")!;

// visual guide
let realOctaveLeft: number = states.octave + 3;
let realOctaveRight: number = realOctaveLeft + 1;

// detects for SHIFT pressed & released AND alt pressed & released

document.addEventListener('keydown', function(e) {
    if (e.key === 'Shift') {
        states.shiftPressed = true;
        shiftIndicator.style.backgroundColor = "#588157";
        const newTranspose = (pitchMap[states.lastPressedTransposeKey] + 1);
    
        // THE SHIFT-NON-LIGHTING-UP PROBLEM LIES IN THESE TWO LINES
        updateVisualGuideOnOneSide(transposeMap[newTranspose.toString() as KeyType], 0);
        updateVisualGuideOnOneSide(transposeMap[newTranspose.toString() as KeyType], 1);

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
        updateVisualGuideOnOneSide(transposeMap[pitchMap[states.lastPressedTransposeKey]+1],0);
    } 
    else if (e.key === 'Alt' && e.location === 2) {
        // right alt key
        e.preventDefault();
        states.rightAltPressed = true;
        rightAltIndicator.style.backgroundColor = "#588157";
        updateVisualGuideOnOneSide(transposeMap[pitchMap[states.lastPressedTransposeKey]+1],1);
    }
});
document.addEventListener('keyup', function(e) {
    if (e.key === 'Shift') {
        states.shiftPressed = false;
        shiftIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(transposeMap[pitchMap[states.lastPressedTransposeKey]],0);
        updateVisualGuideOnOneSide(transposeMap[pitchMap[states.lastPressedTransposeKey]],1);
    }
    else if (e.key === 'Alt' && states.leftAltPressed) {
        // left alt key
        states.leftAltPressed = false;
        leftAltIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(transposeMap[pitchMap[states.lastPressedTransposeKey]],0);
    } 
    else if (e.key === 'Alt' && states.rightAltPressed) {
        // right alt key
        states.rightAltPressed = false;
        rightAltIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(transposeMap[pitchMap[states.lastPressedTransposeKey]],1);
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
        updateVisualGuideOnOneSide(transposeMap[pitchMap[states.lastPressedTransposeKey]],0);
    }
    if (states.rightAltPressed) {
        states.rightAltPressed = false;
        rightAltIndicator.style.backgroundColor = "";
        updateVisualGuideOnOneSide(transposeMap[pitchMap[states.lastPressedTransposeKey]],1);
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

    updateVisualGuideOnOneSide(transposeMap[pitchMap[states.lastPressedTransposeKey]],0);
    updateVisualGuideOnOneSide(transposeMap[pitchMap[states.lastPressedTransposeKey]],1);
}



export function updateVisualGuide(key: string) {
    notesDivL.innerHTML = mapNumbersToNotes(transposeMap[pitchMap[key]] as KeyType, 0)!;
    notesDivR.innerHTML = mapNumbersToNotes(transposeMap[pitchMap[key]] as KeyType, 1)!;
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



    
export function updateVisualGuideOnOneSide(transpose: any, leftright: number) {
    // 0: left
    // 1: right
    const operationalDiv = leftright ? notesDivR : notesDivL
    operationalDiv.innerHTML = mapNumbersToNotes(transpose, leftright)!;
    if (!states.currentLightsOn) {
        for (const child of operationalDiv.children) {
            if (child.classList.contains("bg-white/80")) {
                child.classList.toggle("bg-white/80");
            }
        }
    }
}



    // ===========================================
// VISUAL GUIDE

function createNoteDiv(id: string, note: string, octave: number) {
    return `<div id="${id}" class="flex flex-col items-center justify-center p-2 rounded-4xl border-3 text-center h-30 w-30 relative bg-white/80">
                <div>
                    ${note}<sub class="text-lg">${octave}</sub>
                </div>
                <span class="text-2xl">${id.toUpperCase()}</span>
            </div>`;
}

function mapNumbersToNotes(currentKey:KeyType, leftright:number) {    

    if (states.currentKeyboardMode === 0) {
        const effectiveTransposeValue: number = pitchMap[states.lastPressedTransposeKey] + (states.shiftPressed ? 1 : 0) + (!states.shiftPressed && (states.leftAltPressed || states.rightAltPressed) ? 1 : 0);
        realOctaveLeft = states.octave + 3 + Math.floor(effectiveTransposeValue / 12);
        realOctaveRight = realOctaveLeft + 1;
        const keyNotes: any = mapNumbersToNotesOctaves[currentKey];
        const octaveBase: number = leftright === 0 ? realOctaveLeft : realOctaveRight;
        const mappingFlattened: number[] = mapNumbersToNotesMapping.flat();
        let countC: number = 0;
        let keyIDcount = 0;
        const elements: string[] = mappingFlattened.map(num => {
            keyIDcount++;
            const isC: boolean = (num - 1) % 7 === 0;
            if (isC) countC++;
            const noteIndex: number = (num - 1) % 7;
            const note: any = keyNotes[noteIndex];
            const currentOctave: number = octaveBase + (countC - 1);
            if (leftright == 0) {
                return createNoteDiv(preserveKeyIDLeft[keyIDcount-1],note,currentOctave);
            } else {
                return createNoteDiv(preserveKeyIDRight[keyIDcount-1],note,currentOctave);
            }
        });
        return elements.join('');


        } else if (states.currentKeyboardMode === 1) {
            // +1
            let effectiveTransposeL: number = states.transposeValue + (states.shiftPressed ? 1 : 0) + (!states.shiftPressed && states.leftAltPressed ? 1 : 0);
        //   effectiveTransposeL %= 12;
            const keyNotesL: KeyType = mapNumbersToNotesOctaves[transposeList[effectiveTransposeL] as KeyType];
            realOctaveLeft = states.octave + 3;
            let effectiveTransposeR: number = states.transposeValue + 1 + (states.shiftPressed ? 1 : 0) + (!states.shiftPressed && states.rightAltPressed ? 1 : 0);
        //   effectiveTransposeR %= 12;
            const keyNotesR: KeyType = mapNumbersToNotesOctaves[transposeList[effectiveTransposeR] as KeyType];
            realOctaveRight = realOctaveLeft;
            const octaveBase = leftright === 0 ? realOctaveLeft + Math.floor(effectiveTransposeL / 12): realOctaveRight + Math.floor(effectiveTransposeR / 12);
            const mappingFlattened = mapNumbersToNotesMapping.flat();
            let countC = 0;
            let keyIDcount = 0;
            const elements = mappingFlattened.map(num => {
                keyIDcount++;
                const isC = (num - 1) % 7 === 0;
                if (isC) countC++;
                const noteIndex = (num - 1) % 7;
                const note = leftright === 0 ? keyNotesL[noteIndex] : keyNotesR[noteIndex];
                const currentOctave = octaveBase + (countC - 1);
                if (leftright == 0) {
                return createNoteDiv(preserveKeyIDLeft[keyIDcount-1],note,currentOctave);
            } else {
                return createNoteDiv(preserveKeyIDRight[keyIDcount-1],note,currentOctave);
                }
            });
            // console.log(elements);
            return elements.join('');


        } else if (states.currentKeyboardMode === 2) {
        // -1
        let effectiveTransposeR: number = states.transposeValue + (states.shiftPressed ? 1 : 0) + (!states.shiftPressed && states.rightAltPressed ? 1 : 0);
        //   effectiveTransposeR %= 12;
            const keyNotesR: KeyType = mapNumbersToNotesOctaves[transposeList[effectiveTransposeR] as KeyType];
            realOctaveRight = states.octave + 3;
            
        let effectiveTransposeL: number = states.transposeValue + 1 + (states.shiftPressed ? 1 : 0) + (!states.shiftPressed && states.leftAltPressed ? 1 : 0);
        //   effectiveTransposeL %= 12;
            const keyNotesL: KeyType = mapNumbersToNotesOctaves[transposeList[effectiveTransposeL] as KeyType];
            realOctaveLeft = realOctaveRight;

            const octaveBase = leftright === 0 ? realOctaveLeft + Math.floor(effectiveTransposeL / 12): realOctaveRight + Math.floor(effectiveTransposeR / 12);
            const mappingFlattened = mapNumbersToNotesMapping.flat();
            let countC = 0;
            let keyIDcount = 0;
            const elements = mappingFlattened.map(num => {
                keyIDcount++;
                const isC = (num - 1) % 7 === 0;
                if (isC) countC++;
                const noteIndex = (num - 1) % 7;
                const note = leftright === 0 ? keyNotesL[noteIndex] : keyNotesR[noteIndex];
                const currentOctave = octaveBase + (countC - 1);
                if (leftright == 0) {
                return createNoteDiv(preserveKeyIDLeft[keyIDcount-1],note,currentOctave);
            } else {
                return createNoteDiv(preserveKeyIDRight[keyIDcount-1],note,currentOctave);
                }
            });
            // console.log(elements);
            return elements.join('');
        }
    
}


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