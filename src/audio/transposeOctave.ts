import { states } from "../core/states";
import { pitchMap, transposeMap, pitchMapReversed } from "../core/maps";
import { updateVisualGuide } from "../visual/visualguide";
import { updateStatusMsg } from "../core/logging";

const transposeValueDisplay = document.getElementById("transpose-value")!; // past: transposeValueBox
const scaleValueDisplay1 = document.getElementById("scale-value")!; // past: scaleValueBox
const scaleValueDisplay2 = document.getElementById("scale-value-2")!; // past: scaleValueBox2

const octaveValueDisplay = document.getElementById("octave-value")!; // past: octaveValueBox



export function transposeToKey(key:string) {
    states.lastPressedTransposeKey = key;
    states.transposeValue = pitchMap[key]; // in semitones
    transposeValueDisplay.innerHTML = pitchMap[key].toString(); // returns semitone count
    scaleValueDisplay1.innerHTML = transposeMap[pitchMap[key]].toString(); // returns scale ("C", "D", etc)
    scaleValueDisplay2.innerHTML = transposeMap[pitchMap[key]].toString(); // returns the same scale for better visualisation
    updateVisualGuide();
    console.log(`transpose pressed: ${key}`);
    updateStatusMsg(`transpose value updated to: ${pitchMap[key]}`);
}

export function transposeUpOne() {
    if (states.transposeValue == 12 && states.octave == 3) {
        updateStatusMsg("Already at maximum octave!");
        return;
    } else if (states.transposeValue == 11 && states.octave == 3) {
        octaveUp();
        states.transposeValue = 12;
    } else if (states.transposeValue == 11) {
        octaveUp();
        states.transposeValue = 0;
    } else {
        states.transposeValue++;
    }
    states.lastPressedTransposeKey = pitchMapReversed[states.transposeValue];
    transposeValueDisplay.innerHTML = states.transposeValue.toString();
    scaleValueDisplay1.innerHTML = transposeMap[states.transposeValue].toString();
    scaleValueDisplay2.innerHTML = transposeMap[states.transposeValue].toString();
    updateVisualGuide();
    updateStatusMsg(`transpose value updated to: ${states.transposeValue}`);
}

export function transposeDownOne() {
    if (states.transposeValue == 0 && states.octave == -2) {
        updateStatusMsg("Already at minimum octave!");
        return;
    }
    else if (states.transposeValue == 0) {
        octaveDown();
        states.transposeValue = 11;
    } else {
        states.transposeValue--;
    }
    states.lastPressedTransposeKey = pitchMapReversed[states.transposeValue];
    transposeValueDisplay.innerHTML = states.transposeValue.toString();
    scaleValueDisplay1.innerHTML = transposeMap[states.transposeValue].toString();
    scaleValueDisplay2.innerHTML = transposeMap[states.transposeValue].toString();
    updateVisualGuide();
    updateStatusMsg(`transpose value updated to: ${states.transposeValue}`);
}



// export function transposeBySemitones(semitones: number) {
//     const octaveChange: number = Math.floor(semitones / 12);
//     if (states.transposeValue + semitones >= 0 && states.transposeValue + semitones <= 11) {
//         states.transposeValue += semitones;
//         console.log("AAA");
//     } else {
//         console.log("BBB");
//         if (semitones > 0) {
//             if (states.transposeValue === 11) {octaveUp()}
//             octaveUp(octaveChange);
//             states.transposeValue += semitones;
//             states.transposeValue %= 12;
//         } else {
//             octaveDown(Math.abs(octaveChange));
//             states.transposeValue += semitones;
//             states.transposeValue = (states.transposeValue % 12 + 12) % 12;
//         }
//     } 
//     states.lastPressedTransposeKey = pitchMapReversed[states.transposeValue];
//     transposeValueDisplay.innerHTML = states.transposeValue.toString();
//     scaleValueDisplay1.innerHTML = transposeMap[states.transposeValue].toString();
//     scaleValueDisplay2.innerHTML = transposeMap[states.transposeValue].toString();
//     updateVisualGuide(states.lastPressedTransposeKey);
//     updateStatusMsg(`transpose value updated to: ${states.transposeValue}`);
// }



// ===========================================
// OCTAVE CHANGE

export function octaveUp(diff:number | null = null) {
    if (diff == null) {
        if (states.octave >= 3) {
            updateStatusMsg("Already at maximum octave!");
            return;
        }
        states.octave++;
        states.octaveAdjustment += 12;
    } else if (states.octave + diff > -2){
        if (states.octave + diff >= 3) {
            states.octave = 3;
            states.octaveAdjustment = 36;
        } else {
            states.octave += diff;
            states.octaveAdjustment += 12 * diff;
        }
    }
    octaveValueDisplay.innerHTML = states.octave.toString();
    updateStatusMsg(`octave shift updated to: ${states.octave}`);
    updateVisualGuide();
}

export function octaveDown(diff:number | null = null) {
    // input positive number
    if (diff == null) {
        if (states.octave <= -2) {
            updateStatusMsg("Already at minimum octave!");
            return;
        }
        states.octave--;
        states.octaveAdjustment -= 12;
    } else if (states.octave - diff < 3){
        if (states.octave - diff <= -2) {
            states.octave = -2;
            states.octaveAdjustment = -24 
        } else {
            states.octave -= diff;
            states.octaveAdjustment -= 12 * diff;
        }
    }
    octaveValueDisplay.innerHTML = states.octave.toString();
    updateStatusMsg(`octave shift updated to: ${states.octave}`);
    updateVisualGuide();
}