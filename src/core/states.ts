import { keyboardMode0 } from "./maps";
import { instruments, effectNodes } from "../audio/instruEffect";

export let states: any = {
    shiftPressed: false,
    leftAltPressed: false,
    rightAltPressed: false,
    currentLightsOn: true,
    stopAudioWhenReleased: false,
    navbarExtended: false,
    modalShown: false,


    currentInstrument: instruments[0],
    currentEffectNode: effectNodes[0],

    currentKeyboardMode: 0,
    octave: 0,
    octaveAdjustment: 0,
    transposeValue: 0,

    letterMap: keyboardMode0,
    lastPressedTransposeKey: '`',

    maxWaterLevel: 500,
    currentWaterLevel: parseInt(localStorage.getItem("savedWaterLevel") ?? '0') || 0,
    totalWaterReward: parseInt(localStorage.getItem("totalWaterReward") ?? '0') || 0,
    volume: parseInt(localStorage.getItem("savedVolume") ?? '100') || 100,
}

export const pressedKeys: Set<string> = new Set();

export const activeKeyTimeouts = new Map();