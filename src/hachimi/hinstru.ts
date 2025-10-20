// =====================================================================
// UGHHHH DEPENDENCIES
import * as Tone from 'tone';
import { states } from './hstates.ts';
// volume
export let volumeNode = new Tone.Volume().toDestination();

export const HinstrumentNames: string[] = [];
export const HinstrumentSpriteCounts: number[] = []
type NoteMap = Record<string, string>;
function createSampler (config: {
    baseUrl: string;
    noteMap: NoteMap;
    name: string;
}, sprites:number) {
    HinstrumentNames.push(config.name);
    HinstrumentSpriteCounts.push(sprites)
    return new Tone.Sampler({
        urls: config.noteMap,
        baseUrl: config.baseUrl,
        onload: () => console.log(`${config.name} samples loaded`),
})};




// =====================================================================
// HACHIMI SAMPLERS

export const ha = createSampler({
    name: "ha",
    baseUrl: "../assets/audio/hachimi/1ha/",
    noteMap: {
        "E2": "40_E2.wav", 
        "A2": "45_A2.wav", 
        "E3": "52_E3.wav", 
        "A3": "57_A3.wav", 
        "E4": "64_E4.wav", 
        "A4": "69_A4.wav", 
        "E5": "76_E5.wav", 
        "A5": "81_A5.wav", 
        "E6": "88_E6.wav", 
        "A6": "93_A6.wav", 
        "E7": "100_E7.wav", 
        "A7": "105_A7.wav", 
        "E8": "112_E8.wav", 
        "A8": "117_A8.wav", 
    }
}, 0);

export const chi = createSampler({
    name: "chi",
    baseUrl: "../assets/audio/hachimi/2chi/",
    noteMap: {
        "E2": "40_E2.wav", 
        "A2": "45_A2.wav", 
        "E3": "52_E3.wav", 
        "A3": "57_A3.wav", 
        "E4": "64_E4.wav", 
        "A4": "69_A4.wav", 
        "E5": "76_E5.wav", 
        "A5": "81_A5.wav", 
        "E6": "88_E6.wav", 
        "A6": "93_A6.wav", 
        "E7": "100_E7.wav", 
        "A7": "105_A7.wav", 
        "E8": "112_E8.wav", 
        "A8": "117_A8.wav", 
    }
}, 0);

export const mi = createSampler({
    name: "mi",
    baseUrl: "../assets/audio/hachimi/3mi/",
    noteMap: {
        "E2": "40_E2.wav", 
        "A2": "45_A2.wav", 
        "E3": "52_E3.wav", 
        "A3": "57_A3.wav", 
        "E4": "64_E4.wav", 
        "A4": "69_A4.wav", 
        "E5": "76_E5.wav", 
        "A5": "81_A5.wav", 
        "E6": "88_E6.wav", 
        "A6": "93_A6.wav", 
        "E7": "100_E7.wav", 
        "A7": "105_A7.wav", 
        "E8": "112_E8.wav", 
        "A8": "117_A8.wav", 
    }
}, 0);


// =====================================================================
// LOAD AUDIO & CONNECT BITS
document.addEventListener("DOMContentLoaded", () => {
    // const savedVolume:number = states.volume;
    // volumeControl.value = states.volume
    // volumeValueDisplay.textContent = `${states.volume}%`
    volumeNode.volume.value = Tone.gainToDb(states.volume/100);
    states.instrHa.connect(volumeNode);
    states.instrChi.connect(volumeNode);
    states.instrMi.connect(volumeNode);
    
})

// inst array
export const Hinstruments: any[] = [
    ha, // MUST BE 0
    chi, // MUST BE 1
    mi, // MUST BE 2
];

console.log(HinstrumentNames);

// =====================================================================


// HOW ARE WE DOING THIS????
// 1. DEFAULT: START AT HA
// 2. ON SINGULAR KEYDOWN: CHANGE INSTRUMENT TO CHI 
// 3. ON ANY KEYUP: KILL ALL HA & CHI & MI AT THAT TONE? <------    WONT WORK! lets just code in the three cases. 
//                                                                  this will mean transcribe doesnt work

// HACHIMI MODE

// 1. count
// 2. split hachimi cases on (count % 3)
// 3. pair each keypress with that count. release & kill using count % 3 as well


