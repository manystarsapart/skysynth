// const { freemem } = require("os");


document.addEventListener("DOMContentLoaded", () => {

    // getting from DOM & assigning variables
    let messages = [];
    let transposeValue = 0;
    const statusDiv = document.getElementById("status-div");
    const transposeValueBox = document.getElementById("transpose-value");
    const scaleValueBox = document.getElementById("scale-value");
    const scaleValueBox2 = document.getElementById("scale-value-2");
    const octaveValueBox = document.getElementById("octave-value");
    const clearButton = document.getElementById("clear-button");
    const layoutValueBox = document.getElementById("layout-value");

    // ===========================================
    // RECORDING FUNCTIONALITY

    let mediaRecorder;
    let audioChunks = [];
    let hasRecording = false;
    let isRecording = false;
    let audio;
    let audioUrl;
    
    const startRecordButton = document.getElementById('start-record-button');
    const stopRecordButton = document.getElementById('stop-record-button');
    const playRecordButton = document.getElementById('play-record-button');
    const saveRecordButton = document.getElementById('save-record-button');
    const stopPlaybackButton = document.getElementById("stop-playback-button");
    // const clearRecordButton = document.getElementById('clear-record-button');
    
    startRecordButton.addEventListener('click', startRecording);
    stopRecordButton.addEventListener('click', stopRecording);
    playRecordButton.addEventListener('click', playRecording);
    saveRecordButton.addEventListener('click', saveRecording);
    stopPlaybackButton.addEventListener('click', stopPlayback)
    // clearRecordButton.addEventListener('click', clearRecording);
    
    function startRecording() {
        if (isRecording) {
            updateStatusMsg("Recording already in progress!");
            return;
        }
        hasRecording = false;
        isRecording = true;
        startRecordButton.style.backgroundColor = "red";
        audioChunks = [];
        const audioStream = Tone.context.createMediaStreamDestination();
        volumeNode.connect(audioStream);
        
        mediaRecorder = new MediaRecorder(audioStream.stream);
        mediaRecorder.ondataavailable = (e) => {
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
            // TODO: something is wrong here. i forgot what i was going to fix
            // i will come back to fixing this later
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

    // TODO: ADD STOP PLAYBACK BUTTON
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
        link.download = 'recording.wav';
        link.click();
    }

    // function clearRecording() {
    //     // THIS IS BENCHED UNTIL FURTHER ACTION BECAUSE THE CLEAR BUTTON ALSO CLEARS EVERY AUDIO THING
    //     // I WILL FIX THIS SOON
    //     hasRecording = false;
    //     audioChunks = [];
    //     if (audio) {
    //         audio.pause();
    //         audio.src = '';
    //         audio.removeAttribute('src');
    //         audio = null;
    //     }
    //     if (audioUrl) {
    //         URL.revokeObjectURL(audioUrl);
    //         audioUrl = null;
    //     }
    //     updateStatusMsg("Recording cleared!");
    // }

    // ===========================================
    // MAPS FOR KEY --- MIDINOTE

    updateStatusMsg("Initialised!");
    
    // for double music pad
    const dbLetterMap = {
        'q': 48, 'w': 50, 'e': 52, 'r': 53, 't': 55,
        'a': 57, 's': 59, 'd': 60, 'f': 62, 'g': 64,
        'z': 65, 'x': 67, 'c': 69, 'v': 71, 'b': 72,
        'y': 60, 'u': 62, 'i': 64, 'o': 65, 'p': 67,
        'h': 69, 'j': 71, 'k': 72, 'l': 74, ';': 76,
        'n': 77, 'm': 79, ',': 81, '.': 83, '/': 84,
    };

    // for singular (low) music pad
    const sgLetterMap1 = {
        'q': 36, 'w': 38, 'e': 40, 'r': 41, 't': 43,
        'a': 45, 's': 47, 'd': 48, 'f': 50, 'g': 52,
        'z': 53, 'x': 55, 'c': 57, 'v': 59, 'b': 60,
    };

    // for singular (high) music pad
    const sgLetterMap2 = {
        'q': 60, 'w': 62, 'e': 64, 'r': 65, 't': 67,
        'a': 69, 's': 71, 'd': 72, 'f': 74, 'g': 76,
        'z': 77, 'x': 79, 'c': 81, 'v': 83, 'b': 84,
    };

    // for keys pressed to initiate transposing
    const pitchMap = {
        '`': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, 
        '6': 6, '7': 7, '8': 8, '9': 9, '0':10, '-': 11, 
        '=': 12
    };

    // shows exact scale of tranposed key
    // JUST FOR VISUAL GUIDE
    // note that this is separate because pitchMap values are the ones used in the midiNotes
    const transposeMap = {
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
    // OCTAVE CHANGE

    let lastPressedTransposeKey = "`";
    // ` 1 2 3 4 5 6 7 8 9 0 - =
    let octave = 0;
    let octaveAdjustment = 0;

    function octaveUp() {
        if (octave >= 2) {
            updateStatusMsg("Already at maximum octave!");
            return;
        }
        octave++;
        octaveAdjustment += 12;
        octaveValueBox.innerHTML = octave;
        updateStatusMsg(`Octave shift updated to: ${octave}`);
        updateVisualGuide(lastPressedTransposeKey);
    }

    function octaveDown() {
        if (octave <= -2) {
            updateStatusMsg("Already at maximum octave!");  
            return;
        }
        octave--;
        octaveAdjustment -= 12;
        octaveValueBox.innerHTML = octave; 
        updateStatusMsg(`Octave shift updated to: ${octave}`);
        updateVisualGuide(lastPressedTransposeKey); 
    }

    // ===========================================
    // FOR VISUAL GUIDE FOR NOTE NAMES

    const notesDivL = document.getElementById("notes-div-left");
    const notesDivR = document.getElementById("notes-div-right")

    let realOctaveLeft = octave + 3;
    let realOctaveRight = realOctaveLeft + 1;

    function mapNumbersToNotes(currentKey, leftright) {
        const notes = {
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
            'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
            'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'Bb']
        };
    
        const preserveKeyIDLeft = {
            '0':'q', '1':'w', '2':'e', '3':'r', '4':'t', 
            '5':'a', '6':'s', '7':'d', '8':'f', '9':'g', 
            '10':'z', '11':'x', '12':'c', '13':'v', '14':'b'
        };

        const preserveKeyIDRight = {
            '0':'y', '1':'u', '2':'i', '3':'o', '4':'p',
            '5':'h', '6':'j', '7':'k', '8':'l', '9':';',
            '10':'n', '11':'m', '12':',', '13':'.', '14':'/'
        };

        const mapping = [
            [1, 2, 3, 4, 5],
            [6, 7, 1, 2, 3],
            [4, 5, 6, 7, 8]
        ];
    
        realOctaveLeft = octave + 2;
        realOctaveRight = realOctaveLeft + 1;
        const keyNotes = notes[currentKey];
        const octaveBase = leftright === 0 ? realOctaveLeft : realOctaveRight;
        const mappingFlattened = mapping.flat();
        let countC = 0;
        let keyIDcount = 0;
        const elements = mappingFlattened.map(num => {
            keyIDcount++;
            const isC = (num - 1) % 7 === 0;
            if (isC) countC++;
            const noteIndex = (num - 1) % 7;
            const note = keyNotes[noteIndex];
            const currentOctave = octaveBase + (countC - 1);
            if (leftright == 0) {
                return `<div id="${preserveKeyIDLeft[keyIDcount-1]}" class="flex items-center justify-center p-2">${note}${currentOctave}</div>`;
            } else {
                return `<div id="${preserveKeyIDRight[keyIDcount-1]}" class="flex items-center justify-center p-2">${note}${currentOctave}</div>`;
            }
        });
        // console.log(elements);
        return elements.join('');
    }
    // ^^^ THIS FUNCTION WAS IMPROVED BY DEEPSEEK R1 TO HELP DISPLAY EACH OCTAVES NUMBER CORRECTLY
    // ALL HAIL OUR AI OVERLORDS

    function updateVisualGuide(key) {
        notesDivL.innerHTML = mapNumbersToNotes(transposeMap[pitchMap[key]], 0);
        notesDivR.innerHTML = mapNumbersToNotes(transposeMap[pitchMap[key]], 1);
    }

    // ===========================================
    // CUMULATIVE NOTES PLAYED

    const cumKeypressBox = document.getElementById("cum-keypress");
    let cumulativeKeypress = parseInt(localStorage.getItem("cumulativeKeypress")) || 0;
    cumKeypressBox.textContent = cumulativeKeypress;
    function incrementCumKeypress() { // logs each time a key is pressed
        cumulativeKeypress ++; 
        cumKeypressBox.textContent = cumulativeKeypress;
        localStorage.setItem("cumulativeKeypress", cumulativeKeypress.toString());
    }
    
    // ===========================================
    // CUMULATIVE TIME SPENT

    const cumTimeBox = document.getElementById("cum-time");
    let cumulativeTime = parseInt(localStorage.getItem("cumulativeTime")) || 0;
    cumTimeBox.textContent = formatTime(cumulativeTime);

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // start timer
    let startTime = Date.now();
    const interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000); // to seconds
        cumulativeTime += elapsedTime;
        startTime = currentTime; 
        cumTimeBox.textContent = formatTime(cumulativeTime);
        localStorage.setItem("cumulativeTime", cumulativeTime.toString());
    }, 1000); // updates every second

    // on page exit
    window.addEventListener("beforeunload", () => {
        clearInterval(interval); // stop timer
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000); // to seconds
        cumulativeTime += elapsedTime;
        localStorage.setItem("cumulativeTime", cumulativeTime.toString());
    });


    // ===========================================
    // VOLUME CONTROL

    const volumeNode = new Tone.Volume().toDestination();
    let volume = parseInt(localStorage.getItem("savedVolume")) || 0; 
    const volumeControl = document.getElementById("volume-control");
    const volumeValueBox = document.getElementById("volume-value");
    volumeValueBox.textContent = `${volume}%`;
    volumeControl.addEventListener("input", (e) => {
        volume = e.target.value;
        localStorage.setItem("savedVolume", volume.toString()); // stored in localStorage
        volumeValueBox.textContent = `${volume}%`; // display
        volumeNode.volume.value = Tone.gainToDb(volume/100); // % to db
        // console.log(`volume in db: ${volumeNode.volume.value}`); // debug
    }); 


    // ===========================================
    // CHOOSING INSTRUMENTS & EFFECTS
    
    const instrumentSelection = document.getElementById("instrument-selection");
    const effectSelection = document.getElementById("effect-selection");
    const effectLevelControl = document.getElementById("effect-level-control");
    let effectLevel = 50;
    
    let effectNodes = [
        null, // 0 no effect
        new Tone.Distortion(), // 1
        new Tone.AutoWah(),    // 2
        new Tone.BitCrusher(),  // 3
        new Tone.Freeverb(), // 4

    ];
    
    const instruments = [
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
 
        // todo: explore & add more
    ];

    const instrumentNames = [
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
    ]

    // dynamically update select elements
    for (var i = 0; i < instrumentNames.length; i++) {
        instrumentSelection.appendChild(
            Object.assign(
                document.createElement("option"),
                { value: i, innerHTML: instrumentNames[i] }
            )
        );
    }

    for (var i = 0; i < effectNodes.length; i++) {
        effectSelection.appendChild(
            Object.assign(
                document.createElement("option"),
                { value: i, innerHTML: effectNodes[i] != null ? effectNodes[i].name : "None" }
            )
        )
    }
  
    // effectNodes[4].dampening = 5000; // or 1000 if you want a rough sound

    // default: synth & no effect
    let currentInstrument = instruments[0];
    let currentEffectNode = effectNodes[0];
  
    // changing EFFECTS
    effectSelection.addEventListener("input", (e) => {
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
    instrumentSelection.addEventListener("input", (e) => {
        // the actual changing
        currentInstrument = instruments[e.target.value]; 
        // rewiring
        currentInstrument.disconnect();
        if (currentEffectNode) currentInstrument.connect(currentEffectNode);
        else currentInstrument.connect(volumeNode);
    });

    effectLevelControl.addEventListener("input", (e) => {effectSelection.dispatchEvent(new Event('input'))});

    // update
    instrumentSelection.dispatchEvent(new Event('input'));

    // read from slider
    function getEffectLevelInput(node) {
        if (node == null) {
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
            case "Freeverb":
                effectNodes[4].roomSize = effectLevel / 100;
                // sounds better for me at lower values
                break;
        }
    }

    // ===========================================
    // HANDLING KEYPRESSES

    // grabs set of KEYS PRESSED
    let letterMap = dbLetterMap;
    const pressedKeys = new Set();

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // detects for SHIFT pressed & released
    let shiftPressed = false;
    document.addEventListener('keydown', function(e) {
        if (e.shiftKey) {
            shiftPressed = true;
        }
    });
    document.addEventListener('keyup', function(e) {
        if (e.key === 'Shift') {
            shiftPressed = false;
        }
    });
    
    // when any key is pressed
    function handleKeyDown(e) {
        const keyPressTime = performance.now(); // for latency
        const key = e.key.toLowerCase();
        if (key != 'r' && key != 'Shift') {
            e.preventDefault(); 
            // to stop other action e.g. shortcuts & spacebar scrolling from happening
            // r is let through to reload
        }
        if (key in letterMap && !pressedKeys.has(key)) { 
            // key in noteplaying map: play MIDI note
            pressedKeys.add(key);
            let midiNote = letterMap[key] + transposeValue + octaveAdjustment;
            if (shiftPressed) {midiNote += 1;}
            
            // calculating latency 
            const audioStartTime = performance.now();
            const latency = audioStartTime - keyPressTime;
            console.log(`Latency: ${latency} ms`); 

            currentInstrument.triggerAttack(Tone.Frequency(midiNote, "midi"));
            document.getElementById(key).style.backgroundColor = "green"; // lights up key to green
            incrementCumKeypress();

        } else if (key in pitchMap && !pressedKeys.has(key)) {
            // detecting for transposing. number keys
            lastPressedTransposeKey = key;
            transposeValue = pitchMap[key]; // in semitones
            transposeValueBox.innerHTML = pitchMap[key]; // returns semitone count
            scaleValueBox.innerHTML = transposeMap[pitchMap[key]]; // returns scale ("C", "D", etc)
            scaleValueBox2.innerHTML = transposeMap[pitchMap[key]]; // returns the same scale for better visualisation
            updateVisualGuide(key);
            updateStatusMsg(`transpose value updated to: ${pitchMap[key]}`);
        }    
        // detect arrow key: octave change
        switch(e.key) {
            case 'ArrowLeft':
                octaveDown(pitchMap[key]);
                break;
            case 'ArrowDown':
                octaveDown(pitchMap[key]);
                break;
            case 'ArrowRight':
                octaveUp(pitchMap[key]);
                break;
            case 'ArrowUp':
                octaveUp(pitchMap[key]);
                break;
        }        
    }
    
    function handleKeyUp(e) {
        const key = e.key.toLowerCase();
        if (key in letterMap) {
            document.getElementById(key).style.backgroundColor = ""; 
            pressedKeys.delete(key);
            let midiNote = letterMap[key] + transposeValue + octaveAdjustment;
            if (currentInstrument.name == "Sampler" && instrumentSelection.value != 1) return; // IF SAMPLER && NOT E-GUITAR
            else;
            currentInstrument.triggerRelease(Tone.Frequency(midiNote, "midi"));
            currentInstrument.triggerRelease(Tone.Frequency(midiNote + 1, "midi")); 
            // failsafe for tone not stopping when:
            // 1. shift is held down
            // 2. note is pressed
            // 3. shift is released
        }
    }

    // ===========================================

    // buttons & toggles
    const sgToggle1 = document.getElementById("singlekeyboard1");
    const sgToggle2 = document.getElementById("singlekeyboard2");
    const dbToggle = document.getElementById("doublekeyboard");
    const resetButton = document.getElementById("reset-button");

    sgToggle1.addEventListener("click", (e) => {
        // update lettermap to single keyboard 1 (low)
        letterMap = sgLetterMap1;
        updateStatusMsg("current: single keyboard (low)");
        layoutValueBox.innerHTML = "single (low)"
    })

    sgToggle2.addEventListener("click", (e) => {
        // update lettermap to single keyboard 2 (high)
        letterMap = sgLetterMap2;
        updateStatusMsg("current: single keyboard (high)");
        layoutValueBox.innerHTML = "single (high)" 
    })

    dbToggle.addEventListener("click", (e) => {
        // update lettermap to double keyboard (default)
        letterMap = dbLetterMap;
        updateStatusMsg("current: doublekeyboard");
        layoutValueBox.innerHTML = "double (default)";        
    })

    clearButton.addEventListener("click", (e) => {
        // clears status div
        messages = [];
        statusDiv.innerHTML = "";
    })

    // ===========================================
    // log message into status div

    function updateStatusMsg(message) {
        const now = new Date(Date.now());
        const formattedTime = now.toLocaleString();
        messages.push(`${message} | Time: ${formattedTime}`);
        const status = messages.join('<br>');
        statusDiv.innerHTML = status;
        statusDiv.scrollTop = statusDiv.scrollHeight;
    }
});
