import { keyboardMode0 } from "../core/maps";
// import { instruments, effectNodes, instrumentNames } from "../audio/instruEffect";
import { Hinstruments } from "./hinstru";

export let states: any = {

    // ===============================
    // HACHIMI STATES
    hachimiCount: 0,
    instrHa: Hinstruments[0],
    instrChi: Hinstruments[1],
    instrMi: Hinstruments[2],

    // ===============================

    spacePressed: false,
    shiftPressed: false,
    leftAltPressed: false,
    rightAltPressed: false,
    stopAudioWhenReleased: false,

    // currentInstrument: instruments[0],
    // currentInstrumentIndex: 0,
    // currentInstrumentName: instrumentNames[0],
    // currentEffectNode: effectNodes[0],

    currentKeyboardMode: 0,
    octave: 0,
    octaveAdjustment: 0,
    transposeValue: 0,

    letterMap: keyboardMode0,
    lastPressedTransposeKey: '`',

    whiteVisualGuideBg: true,

    volume: 100,
}

export const pressedKeys: Set<string> = new Set();

export const activeKeyTimeouts = new Map();