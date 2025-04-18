import * as Tone from 'tone';

// effect nodes

export const effectNodes: any[] = [
    null, // 0 no effect
    new Tone.Distortion(),  // 1
    new Tone.AutoWah(),     // 2
    new Tone.BitCrusher(),  // 3
    new Tone.Freeverb(),    // 4
];


// helper for sampler
type NoteMap = Record<string, string>;

const createSampler = (config: {
    baseUrl: string;
    noteMap: NoteMap;
    name: string;
}) => new Tone.Sampler({
    urls: config.noteMap,
    baseUrl: config.baseUrl,
    onload: () => console.log(`${config.name} samples loaded`),
});

// ============================

// instruments

// acoustic

const piano = createSampler({
    name: "Piano",
    baseUrl: "./assets/audio/piano/",
    noteMap: {
        "A4": "a4.mp3", 
        "A5": "a5.mp3", 
        "A6": "a6.mp3", 
        "A7": "a7.mp3",
        "D#4": "ds4.mp3", 
        "D#5": "ds5.mp3", 
        "D#6": "ds6.mp3", 
        "D#7": "ds7.mp3"
    }
});

const eGuitar = createSampler({
    name: "E-Guitar",
    baseUrl: "./assets/audio/eguitar/",
    noteMap: {
        "A3": "a3.mp3", 
        "A4": "a4.mp3", 
        "A5": "a5.mp3",
        "D#3": "ds3.mp3", 
        "D#4": "ds4.mp3", 
        "D#5": "ds5.mp3",
    }
});

const musicBox = createSampler({
    name: "Music Box",
    baseUrl: "./assets/audio/musicbox/",
    noteMap: {
        "A3": "a3.mp3", 
        "A4": "a4.mp3", 
        "A5": "a5.mp3", 
        "A6": "a6.mp3",
        "D#4": "ds4.mp3", 
        "D#5": "ds5.mp3", 
        "D#6": "ds6.mp3", 
        "D#7": "ds7.mp3"
    }
});


// wind
const flute = createSampler({
    name: "Flute",
    baseUrl: "./assets/audio/flute/",
    noteMap: {
        "A4": "a4.mp3", 
        "A5": "a5.mp3", 
        "A6": "a6.mp3",
        "D#4": "ds4.mp3", 
        "D#5": "ds5.mp3", 
        "D#6": "ds6.mp3",
    }
});

const horn = createSampler({
    name: "Horn",
    baseUrl: "./assets/audio/horn/",
    noteMap: {
        "A3": "a3.mp3", 
        "A4": "a4.mp3", 
        "A5": "a5.mp3",
        "D#3": "ds3.mp3", 
        "D#4": "ds4.mp3", 
        "D#5": "ds5.mp3",
    }
});

const bugle = createSampler({
    name: "Bugle",
    baseUrl: "./assets/audio/bugle/",
    noteMap: {
        "A4": "a4.mp3", 
        "A5": "a5.mp3", 
        "A6": "a6.mp3",
        "D#4": "ds4.mp3", 
        "D#5": "ds5.mp3", 
        "D#6": "ds6.mp3",
    }
});


// string
const guitar = createSampler({
    name: "Guitar",
    baseUrl: "./assets/audio/guitar/",
    noteMap: {
        "A3": "a3.mp3", 
        "A4": "a4.mp3", 
        "A5": "a5.mp3",
        "D#3": "ds3.mp3", 
        "D#4": "ds4.mp3", 
        "D#5": "ds5.mp3",
    }
});

const violin = createSampler({
    name: "Violin",
    baseUrl: "./assets/audio/violin/",
    noteMap: {
        "A3": "a3.wav", 
        "A4": "a4.wav", 
        "A5": "a5.wav",
        "D#4": "ds4.wav", 
        "D#5": "ds5.wav", 
        "D#6": "ds6.wav", 
        "F#6": "fs6.wav"
    }
});

const harp = createSampler({
    name: "Harp",
    baseUrl: "./assets/audio/harp/",
    noteMap: {
        "A3": "a3.mp3", 
        "A4": "a4.mp3", 
        "A5": "a5.mp3",
        "D#3": "ds3.mp3", 
        "D#4": "ds4.mp3", 
        "D#5": "ds5.mp3",
    }
});

const aurora = createSampler({
    name: "Aurora",
    baseUrl: "./assets/audio/aurora/",
    noteMap: {
        "C4": "c4.mp3", 
        "D4": "d4.mp3", 
        "E4": "e4.mp3", 
        "F4": "f4.mp3", 
        "G4": "g4.mp3", 
        "A4": "a4.mp3", 
        "B4": "b4.mp3", 
        "C5": "c5.mp3", 
        "D5": "d5.mp3", 
        "E5": "e5.mp3", 
        "F5": "f5.mp3", 
        "G5": "g5.mp3", 
        "A5": "a5.mp3", 
        "B5": "b5.mp3", 
        "C6": "c6.mp3", 


    }
});


// synths
const basicSynth = new Tone.PolySynth(Tone.Synth);
const duoSynth = new Tone.PolySynth(Tone.DuoSynth);
const fmSynth = new Tone.PolySynth(Tone.FMSynth);
const amSynth = new Tone.PolySynth(Tone.AMSynth);


// goof
const meow = createSampler({
    name: "Meow",
    baseUrl: "./assets/audio/meow/",
    noteMap: {
        "A3": "a3.mp3", "B2": "b2.mp3", "B4": "b4.mp3", "B5": "b5.mp3",
        "C4": "c4.mp3", "D#4": "ds4.mp3", "F3": "f3.mp3", "F4": "f4.mp3", "F5": "f5.mp3"
    }
});

const ottoDoo = createSampler({
    name: "Otto - Doo",
    baseUrl: "./assets/audio/otto-doo/",
    noteMap: {
        "F3": "f3.wav", "A3": "a3.wav", "C4": "c4.wav", "F4": "f4.wav",
        "Bb4": "bb4.wav", "C5": "c5.wav", "F5": "f5.wav", "C6": "c6.wav", "F6": "f6.wav",
    }
});

const ottoSynth = createSampler({
    name: "Otto - Synth",
    baseUrl: "./assets/audio/otto-synth/",
    noteMap: {
        "C3": "c3.wav", "F3": "f3.wav", "C4": "c4.wav", "F4": "f4.wav",
        "Bb4": "bb4.wav", "C5": "c5.wav", "F5": "f5.wav", "C6": "c6.wav", "F6": "f6.wav",
    }
});


// inst array
export const instruments: any[] = [
    // acoustic
    piano,      // 0
    eGuitar,    // 1
    musicBox,   // 2
    
    // wind
    flute,      // 3
    horn,       // 4
    bugle,      // 5

    // string
    guitar,     // 6
    violin,     // 7
    harp,        // 8
    aurora,     // 9
    
    // synth
    basicSynth, // 10
    duoSynth,   // 11
    fmSynth,    // 12
    amSynth,    // 13
    
    // goof
    meow,       // 14
    ottoDoo,    // 15
    ottoSynth,  // 16
    

];

export const RELEASE_SETTINGS = {
    "INSTANT_RELEASE_INSTRUMENTS": [
        "E-Guitar (Sampler)",
        "Violin (Sampler)",
        "Synth",
        "Duo Synth",
        "FM Synth",
        "AM Synth",
        "Otto - Synth"
    ]
};

export const instrumentNames: string[] = [
    "Piano (Sampler)", // 0
    "E-Guitar (Sampler)", // 1
    "Music Box (Sampler)", // 2
    "Flute (Sampler)", // 3
    "Horn (Sampler)", // 4
    "Bugle (Sampler)", // 5
    "Guitar (Sampler)", // 6
    "Violin (Sampler)", // 7
    "Harp (Sampler)", // 8
    "Aurora (Sampler)", // 9
    "Synth", // 10
    "Duo Synth", // 11
    "FM Synth", // 12
    "AM Synth", // 13
    "Meow", // 14
    "Otto - Doo", // 15
    "Otto - Synth", // 16
];