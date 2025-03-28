import * as Tone from 'tone';

let effectNodes: any[] = [
    null, // 0 no effect
    new Tone.Distortion(), // 1
    new Tone.AutoWah(),    // 2
    new Tone.BitCrusher(),  // 3
    new Tone.Freeverb(), // 4

];

const instruments: any[] = [
    new Tone.Sampler({ 
        urls: {
            "A4": "a4.mp3",
            "A5": "a5.mp3",
            "A6": "a6.mp3",
            "A7": "a7.mp3",
            "D#4": "ds4.mp3",
            "D#5": "ds5.mp3",
            "D#6": "ds6.mp3",
            "D#7": "ds7.mp3"
        },
        baseUrl: "./assets/audio/piano/",
        onload: () => {
            console.log("piano samples loaded");
        }, 
    }), // 0 piano sampler
    new Tone.Sampler({ 
        urls: {
            "A3": "a3.mp3",
            "A4": "a4.mp3",
            "A5": "a5.mp3",
            "D#3": "ds3.mp3",
            "D#4": "ds4.mp3",
            "D#5": "ds5.mp3",
        },
        baseUrl: "./assets/audio/eguitar/",
        onload: () => {
            console.log("e-guitar samples loaded");
        }, 
    }), // 1 eguitar sampler
    new Tone.Sampler({ 
        urls: {
            "A3": "a3.mp3",
            "A4": "a4.mp3",
            "A5": "a5.mp3",
            "A6": "a6.mp3",
            "D#4": "ds4.mp3",
            "D#5": "ds5.mp3",
            "D#6": "ds6.mp3",
            "D#7": "ds7.mp3"
        },
        baseUrl: "./assets/audio/musicbox/",
        onload: () => {
            console.log("musicbox samples loaded");
        }, 
    }), // 2 musicbox sampler
    new Tone.Sampler({ 
        urls: {
            "A4": "a4.mp3",
            "A5": "a5.mp3",
            "A6": "a6.mp3",
            "D#4": "ds4.mp3",
            "D#5": "ds5.mp3",
            "D#6": "ds6.mp3",
        },
        baseUrl: "./assets/audio/flute/",
        onload: () => {
            console.log("flute samples loaded");
        }, 
    }), // 3 flute sampler
    new Tone.Sampler({ 
        urls: {
            "A3": "a3.mp3",
            "A4": "a4.mp3",
            "A5": "a5.mp3",
            "D#3": "ds3.mp3",
            "D#4": "ds4.mp3",
            "D#5": "ds5.mp3",
        },
        baseUrl: "./assets/audio/horn/",
        onload: () => {
            console.log("horn samples loaded");
        }, 
    }), // 4 horn sampler
    new Tone.Sampler({ 
        urls: {
            "A4": "a4.mp3",
            "A5": "a5.mp3",
            "A6": "a6.mp3",
            "D#4": "ds4.mp3",
            "D#5": "ds5.mp3",
            "D#6": "ds6.mp3",
        },
        baseUrl: "./assets/audio/bugle/",
        onload: () => {
            console.log("bugle samples loaded");
        }, 
    }), // 5 bugle sampler
    new Tone.PolySynth(Tone.Synth), // 6
    new Tone.PolySynth(Tone.DuoSynth), // 7
    new Tone.PolySynth(Tone.FMSynth), // 8
    new Tone.PolySynth(Tone.AMSynth), // 9
    new Tone.Sampler({ 
        urls: {
            "A3": "a3.mp3",
            "B2": "b2.mp3",
            "B4": "b4.mp3",
            "B5": "b5.mp3",
            "C4": "c4.mp3",
            "D#4": "ds4.mp3",
            "F3": "f3.mp3",
            "F4": "f4.mp3",
            "F5": "f5.mp3"
        },
        baseUrl: "./assets/audio/meow/",
        onload: () => {
            console.log("meow samples loaded");
        }, 
    }), // 10 meow sampler
    new Tone.Sampler({ 
        urls: {
            "F3": "f3.wav",
            "A3": "a3.wav",
            "C4": "c4.wav",
            "F4": "f4.wav",
            "Bb4": "bb4.wav",
            "C5": "c5.wav",
            "F5": "f5.wav",
            "C6": "c6.wav",
            "F6": "f6.wav",
        },
        baseUrl: "./assets/audio/otto-doo/",
        onload: () => {
            console.log("otto doo samples loaded");
        }, 
    }), // 11 otto doo
    new Tone.Sampler({ 
        urls: {
            "C3": "c3.wav",
            "F3": "f3.wav",
            "C4": "c4.wav",
            "F4": "f4.wav",
            "Bb4": "bb4.wav",
            "C5": "c5.wav",
            "F5": "f5.wav",
            "C6": "c6.wav",
            "F6": "f6.wav",
        },
        baseUrl: "./assets/audio/otto-synth/",
        onload: () => {
            console.log("otto synth samples loaded");
        }, 
    }), // 12 otto synth

    new Tone.Sampler({ 
        urls: {
            "A3": "a3.mp3",
            "A4": "a4.mp3",
            "A5": "a5.mp3",
            "D#3": "ds3.mp3",
            "D#4": "ds4.mp3",
            "D#5": "ds5.mp3",
        },
        baseUrl: "./assets/audio/guitar/",
        onload: () => {
            console.log("guitar samples loaded");
        }, 
    }), // 13 guitar

    new Tone.Sampler({ 
        urls: {
            "A3": "a3.wav",
            "A4": "a4.wav",
            "A5": "a5.wav",
            "D#4": "ds4.wav",
            "D#5": "ds5.wav",
            "D#6": "ds6.wav",
            "F#6": "fs6.wav"
        },
        baseUrl: "./assets/audio/violin/",
        onload: () => {
            console.log("violin samples loaded");
        }, 
    }), // 14 violin 
    // SOURCE: FREESOUND.ORG

    // todo: explore & add more
];

const instrumentNames: string[] = [
    "Piano (Sampler)",
    "E-Guitar (Sampler)",
    "Music Box (Sampler)",
    "Flute (Sampler)",
    "Horn (Sampler)",
    "Bugle (Sampler)",
    "Synth",
    "Duo Synth",
    "FM Synth",
    "AM Synth",
    "Meow",
    "Otto - Doo",
    "Otto - Synth",
    "Guitar (Sampler)",
    "Violin (Sampler)"
]

export { effectNodes, instruments, instrumentNames };
