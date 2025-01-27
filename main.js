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
    // const clearRecordButton = document.getElementById('clear-record-button');
    
    startRecordButton.addEventListener('click', startRecording);
    stopRecordButton.addEventListener('click', stopRecording);
    playRecordButton.addEventListener('click', playRecording);
    saveRecordButton.addEventListener('click', saveRecording);
    // clearRecordButton.addEventListener('click', clearRecording);
    
    function startRecording() {
        if (!isRecording) {
            hasRecording = false;
            isRecording = true;
            startRecordButton.style.backgroundColor = "red";
            audioChunks = [];
            const audioStream = Tone.context.createMediaStreamDestination();
            synth.connect(audioStream);
            
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
        } else {
            updateStatusMsg("Recording already in progress!");
        }
    }
    
    function stopRecording() {
        mediaRecorder.stop();
    }
    
    function playRecording() {
        if (hasRecording && audio) {
            audio.play();
            updateStatusMsg("Playing recording...");
        } else if (isRecording) {
            updateStatusMsg("There is a recording in progress! Cannot play!");
        } else {
            updateStatusMsg("No stored recording");
        }
    }

    // TODO: ADD STOP PLAYBACK BUTTON

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
        'n': 77, 'm': 79, ',': 81, '.': 83, ' ': 84,
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
        if (octave < 2) {
            octave++;
            octaveAdjustment += 12;
            updateStatusMsg(`Octave shift updated to: ${octave}`);
            octaveValueBox.innerHTML = octave;
        } else updateStatusMsg("Already at maximum octave!");
        updateVisualGuide(lastPressedTransposeKey);
    }

    function octaveDown() {
        if (octave > -2) {
            octave--;
            octaveAdjustment -= 12;
            updateStatusMsg(`Octave shift updated to: ${octave}`);
            octaveValueBox.innerHTML = octave;
        } else updateStatusMsg("Already at maximum octave!");   
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
        const elements = mappingFlattened.map(num => {
            const isC = (num - 1) % 7 === 0;
            if (isC) countC++;
            const noteIndex = (num - 1) % 7;
            const note = keyNotes[noteIndex];
            const currentOctave = octaveBase + (countC - 1);
            return `<div class="flex items-center justify-center p-2">${note}${currentOctave}</div>`;
        });
        return elements.join('');
    }
    // ^^^ THIS FUNCTION WAS IMPROVED BY DEEPSEEK R1 TO HELP DISPLAY EACH OCTAVES NUMBER CORRECTLY
    // ALL HAIL OUR AI OVERLORDS

    function updateVisualGuide(key) {
        notesDivL.innerHTML = mapNumbersToNotes(transposeMap[pitchMap[key]], 0);
        notesDivR.innerHTML = mapNumbersToNotes(transposeMap[pitchMap[key]], 1);
    }

    // ===========================================
    // VOLUME CONTROL

    const volumeNode = new Tone.Volume().toDestination();
    

    const volumeControl = document.getElementById("volume-control");
    const volumeValueBox = document.getElementById("volume-value");
    volumeControl.addEventListener("input", (e) => {
        const volume = e.target.value;
        volumeValueBox.textContent = `${volume}%`;
        volumeNode.volume.value = Tone.gainToDb(volume/100);
        console.log(`volume in db: ${volumeNode.volume.value}`);

    }); 

    // ===========================================
    // CUMULATIVE NOTES PLAYED

    const cumKeypressBox = document.getElementById("cum-keypress");
    let cumulativeKeypress = parseInt(localStorage.getItem("cumulativeKeypress")) || 0;
    cumKeypressBox.textContent = cumulativeKeypress;
    function incrementCumKeypress() {
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
    // HANDLING KEYPRESSES

    // grabs set of KEYS PRESSED
    let letterMap = dbLetterMap;
    const pressedKeys = new Set();
    const synth = new Tone.PolySynth(Tone.Synth).connect(volumeNode);

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
        const key = e.key.toLowerCase();
        e.preventDefault(); // to stop other action e.g. shortcuts & spacebar scrolling from happening
        if (key in letterMap && !pressedKeys.has(key)) { 
            
            // key in noteplaying map: play MIDI note
            pressedKeys.add(key);
            let midiNote = letterMap[key] + transposeValue + octaveAdjustment;
            if (shiftPressed) {midiNote += 1;}
            synth.triggerAttack(Tone.Frequency(midiNote, "midi"));
            incrementCumKeypress();
            // console.log(midiNote); // debug

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
            pressedKeys.delete(key);
            let midiNote = letterMap[key] + transposeValue + octaveAdjustment;
            synth.triggerRelease(Tone.Frequency(midiNote, "midi"));
            synth.triggerRelease(Tone.Frequency(midiNote + 1, "midi")); 
            // failsafe for tone not stopping when:
            // 1. shift is held down
            // 2. note is pressed
            // 3. shift is released
        }
    }

    // ===========================================
    // TODO: MAKE THE VISUAL GUIDE LIGHT UP WHEN CORRESPONDING KEY IS PRESSED
    // what i have already done: 
    // create ids for each of these divs that correspond to the key pressed
    









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