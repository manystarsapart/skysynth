import * as Tone from 'tone';

// effect nodes

export const effectNodes: any[] = [
    null, // 0 no effect
    new Tone.Distortion(),  // 1
    new Tone.AutoWah(),     // 2
    new Tone.BitCrusher(),  // 3
    new Tone.Freeverb(),    // 4
];

export const instrumentNames: string[] = [];
export const instrumentSpriteCounts: number[] = []

// helper for sampler
type NoteMap = Record<string, string>;

function createSampler (config: {
    baseUrl: string;
    noteMap: NoteMap;
    name: string;
}, sprites:number) {
    instrumentNames.push(config.name);
    instrumentSpriteCounts.push(sprites)
    return new Tone.Sampler({
        urls: config.noteMap,
        baseUrl: config.baseUrl,
        onload: () => console.log(`${config.name} samples loaded`),
})};



// ============================

// instruments

// acoustic

const piano = createSampler({
    name: "Piano",
    baseUrl: "../assets/audio/piano/",
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
}, 10);

const grandpiano = createSampler({
    name: "Grand Piano",
    baseUrl: "../assets/audio/grandpiano/",
    noteMap: {
        "C4": "c4.wav", 
        "C5": "c5.wav", 
        "C6": "c6.wav", 
        "F4": "f4.wav",
        "F5": "f5.wav"
    }
}, 0); // use piano as default

const eGuitar = createSampler({
    name: "E-Guitar",
    baseUrl: "../assets/audio/eguitar/",
    noteMap: {
        "A3": "a3.mp3", 
        "A4": "a4.mp3", 
        "A5": "a5.mp3",
        "D#3": "ds3.mp3", 
        "D#4": "ds4.mp3", 
        "D#5": "ds5.mp3",
    }
}, 5); // use guitar as default

const musicBox = createSampler({
    name: "Music Box",
    baseUrl: "../assets/audio/musicbox/",
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
}, 0);

const banjo = createSampler({
    name: "Banjo",
    baseUrl: "../assets/audio/banjo/",
    noteMap: {
        "A3": "a3.wav", 
        "A4": "a4.wav", 
        "C3": "c3.wav", 
        "C4": "c4.wav", 
        "C5": "c5.wav", 
        "F3": "f3.wav",
        "F4": "f4.wav"
    }
}, 5); // use guitar as default

const pipa = createSampler({
    name: "Pipa",
    baseUrl: "../assets/audio/pipa/",
    noteMap: {
        "A3": "a3.wav", 
        "A4": "a4.wav", 
        "C3": "c3.wav", 
        "C4": "c4.wav", 
        "C5": "c5.wav", 
        "F3": "f3.wav",
        "F4": "f4.wav"
    }
}, 5); // use guitar as default

const kalimba = createSampler({
    name: "Kalimba",
    baseUrl: "../assets/audio/kalimba/",
    noteMap: {
        "A4": "a4.wav", 
        "A5": "a5.wav", 
        "C4": "c4.wav", 
        "C5": "c5.wav", 
        "C6": "c6.wav", 
        "F4": "f4.wav",
        "F5": "f5.wav"
    }
}, 0);

const xylophone = createSampler({
    name: "Xylophone",
    baseUrl: "../assets/audio/xylophone/",
    noteMap: {
        "A4": "a4.wav", 
        "A5": "a5.wav", 
        "C4": "c4.wav", 
        "C5": "c5.wav", 
        "C6": "c6.wav", 
        "F4": "f4.wav",
        "F5": "f5.wav"
    }
}, 0);

// wind
const flute = createSampler({
    name: "Flute",
    baseUrl: "../assets/audio/flute/",
    noteMap: {
        "A4": "a4.mp3", 
        "A5": "a5.mp3", 
        "A6": "a6.mp3",
        "D#4": "ds4.mp3", 
        "D#5": "ds5.mp3", 
        "D#6": "ds6.mp3",
    }
}, 5);

const horn = createSampler({
    name: "Horn",
    baseUrl: "../assets/audio/horn/",
    noteMap: {
        "A3": "a3.mp3", 
        "A4": "a4.mp3", 
        "A5": "a5.mp3",
        "D#3": "ds3.mp3", 
        "D#4": "ds4.mp3", 
        "D#5": "ds5.mp3",
    }
}, 7);

const bugle = createSampler({
    name: "Bugle",
    baseUrl: "../assets/audio/bugle/",
    noteMap: {
        "A4": "a4.mp3", 
        "A5": "a5.mp3", 
        "A6": "a6.mp3",
        "D#4": "ds4.mp3", 
        "D#5": "ds5.mp3", 
        "D#6": "ds6.mp3",
    }
}, 7);

const saxophone_short = createSampler({
    name: "Saxophone (Short)",
    baseUrl: "../assets/audio/saxophone_short/",
    noteMap: {
        "A3": "a3.wav", 
        "A4": "a4.wav", 
        "C3": "c3.wav", 
        "C4": "c4.wav", 
        "C5": "c5.wav", 
        "F3": "f3.wav",
        "F4": "f4.wav"
    }
}, 0);

const saxophone_long = createSampler({
    name: "Saxophone (Long)",
    baseUrl: "../assets/audio/saxophone_long/",
    noteMap: {
        "A3": "a3.wav", 
        "A4": "a4.wav", 
        "C3": "c3.wav", 
        "C4": "c4.wav", 
        "C5": "c5.wav", 
        "F3": "f3.wav",
        "F4": "f4.wav"
    }
}, 0);

const harmonica_short = createSampler({
    name: "Harmonica (Short)",
    baseUrl: "../assets/audio/harmonica_short/",
    noteMap: {
        "A4": "a4.wav", 
        "A5": "a5.wav", 
        "C4": "c4.wav", 
        "C5": "c5.wav", 
        "C6": "c6.wav", 
        "F4": "f4.wav",
        "F5": "f5.wav"
    }
}, 0);

const harmonica_long = createSampler({
    name: "Harmonica (Long)",
    baseUrl: "../assets/audio/harmonica_long/",
    noteMap: {
        "A4": "a4.wav", 
        "A5": "a5.wav", 
        "C4": "c4.wav", 
        "C5": "c5.wav", 
        "C6": "c6.wav", 
        "F4": "f4.wav",
        "F5": "f5.wav"
    }
}, 0);

// string
const guitar = createSampler({
    name: "Guitar",
    baseUrl: "../assets/audio/guitar/",
    noteMap: {
        "A3": "a3.mp3", 
        "A4": "a4.mp3", 
        "A5": "a5.mp3",
        "D#3": "ds3.mp3", 
        "D#4": "ds4.mp3", 
        "D#5": "ds5.mp3",
    }
}, 5);

const violin_short = createSampler({
    name: "Violin (Short)",
    baseUrl: "../assets/audio/violin_short/",
    noteMap: {
        "C4": "c4.wav", 
        "C5": "c5.wav", 
        "C6": "c6.wav", 
        "F4": "f4.wav",
        "F5": "f5.wav"
    }
}, 0);

const violin_long = createSampler({
    name: "Violin (Long)",
    baseUrl: "../assets/audio/violin_long/",
    noteMap: {
        "C4": "c4.wav", 
        "C5": "c5.wav", 
        "C6": "c6.wav", 
        "F4": "f4.wav",
        "F5": "f5.wav"
    }
}, 0);

const harp = createSampler({
    name: "Harp",
    baseUrl: "../assets/audio/harp/",
    noteMap: {
        "A3": "a3.mp3", 
        "A4": "a4.mp3", 
        "A5": "a5.mp3",
        "D#3": "ds3.mp3", 
        "D#4": "ds4.mp3", 
        "D#5": "ds5.mp3",
    }
}, 5);

const aurora = createSampler({
    name: "Aurora",
    baseUrl: "../assets/audio/aurora/",
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
}, 0);


// synths
const basicSynth = new Tone.PolySynth(Tone.Synth);
instrumentNames.push("Synth");
instrumentSpriteCounts.push(0);

const duoSynth = new Tone.PolySynth(Tone.DuoSynth);
instrumentNames.push("Duo Synth");
instrumentSpriteCounts.push(0);

const fmSynth = new Tone.PolySynth(Tone.FMSynth);
instrumentNames.push("FM Synth");
instrumentSpriteCounts.push(0);

const amSynth = new Tone.PolySynth(Tone.AMSynth);
instrumentNames.push("AM Synth");
instrumentSpriteCounts.push(0);


// goof
const meow = createSampler({
    name: "Meow",
    baseUrl: "../assets/audio/meow/",
    noteMap: {
        "A3": "a3.mp3", "B2": "b2.mp3", "B4": "b4.mp3", "B5": "b5.mp3",
        "C4": "c4.mp3", "D#4": "ds4.mp3", "F3": "f3.mp3", "F4": "f4.mp3", "F5": "f5.mp3"
    }
}, 7);


// expt

// const tet = createSampler({
//     name: "tet",
//     baseUrl: "../assets/audio/tet/",
//     noteMap: {
//         "C4": "c4.wav",
//         "C5": "c5.wav",
//     }
// }, 0);

const expt2 = createSampler({ 
    name: "rhodes (expt)",
    baseUrl: "../assets/audio/expt2/",
    noteMap: {
        // "F6": "f6.wav" // diangun 凤鸣
        "C4": "c5.wav" // rhodes not bad
        // "C4": "brassc4.wav" // brass
        // "C5": "saxc5.wav" // sax. i dont quite like the sound though
        // "G5": "voiceg5.mp3" // this is TERRIBLE
        // "C5": "bellsc5.wav" // tubular bells I HATE HTIS
        // "C3": "slapbassc2.wav" // slap bass
        // "C2": "bassc2.wav" // slap bass
    }
}, 0);

// const expt3 = createSampler({ // 嘟
//     name: "expt3",
//     baseUrl: "../assets/audio/expt3/",
//     noteMap: {
//         "Bb4": "bb4.wav"
//     }
// }, 0);


// inst array
export const instruments: any[] = [
    // acoustic
    piano,          // 0
    grandpiano,     // 1
    eGuitar,        // 2
    musicBox,       // 3
    banjo,          // 4
    pipa,           // 5
    kalimba,        // 6
    xylophone,      // 7
    
    // wind
    flute,          // 8
    horn,           // 9
    bugle,          // 10
    saxophone_short, // 11
    saxophone_long, // 12
    harmonica_short, // 13
    harmonica_long, // 14

    // string
    guitar,         // 15
    violin_short,   // 16
    violin_long,    // 17
    harp,           // 18
    aurora,         // 19
    
    // synth
    basicSynth,     // 20
    duoSynth,       // 21
    fmSynth,        // 22
    amSynth,        // 23
    
    // fun
    meow,           // 24

    // expt
    // tet,
    expt2,
    // expt3

];

export const RELEASE_SETTINGS = {
    "INSTANT_RELEASE_INSTRUMENTS": [
        "E-Guitar",
        "Saxophone (Long)",
        "Harmonica (Long)",
        "Violin (Long)",
        "Synth",
        "Duo Synth",
        "FM Synth",
        "AM Synth",
        // "tet",
        "rhodes (expt)",
        // "expt3"
    ]
};

console.log(instrumentNames);


// for (let i = 0; i < instruments.length; i++) {
//     instrumentNames.push(instruments[i].name);
// }