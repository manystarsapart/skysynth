import { keyboardMode0 } from "../core/maps";
import { instruments, effectNodes, instrumentNames } from "../audio/instruEffect";

export let states: any = {
    spacePressed: false,
    shiftPressed: false,
    leftAltPressed: false,
    rightAltPressed: false,
    stopAudioWhenReleased: false,

    currentInstrument: instruments[0],
    currentInstrumentIndex: 0,
    currentInstrumentName: instrumentNames[0],
    currentEffectNode: effectNodes[0],

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