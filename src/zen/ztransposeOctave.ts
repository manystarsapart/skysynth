import { states } from "./zstates";
import { pitchMap, pitchMapReversed } from "../core/maps";
import { updateVisualGuide } from "./zvisualGuide";



export function transposeToKey(key:string) {
    transposeToNumericalKey(pitchMap[key]);
}

export function transposeToNumericalKey(key:number) {
    states.lastPressedTransposeKey = pitchMapReversed[key];
    states.transposeValue = key; // in semitones
    // scaleValueDisplay2.innerHTML = transposeMap[key].toString(); // returns the same scale for better visualisation
    updateVisualGuide();
    console.log(`transpose value updated to: ${key}`);
}

export function transposeUpOne() {
    if (states.transposeValue == 12 && states.octave == 3) {
        console.log("Already at maximum octave!");
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
    // scaleValueDisplay2.innerHTML = transposeMap[states.transposeValue].toString();
    updateVisualGuide();
    console.log(`transpose value updated to: ${states.transposeValue}`);
}

export function transposeDownOne() {
    if (states.transposeValue == 0 && states.octave == -2) {
        console.log("Already at minimum octave!");
        return;
    }
    else if (states.transposeValue == 0) {
        octaveDown();
        states.transposeValue = 11;
    } else {
        states.transposeValue--;
    }
    states.lastPressedTransposeKey = pitchMapReversed[states.transposeValue];
    // scaleValueDisplay2.innerHTML = transposeMap[states.transposeValue].toString();
    updateVisualGuide();
    console.log(`transpose value updated to: ${states.transposeValue}`);
}

// ===========================================
// OCTAVE CHANGE

export function octaveTo(octave:number) {
    if (octave >= -2 && octave <= 3) {
        states.octave = octave;
        states.octaveAdjustment = 12 * octave
    } else {
        console.log(`octave (${octave}) out of range`);
    }
    console.log(`octave shift updated to: ${states.octave}`);
    updateVisualGuide();
}

export function octaveUp(diff:number | null = null) {
    if (diff == null) {
        if (states.octave >= 3) {
            console.log("Already at maximum octave!");
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
    console.log(`octave shift updated to: ${states.octave}`);
    updateVisualGuide();
}

export function octaveDown(diff:number | null = null) {
    // input positive number
    if (diff == null) {
        if (states.octave <= -2) {
            console.log("Already at minimum octave!");
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

    console.log(`octave shift updated to: ${states.octave}`);
    updateVisualGuide();
}