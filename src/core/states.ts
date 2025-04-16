import { keyboardMode0 } from "./maps";
import { instruments, effectNodes, instrumentNames } from "../audio/instruEffect";

export let states: any = {
    skysynthVersion: "0.19.1",
    skysynthLastUpdateDate: "16-04-2025",

    shiftPressed: false,
    leftAltPressed: false,
    rightAltPressed: false,
    currentLightsOn: true,
    stopAudioWhenReleased: false,
    navbarExtended: false,
    modalShown: false,
    waterMaskShown: true,
    backgroundShown: true,


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

    maxWaterLevel: 500,
    currentWaterLevel: parseInt(localStorage.getItem("savedWaterLevel") ?? '0') || 0,
    totalWaterReward: parseInt(localStorage.getItem("totalWaterReward") ?? '0') || 0,
    volume: parseInt(localStorage.getItem("savedVolume") ?? '100') || 100,

    charIdle: true,
    charCurrentSpriteID: 0,
    charWidthPercentage: parseInt(localStorage.getItem("savedCharWidth") ?? '100') || 100,

    isTranscribing: false,  
    latestTranscribeNoteIndex: 0,
    latestTranscribeOperationIndex: 0,
    lastTranscribedSongID: 0,
}

export const pressedKeys: Set<string> = new Set();

export const activeKeyTimeouts = new Map();