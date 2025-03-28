import { keyboardMode0 } from "./maps";
import { instruments, effectNodes } from "./instrueffect";

export let states: any = {
    shiftPressed: false,
    leftAltPressed: false,
    rightAltPressed: false,
    currentLightsOn: true,
    stopAudioWhenReleased: false,


    currentInstrument: instruments[0],
    currentEffectNode: effectNodes[0],

    currentKeyboardMode: 0,
    octave: 0,
    octaveAdjustment: 0,
    transposeValue: 0,

    letterMap: keyboardMode0,
    lastPressedTransposeKey: '`',


}

// export const

export const pressedKeys: Set<string> = new Set();

export const activeKeyTimeouts = new Map();