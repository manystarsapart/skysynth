import * as Tone from 'tone';

document.addEventListener("DOMContentLoaded", () => {

    // NOT IN THIS CODE: FIREBASE & ALL SERVER INTERACTION




    // ======================
    // DATA & DISPLAYS

    let messageLog: string[] = []; // past: messages
    let noteHistory: string[] = [];
    let transposeValue: number = 0;

    const messageLogDiv = document.getElementById("status-div")!; // past: statusDiv
    const visualGuideDiv = document.getElementById("notes-div")!; // past: notesDiv
    
    // span displays
    const transposeValueDisplay = document.getElementById("transpose-value")!; // past: transposeValueBox
    const scaleValueDisplay1 = document.getElementById("scale-value")!; // past: scaleValueBox
    const scaleValueDisplay2 = document.getElementById("scale-value-2")!; // past: scaleValueBox2
    const octaveValueDisplay = document.getElementById("octave-value")!; // past: octaveValueBox
    const cumKeypressDisplay = document.getElementById("cum-keypress")!; // past: cumKeypressBox
    const cumTimeDisplay = document.getElementById("cum-time")!; // past: cumTimeBox
    const volumeValueDisplay = document.getElementById("volume-value")!; // past: volumeValueBox

    // ======================
    // BUTTONS

    // misc
    const clearStatusButton = document.getElementById("clear-status-button")!; 
    const clearNoteHistoryButton = document.getElementById("clear-note-history-button")!;
    const stopAudioWhenReleasedButton = document.getElementById("stop-audio-when-released-button")!;
    const shiftIndicator = document.getElementById("shift-indicator")!;
    const switchKeyboardButton = document.getElementById("switch-keyboard-button")!;

    // menu
    const navbar = document.getElementById("navbar")!;
    const menuTitle = document.getElementById("menu-title")!;
    const navContent = navbar.querySelectorAll("li > div")!;
    const acknowledgements = document.getElementById("acknowledgements")!;
    
    // water
    const waterLevelDisplay = document.getElementById("water-level-display")!; // past: waterLevelBox
    const waterRewardDisplay = document.getElementById("water-reward-display")!; // past: waterRewardBox
    const waterMask = document.getElementById("water-mask")!;

    // lights
    const lightSwitch = document.getElementById("light-switch")!;
    const staticBackground = document.getElementById("static-background")!;

    // recording
    const startRecordButton = document.getElementById('start-record-button')!;
    const stopRecordButton = document.getElementById('stop-record-button')!;
    const playRecordButton = document.getElementById('play-record-button')!;
    const saveRecordButton = document.getElementById('save-record-button')!;
    const stopPlaybackButton = document.getElementById("stop-playback-button")!;

    // visual guide
    const notesDivL = document.getElementById("notes-div-left")!;
    const notesDivR = document.getElementById("notes-div-right")!;

    // volume
    const volumeControl = document.getElementById("volume-control")!;

    // instruments & effects
    const instrumentSelection = document.getElementById("instrument-selection")!;
    const effectSelection = document.getElementById("effect-selection")!;
    const effectLevelControl = document.getElementById("effect-level-control")! as HTMLInputElement;

    // ======================
    // USER VALUES & FUNCTIONS

    let currentWaterLevel: number = parseInt(localStorage.getItem("savedWaterLevel") ?? '0') || 0;
    let totalWaterReward: number = parseInt(localStorage.getItem("totalWaterReward") ?? '0') || 0;
    let cumulativeKeypress: number = parseInt(localStorage.getItem("cumulativeKeypress") ?? '0') || 0;
    let cumulativeTime: number = parseInt(localStorage.getItem("cumulativeTime") ?? '100') || 100;
    let volume: number = parseInt(localStorage.getItem("savedVolume") ?? '100') || 100; 

    // note animations
    const activeKeyTimeouts = new Map();

    // water
    const maxWaterLevel: number = 500;

    // lights
    let currentLightsOn: boolean = true;

    // stopAudioWhenReleased
    let stopAudioWhenReleased: boolean = false;

    // recording
    let mediaRecorder: any;
    let audioChunks: any[] = [];
    let hasRecording: boolean = false;
    let isRecording: boolean = false;
    let audio: any;
    let audioUrl: any;

    // octave
    let lastPressedTransposeKey: string = "`"; // ` 1 2 3 4 5 6 7 8 9 0 - =
    let octave: number = 0;
    let octaveAdjustment: number = 0;

    // visual guide
    let realOctaveLeft: number = octave + 3;
    let realOctaveRight: number = realOctaveLeft + 1;

    // cumulative time
    let globalStartTime: number = Date.now();

    // volume
    const volumeNode = new Tone.Volume().toDestination();

    // instruments & effects
    let effectLevel: number = 50;
 
    // ===========================================
    // MAPS 

    type KeyboardModeType = Record<string,number>;
    
    // for +12
    const keyboardMode0: KeyboardModeType = {
        'q': 48, 'w': 50, 'e': 52, 'r': 53, 't': 55,
        'a': 57, 's': 59, 'd': 60, 'f': 62, 'g': 64,
        'z': 65, 'x': 67, 'c': 69, 'v': 71, 'b': 72,

        'y': 60, 'u': 62, 'i': 64, 'o': 65, 'p': 67,
        'h': 69, 'j': 71, 'k': 72, 'l': 74, ';': 76,
        'n': 77, 'm': 79, ',': 81, '.': 83, '/': 84,
    };

    // for +1
    const keyboardMode1: KeyboardModeType = {
        'q': 48, 'w': 50, 'e': 52, 'r': 53, 't': 55,
        'a': 57, 's': 59, 'd': 60, 'f': 62, 'g': 64,
        'z': 65, 'x': 67, 'c': 69, 'v': 71, 'b': 72,

        'y': 49, 'u': 51, 'i': 53, 'o': 54, 'p': 56,
        'h': 58, 'j': 60, 'k': 61, 'l': 63, ';': 65,
        'n': 66, 'm': 68, ',': 70, '.': 72, '/': 73,
    };

    // for -1
    const keyboardMode2: KeyboardModeType = {
        'q': 49, 'w': 51, 'e': 53, 'r': 54, 't': 56,
        'a': 58, 's': 60, 'd': 61, 'f': 63, 'g': 65,
        'z': 66, 'x': 68, 'c': 70, 'v': 72, 'b': 73,

        'y': 48, 'u': 50, 'i': 52, 'o': 53, 'p': 55,
        'h': 57, 'j': 59, 'k': 60, 'l': 62, ';': 64,
        'n': 65, 'm': 67, ',': 69, '.': 71, '/': 72,
    };

    let letterMap = keyboardMode0;
    // ^i will let it infer the type here. much to type


    // for keys pressed to initiate transposing
    type PitchMap = Record<string,number>
    const pitchMap: PitchMap = {
        '`': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, 
        '6': 6, '7': 7, '8': 8, '9': 9, '0':10, '-': 11, 
        '=': 12
    };

    type TransposeMap = Record<string, KeyType>
    const transposeMap: TransposeMap = {
        '0': "C", 
        '1': "C#",
        '2': "D", 
        '3': "D#",
        '4': "E", 
        '5': "F", 
        '6': "F#",
        '7': "G", 
        '8': "G#",
        '9': "A", 
        '10': "Bb",
        '11': "B", 
        '12': "C"
    };

    // ===========================================
    // VISUAL GUIDE

    type KeyType = keyof typeof mapNumbersToNotesOctaves;
    type PreserveKeys = Record<number,string>;

    const mapNumbersToNotesOctaves = {
        'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        'C#': ['C#', 'D#', 'F', 'F#', 'G#', 'Bb', 'C'],
        'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
        'D#': ['D#', 'F', 'G', 'G#', 'Bb', 'C', 'D'],
        'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
        'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
        'F#': ['F#', 'G#', 'Bb', 'B', 'C#', 'D#', 'F'],
        'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
        'G#': ['G#', 'Bb', 'C', 'C#', 'D#', 'F', 'G'],
        'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
        'Bb': ['Bb', 'C', 'D', 'D#', 'F', 'G', 'A'],
        'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'Bb']
    } as const;

    const preserveKeyIDLeft: PreserveKeys = {
        '0':'q', '1':'w', '2':'e', '3':'r', '4':'t', 
        '5':'a', '6':'s', '7':'d', '8':'f', '9':'g', 
        '10':'z', '11':'x', '12':'c', '13':'v', '14':'b'
    };

    const preserveKeyIDRight: PreserveKeys = {
        '0':'y', '1':'u', '2':'i', '3':'o', '4':'p',
        '5':'h', '6':'j', '7':'k', '8':'l', '9':';',
        '10':'n', '11':'m', '12':',', '13':'.', '14':'/'
    };

    const mapNumbersToNotesMapping = [
        [1, 2, 3, 4, 5],
        [6, 7, 1, 2, 3],
        [4, 5, 6, 7, 8]
    ];

    const transposeList: string[] = [
      "C", 
      "C#",
      "D", 
      "D#",
      "E", 
      "F", 
      "F#",
      "G", 
      "G#",
      "A", 
      "Bb",
      "B"
  ];

    // ===========================================
    // LIST: INSTRUMENTS & EFFECTS

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

    // ===========================================
    // LOGGING: STATUS DIV

    function updateStatusMsg(message:string) {
        const now: Date = new Date(Date.now());
        const formattedTime: string = now.toLocaleString();
        messageLog.push(`${message} | Time: ${formattedTime}`);
        if (messageLog.length > 50) {
            messageLog.shift();
        } 
        const status: string = messageLog.join('<br>');
        messageLogDiv.innerHTML = status;
        messageLogDiv.scrollTop = messageLogDiv.scrollHeight;
    }

    // ===========================================
    // CLEARING STATUS DIV
    
    clearStatusButton.addEventListener("pointerdown", () => {
        // clears status div
        messageLog = [];
        messageLogDiv.innerHTML = "";
    })

    // ===========================================
    // LOGGING: NOTE PLAYING HISTORY

    function updateNoteHistory(note:number) {
        noteHistory.push(`${midiToSPN(note)} | ${cumulativeKeypress+1}`);
        if (noteHistory.length > 20) {
            noteHistory.shift();
        } 
        const noteHistoryContent: string = noteHistory.join('<br>');
        visualGuideDiv.innerHTML = noteHistoryContent;
        visualGuideDiv.scrollTop = visualGuideDiv.scrollHeight;
    }

    function midiToSPN(midiNumber:number) {
        const noteNames: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
        const noteIndex: number = midiNumber % 12;
        const octave: number = Math.floor((midiNumber) / 12) - 1;
        return noteNames[noteIndex] + octave;
    }

    // ===========================================
    // CLEARING NOTE HISTORY
    
    clearNoteHistoryButton.addEventListener("pointerdown", () => {
        // clears note history
        noteHistory = [];
        visualGuideDiv.innerHTML = "";
    })

    // ===========================================
    // VOLUME CONTROL

    volumeValueDisplay.textContent = `${volume}%`;

    volumeControl.addEventListener("input", (e:any) => {
        volume = e.target.value;
        localStorage.setItem("savedVolume", volume.toString()); // stored in localStorage
        volumeValueDisplay.textContent = `${volume}%`; // display
        volumeNode.volume.value = Tone.gainToDb(volume/100); // % to db
        // console.log(`volume in db: ${volumeNode.volume.value}`); // debug
    }); 

    // ===========================================
    // SELECTION: INSTRUMENTS & EFFECTS

    // dynamically update select elements: instruments
    for (var i = 0; i < instrumentNames.length; i++) {
        instrumentSelection.appendChild(
            Object.assign(
                document.createElement("option"),
                { value: i, innerHTML: instrumentNames[i] }
            )
        );
    }

    // dynamically update select elements: effects
    for (var i = 0; i < effectNodes.length; i++) {
        effectSelection.appendChild(
            Object.assign(
                document.createElement("option"),
                { value: i, innerHTML: effectNodes[i] != null ? effectNodes[i].name : "None" }
            )
        )
    }

    // default: synth & no effect
    let currentInstrument = instruments[0];
    let currentEffectNode = effectNodes[0];

    // changing EFFECTS
    effectSelection.addEventListener('input', (e:any) => {
        const selectedID = parseInt(e.target.value); 
        getEffectLevelInput(effectNodes[selectedID]); 
        // ^^read from slider BEFORE setting new effect. this ensures we are setting things for the correct node

        let newEffectNode = effectNodes[selectedID]; // set new effect 

        // rewiring to include new effect node
        currentInstrument.disconnect();
        if (currentEffectNode) { // if existing effect is connected, unwire
            currentEffectNode.disconnect(volumeNode);
        }
        currentEffectNode = newEffectNode; 
        if (currentEffectNode) { // rewire to new effect
            currentInstrument.connect(currentEffectNode); // rewire only for
            currentEffectNode.connect(volumeNode);
        } else {
            currentInstrument.connect(volumeNode);
        }
    });

    // update again to realise new connection
    effectSelection.dispatchEvent(new Event('input'));

    // changing INSTRUMENTS
    instrumentSelection.addEventListener("input", (e:any) => {
        // the actual changing
        currentInstrument = instruments[e.target.value]; 
        // rewiring
        currentInstrument.disconnect();
        if (currentEffectNode) currentInstrument.connect(currentEffectNode);
        else currentInstrument.connect(volumeNode);
        if (currentInstrument instanceof Tone.Sampler && e.target.value != 1 && e.target.value != 12 && e.target.value != 14) {
            // IF SAMPLER && NOT E-GUITAR && NOT OTTO-SYNTH && NOT VIOLIN
            toggleStopAudioWhenReleased(false); 
        } 
        else {
            toggleStopAudioWhenReleased(true);
        } 
    });

    stopAudioWhenReleasedButton.addEventListener("pointerdown", ()=>{
        toggleStopAudioWhenReleased();
    })

    effectLevelControl.addEventListener("input", () => {effectSelection.dispatchEvent(new Event('input'))});

    // update
    instrumentSelection.dispatchEvent(new Event('input'));

    // read from slider
    function getEffectLevelInput(node:any) {
        if (node == null || node.name == "Freeverb") {
            console.log("No effect.");
            effectLevelControl.style.display = "none";
            return;
        }

        effectLevel = parseInt(effectLevelControl.value);

        effectLevelControl.style.display = "inline-block";
        console.log(node.name);
        switch (node.name) {
            case "Distortion":
                effectNodes[1].distortion = effectLevel / 100;
                // sounds better around mid range
                break;
            case "AutoWah":
                effectNodes[2].sensitivity = effectLevel / 100 * 60 - 60;
                // effect more apparent at higher values
                break;
            case "BitCrusher":
                effectNodes[3].bits = effectLevel / 100 * 15 + 1;
                // sounds better at higher values
                break;
            // case "Freeverb":
            //     effectNodes[4].roomSize = effectLevel / 100;
            //     // sounds better for me at lower values
            //     break;
        }
    }
    

    // ===========================================
    // HANDLING KEYPRESSES

    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values

    // grabs set of KEYS PRESSED
    const pressedKeys = new Set();

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // detects for SHIFT pressed & released
    let shiftPressed = false;
    document.addEventListener('keydown', function(e) {
        if (e.shiftKey) {
            shiftPressed = true;
            shiftIndicator.style.backgroundColor = "#588157";
        }
    });
    document.addEventListener('keyup', function(e) {
        if (e.key === 'Shift') {
            shiftPressed = false;
            shiftIndicator.style.backgroundColor = "";
        }
    });
    
    // when any key is pressed
    function handleKeyDown(e:any) {
        const keyPressTime: number = performance.now(); // for latency
        const key: string = e.key.toLowerCase();
        // allow 'r' and 'Shift' to bypass preventDefault
        if (key != 'r' && key != 'shift') {
            e.preventDefault(); 
            // to stop other action e.g. shortcuts & spacebar scrolling from happening
            // r is let through to reload
        } 
        // note / transpose logic (works for all keys)
        if (key in letterMap && !pressedKeys.has(key)) { 
            incrementWater();
            // key in noteplaying map: play MIDI note
            pressedKeys.add(key);
            let midiNote: number = letterMap[key] + transposeValue + octaveAdjustment;
            if (shiftPressed) {midiNote += 1;}
            updateNoteHistory(midiNote);
            // calculating latency 
            const audioStartTime: number = performance.now();
            const latency: number = audioStartTime - keyPressTime;
            console.log(`Latency: ${latency} ms`); 
            currentInstrument.triggerAttack(Tone.Frequency(midiNote, "midi"),Tone.context.currentTime);
            applyVisualGuideStyleChange(document.getElementById(key) as HTMLElement);

            incrementCumKeypress();
        } else if (key in pitchMap && !pressedKeys.has(key)) {
            // detecting for transposing. number keys
            lastPressedTransposeKey = key;
            transposeValue = pitchMap[key]; // in semitones
            transposeValueDisplay.innerHTML = pitchMap[key].toString(); // returns semitone count
            scaleValueDisplay1.innerHTML = transposeMap[pitchMap[key]]; // returns scale ("C", "D", etc)
            scaleValueDisplay2.innerHTML = transposeMap[pitchMap[key]]; // returns the same scale for better visualisation
            updateVisualGuide(key);
            updateStatusMsg(`transpose value updated to: ${pitchMap[key]}`);
        } else if (e.key == 'CapsLock') {
            toggleStopAudioWhenReleased();
        } else if (key == ' ') {
            toggleLights();
        } else if (key == 'escape') { 
            toggleMenu(); 
        } else if (key == 'backspace') {toggleKeyboardMode()}
        // detect arrow key: octave change
        switch(e.key) {
            case 'ArrowLeft':
                octaveDown();
                break;
            case 'ArrowDown':
                octaveDown();
                break;
            case 'ArrowRight':
                octaveUp();
                break;
            case 'ArrowUp':
                octaveUp();
                break;
        }         
    }
    
    function handleKeyUp(e:any) {
        shiftPressed = e.shiftKey;
        const key: string = e.key.toLowerCase();
        if (key in letterMap) {
            removeVisualGuideStyleChange(document.getElementById(key) as HTMLElement);
            pressedKeys.delete(key);
            let midiNote = letterMap[key] + transposeValue + octaveAdjustment;
            if (stopAudioWhenReleased == false) return; // IF SAMPLER && NOT E-GUITAR && NOT OTTO-SYNTH
            else;
            currentInstrument.triggerRelease(Tone.Frequency(midiNote, "midi"));
            currentInstrument.triggerRelease(Tone.Frequency(midiNote-1, "midi"));
        }
    }

    // ===========================================
    // APPLYING STYLE CHANGES TO DIV ON PRESS

    function applyVisualGuideStyleChange(key:HTMLElement) {
        // cancel pending removal
        if (activeKeyTimeouts.has(key)) {
            clearTimeout(activeKeyTimeouts.get(key));
            activeKeyTimeouts.delete(key);
        }
        
        key.classList.add(stopAudioWhenReleased ? 'key-active-instant' : 'key-active');
        void key.offsetWidth; // force reflow
      }

      
    function removeVisualGuideStyleChange(key:HTMLElement) {
        key.classList.remove('key-active-instant');
        
        if (stopAudioWhenReleased) {
            key.classList.remove('key-active');
        } else {
            const timeoutId = setTimeout(() => {
                key.classList.remove('key-active');
                activeKeyTimeouts.delete(key);
            }, 100); // 100ms because duration-100
            activeKeyTimeouts.set(key, timeoutId);
        }
        void key.offsetWidth; // force reflow
      }

    // ===========================================
    // MENU TOGGLE

    function toggleMenu() {
        navbar.classList.toggle("w-[400px]");
        navbar.classList.toggle("hover:w-[400px]");
        menuTitle.classList.toggle("hidden");
        menuTitle.classList.toggle("group-hover:block");
        navContent.forEach(div => {
            div.classList.toggle("hidden");
            div.classList.toggle("group-hover:block");
        });
        acknowledgements.classList.toggle("hidden");
        acknowledgements.classList.toggle("group-hover:block");
    }

    // ===========================================
    // WATER COLLECTION

    waterLevelDisplay.textContent = `${currentWaterLevel} / ${maxWaterLevel}`;
    waterRewardDisplay.textContent = totalWaterReward.toString();
    updateWaterMaskPosition();

    function triggerWaterReward() {
        totalWaterReward = parseInt(localStorage.getItem("totalWaterReward") ?? '0');
        updateStatusMsg("Triggered water reward!");
        totalWaterReward++;
        localStorage.setItem("totalWaterReward", totalWaterReward.toString());
        waterRewardDisplay.textContent = totalWaterReward.toString();
        // alert("Water reward! wooooo");
    }
    
    function incrementWater() {
        currentWaterLevel = parseInt(localStorage.getItem("savedWaterLevel") ?? '0');
        currentWaterLevel++;
        
        if (currentWaterLevel >= maxWaterLevel) {
            triggerWaterReward();
            currentWaterLevel = 0;
        }
        
        localStorage.setItem("savedWaterLevel", currentWaterLevel.toString());
        waterLevelDisplay.textContent = `${currentWaterLevel} / ${maxWaterLevel}`;
        updateWaterMaskPosition();
    }
    
    function updateWaterMaskPosition() {
        // calculate percentage from top (0% = full, 100% = empty)
        const topPercentage = (1 - currentWaterLevel / maxWaterLevel) * 100;
        waterMask.style.top = `${topPercentage.toFixed(2)}%`;
    }

    // ===========================================
    // LIGHTS

    lightSwitch.addEventListener("pointerdown", () => toggleLights);

    function toggleLights() {
        if (currentLightsOn) {
            currentLightsOn = false;
            staticBackground.classList.replace("brightness-110", "brightness-0");
            lightSwitch.style.backgroundColor = "#F08080";
            waterMask.style.display = "none";
            updateStatusMsg("Lights out!");
            toggleVGWhiteBg();
        }
        else {
            currentLightsOn = true;
            staticBackground.classList.replace("brightness-0", "brightness-110");
            lightSwitch.style.backgroundColor = "#588157";
            waterMask.style.display = "block";
            updateStatusMsg("Lights back on!");
            toggleVGWhiteBg();
        }
    }

    function toggleVGWhiteBg() {
        let visualGuideChildrenL = document.getElementById("notes-div-left")!.children;
        let visualGuideChildrenR = document.getElementById("notes-div-right")!.children;
        shiftIndicator.classList.toggle("bg-white/80");
        for (let i=0; i<visualGuideChildrenL.length; i++) {
            visualGuideChildrenL[i].classList.toggle("bg-white/80");
        }
        for (let i=0; i<visualGuideChildrenR.length; i++) {
            visualGuideChildrenR[i].classList.toggle("bg-white/80");
        }
    }


    // ===========================================
    // SWITCH KEYBOARDS
    
    let currentKeyboardMode = 0
    // 0: +12 (default)
    // 1: +1 (accidentals)

    switchKeyboardButton.addEventListener('pointerdown', toggleKeyboardMode);

    function toggleKeyboardMode() {
        if (currentKeyboardMode === 0) {
            // current +12, toggle to +1
            currentKeyboardMode = 1;
            letterMap = keyboardMode1;
            switchKeyboardButton.textContent = "+1";
            updateVisualGuide(lastPressedTransposeKey);
        } else if (currentKeyboardMode === 1) {
            // current +1, toggle to -1
            currentKeyboardMode = 2;
            letterMap = keyboardMode2;
            switchKeyboardButton.textContent = "-1";
            updateVisualGuide(lastPressedTransposeKey);
        } else {
          // current -1, toggle to +12
          currentKeyboardMode = 0;
          letterMap = keyboardMode0;
          switchKeyboardButton.textContent = "+12";
          updateVisualGuide(lastPressedTransposeKey);
        }
        console.log(`keyboard mode changed. current mode: ${currentKeyboardMode}`);
    }

    // ===========================================
    // RECORDING
    startRecordButton.addEventListener('pointerdown', startRecording);
    stopRecordButton.addEventListener('pointerdown', stopRecording);
    playRecordButton.addEventListener('pointerdown', playRecording);
    saveRecordButton.addEventListener('pointerdown', saveRecording);
    stopPlaybackButton.addEventListener('pointerdown', stopPlayback);

    function startRecording() {
        if (mediaRecorder?.state === 'recording') {
            mediaRecorder.stop();
        }
        hasRecording = false;
        isRecording = true;
        startRecordButton.style.backgroundColor = "#F08080";
        audioChunks = [];
        const audioStream = Tone.context.createMediaStreamDestination();
        volumeNode.connect(audioStream);
        
        mediaRecorder = new MediaRecorder(audioStream.stream);
        mediaRecorder.ondataavailable = (e:any) => {
            audioChunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            audioUrl = URL.createObjectURL(audioBlob);
            audio = new Audio(audioUrl);
            hasRecording = true;
            isRecording = false;
            updateStatusMsg("Recording stopped!");
            startRecordButton.style.backgroundColor = "";
        };
        mediaRecorder.start();
        updateStatusMsg("Recording started...");
    }

    function stopRecording() {
        mediaRecorder.stop();
    }
    
    function playRecording() {
        if (hasRecording && audio) {
            audio.onended = () => {
                updateStatusMsg("Recording playback finished.");
            }
            audio.play();
            updateStatusMsg("Playing recording...");
        } else if (isRecording) {
            updateStatusMsg("There is a recording in progress! Cannot play!");
        } else {
            updateStatusMsg("No stored recording.");
        }
    }

    function stopPlayback() {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            updateStatusMsg("Playback stopped.");
        }
    }

    function saveRecording() {
        updateStatusMsg("Saving recording...");
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = `recording-${Date.now()}.wav`;
        link.click();
    }

    // ===========================================
    // OCTAVE CHANGE

    function octaveUp(target:number | null = null) {
        if (target == null) {
            if (octave >= 3) {
                updateStatusMsg("Already at maximum octave!");
                return;
            }
            octave++;
            octaveAdjustment += 12;
            octaveValueDisplay.innerHTML = octave.toString();
            updateStatusMsg(`Octave shift updated to: ${octave}`);
            updateVisualGuide(lastPressedTransposeKey);
        }
    }

    function octaveDown(target:number | null = null) {
        if (target == null) {
            if (octave <= -2) {
                updateStatusMsg("Already at minimum octave!");  
                return;
            }
            octave--;
            octaveAdjustment -= 12;
            octaveValueDisplay.innerHTML = octave.toString(); 
            updateStatusMsg(`Octave shift updated to: ${octave}`);
            updateVisualGuide(lastPressedTransposeKey); 
        }
    }

    // ===========================================
    // VISUAL GUIDE


    function createNoteDiv(id: string, note: string, octave: number) {
        return `<div id="${id}" class="flex flex-col items-center justify-center p-2 rounded-4xl border-3 text-center h-30 w-30 relative bg-white/80">
                    <div>
                        ${note}<sub class="text-lg">${octave}</sub>
                    </div>
                    <span class="text-2xl">${id.toUpperCase()}</span>
                </div>`;
    }


    function mapNumbersToNotes(currentKey:KeyType, leftright:number) {    
      if (currentKeyboardMode === 0) {
        realOctaveLeft = octave + 3;
        if (lastPressedTransposeKey == '=') {
            realOctaveLeft++; // compensate for +12 transpose
        }
        realOctaveRight = realOctaveLeft + 1;
        const keyNotes: any = mapNumbersToNotesOctaves[currentKey];
        const octaveBase: number = leftright === 0 ? realOctaveLeft : realOctaveRight;
        const mappingFlattened: number[] = mapNumbersToNotesMapping.flat();
        let countC: number = 0;
        let keyIDcount = 0;
        const elements: string[] = mappingFlattened.map(num => {
            keyIDcount++;
            const isC: boolean = (num - 1) % 7 === 0;
            if (isC) countC++;
            const noteIndex: number = (num - 1) % 7;
            const note: any = keyNotes[noteIndex];
            const currentOctave: number = octaveBase + (countC - 1);
            if (leftright == 0) {
                return createNoteDiv(preserveKeyIDLeft[keyIDcount-1],note,currentOctave);
            } else {
                return createNoteDiv(preserveKeyIDLeft[keyIDcount-1],note,currentOctave);
            }
        });
        // console.log(elements);
        return elements.join('');
      } else if (currentKeyboardMode === 1) {
          // +1
          realOctaveLeft = octave + 3;
          if (lastPressedTransposeKey == '=') {
            realOctaveLeft++; // compensate for +12 transpose
        }
          realOctaveRight = realOctaveLeft;
          const keyNotesL = mapNumbersToNotesOctaves[currentKey];
          const keyNotesR = mapNumbersToNotesOctaves[transposeList[transposeValue+1] as KeyType];
          // ^somewhat patchwork solution to get for one semitone up but it works
          const octaveBase = leftright === 0 ? realOctaveLeft : realOctaveRight;
          const mappingFlattened = mapNumbersToNotesMapping.flat();
          let countC = 0;
          let keyIDcount = 0;
          const elements = mappingFlattened.map(num => {
              keyIDcount++;
              const isC = (num - 1) % 7 === 0;
              if (isC) countC++;
              const noteIndex = (num - 1) % 7;
              const note = leftright === 0 ? keyNotesL[noteIndex] : keyNotesR[noteIndex];
              const currentOctave = octaveBase + (countC - 1);
              if (leftright == 0) {
                return `<div id="${preserveKeyIDLeft[keyIDcount-1]}" class="flex flex-col items-center justify-center p-2 rounded-4xl border-3 text-center h-30 w-30 relative bg-white/80">
                    <div>
                    ${note}<sub class="text-lg">${currentOctave}</sub>
                    </div>
                    <span class="text-2xl">${preserveKeyIDLeft[keyIDcount-1].toUpperCase()}</span>
                </div>`;
            } else {
                return `<div id="${preserveKeyIDRight[keyIDcount-1]}" class="flex flex-col items-center justify-center p-2 rounded-4xl border-3 text-center h-30 w-30 relative bg-white/80">
                <div>
                    ${note}<sub class="text-lg">${currentOctave}</sub>
                </div>
                <span class="text-2xl">${preserveKeyIDRight[keyIDcount-1].toUpperCase()}</span>
                </div>`;
              }
          });
          // console.log(elements);
          return elements.join('');
      } else {
        // -1
        realOctaveRight = octave + 3;
        if (lastPressedTransposeKey == '=') {
            realOctaveRight++; // compensate for +12 transpose
        }
        realOctaveLeft = realOctaveRight;
        const keyNotesR = mapNumbersToNotesOctaves[currentKey];
        const keyNotesL = mapNumbersToNotesOctaves[transposeList[transposeValue+1] as KeyType];
        // ^somewhat patchwork solution to get for one semitone up but it works
        const octaveBase = leftright === 0 ? realOctaveLeft : realOctaveRight;
        const mappingFlattened = mapNumbersToNotesMapping.flat();
        let countC = 0;
        let keyIDcount = 0;
        const elements = mappingFlattened.map(num => {
            keyIDcount++;
            const isC = (num - 1) % 7 === 0;
            if (isC) countC++;
            const noteIndex = (num - 1) % 7;
            const note = leftright === 0 ? keyNotesL[noteIndex] : keyNotesR[noteIndex];
            const currentOctave = octaveBase + (countC - 1);
            if (leftright == 0) {
              return `<div id="${preserveKeyIDLeft[keyIDcount-1]}" class="flex flex-col items-center justify-center p-2 rounded-4xl border-3 text-center h-30 w-30 relative bg-white/80">
                  <div>
                  ${note}<sub class="text-lg">${currentOctave}</sub>
                  </div>
                  <span class="text-2xl">${preserveKeyIDLeft[keyIDcount-1].toUpperCase()}</span>
              </div>`;
          } else {
              return `<div id="${preserveKeyIDRight[keyIDcount-1]}" class="flex flex-col items-center justify-center p-2 rounded-4xl border-3 text-center h-30 w-30 relative bg-white/80">
              <div>
                  ${note}<sub class="text-lg">${currentOctave}</sub>
              </div>
              <span class="text-2xl">${preserveKeyIDRight[keyIDcount-1].toUpperCase()}</span>
              </div>`;
            }
        });
        // console.log(elements);
        return elements.join('');
      }
        
    }

    function updateVisualGuide(key: string) {
        notesDivL.innerHTML = mapNumbersToNotes(transposeMap[pitchMap[key]], 0);
        notesDivR.innerHTML = mapNumbersToNotes(transposeMap[pitchMap[key]], 1);
        if (!currentLightsOn) {
            toggleVGWhiteBg();
            if (shiftIndicator.classList.contains("bg-white/80")) {
                shiftIndicator.classList.toggle("bg-white/80");
            }
        }
    }

    // ===========================================
    // STOP AUDIO WHEN RELEASED

    function toggleStopAudioWhenReleased(manualState: boolean | null = null) {
        if (manualState !== null) {
            stopAudioWhenReleased = manualState;
        } else {
            stopAudioWhenReleased = !stopAudioWhenReleased;
        }
        stopAudioWhenReleasedButton.style.backgroundColor = stopAudioWhenReleased ? "#588157" : "#F08080";
        stopAudioWhenReleasedButton.textContent = stopAudioWhenReleased ? "Instant Release" : "Smooth Release";
      
        // clear pending animations when changing modes
        activeKeyTimeouts.forEach((timeout, key) => {
            clearTimeout(timeout);
            key.classList.remove('key-active');
            activeKeyTimeouts.delete(key);
        });
      }

    // ===========================================
    // CUMULATIVE NOTES PLAYED

    cumKeypressDisplay.textContent = cumulativeKeypress.toString();
    function incrementCumKeypress() { // logs each time a key is pressed
        cumulativeKeypress = parseInt(localStorage.getItem("cumulativeKeypress") ?? '0');
        cumulativeKeypress++; 
        cumKeypressDisplay.textContent = cumulativeKeypress.toString();
        localStorage.setItem("cumulativeKeypress", cumulativeKeypress.toString());
    }

    // ===========================================
    // CUMULATIVE TIME SPENT

    cumTimeDisplay.textContent = formatTime(cumulativeTime);

    function formatTime(seconds:number) {
        const hours: number = Math.floor(seconds / 3600);
        const minutes: number = Math.floor((seconds % 3600) / 60);
        const secs: number = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // start timer
    const interval = setInterval(() => {
        const currentTime: number = Date.now();
        const elapsedTime: number = Math.floor((currentTime - globalStartTime) / 1000); // to seconds
        cumulativeTime += elapsedTime;
        globalStartTime = currentTime; 
        cumTimeDisplay.textContent = formatTime(cumulativeTime);
        localStorage.setItem("cumulativeTime", cumulativeTime.toString());
    }, 1000); // updates every second

    // on page exit
    window.addEventListener("beforeunload", () => {
        clearInterval(interval); // stop timer
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - globalStartTime) / 1000); // to seconds
        cumulativeTime += elapsedTime;
        localStorage.setItem("cumulativeTime", cumulativeTime.toString());
    });












})





