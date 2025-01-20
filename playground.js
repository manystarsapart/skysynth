document.addEventListener("DOMContentLoaded", (e) => {

    let messages = [];
    const statusDiv = document.getElementById("status-div");
    const transposeValueBox = document.getElementById("transpose-value");
    const scaleValueBox = document.getElementById("scale-value");
    const clearButton = document.getElementById("clear-button");
    updateStatusMsg("Initialised!");
    let transposeValue = 0;

    const dbLetterMap = {
        'q': 48, 'w': 50, 'e': 52, 'r': 53, 't': 55,
        'a': 57, 's': 59, 'd': 60, 'f': 62, 'g': 64,
        'z': 65, 'x': 67, 'c': 69, 'v': 71, 'b': 72,
        'y': 60, 'u': 62, 'i': 64, 'o': 65, 'p': 67,
        'h': 69, 'j': 71, 'k': 72, 'l': 74, ';': 76,
        'n': 77, 'm': 79, ',': 81, '.': 83, '/': 84,
    };

    const sgLetterMap1 = {
        'q': 36, 'w': 38, 'e': 40, 'r': 41, 't': 43,
        'a': 45, 's': 47, 'd': 48, 'f': 50, 'g': 52,
        'z': 53, 'x': 55, 'c': 57, 'v': 59, 'b': 60,
    };

    const sgLetterMap2 = {
        'q': 60, 'w': 62, 'e': 64, 'r': 65, 't': 67,
        'a': 69, 's': 71, 'd': 72, 'f': 74, 'g': 76,
        'z': 77, 'x': 79, 'c': 81, 'v': 83, 'b': 84,
    };

    const pitchMap = {
        '`': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, 
        '6': 6, '7': 7, '8': 8, '9': 9, '0':10, '-': 11, 
        '=': 12
    }

    const transposeMap = {
        '0': "C", '1': "C#",
        '2': "D", '3': "D#",
        '4': "E", 
        '5': "F", '6': "F#",
        '7': "G", '8': "G#",
        '9': "A", '10': "Bb",
        '11': "B", 
        '12': "C"
    }

    let letterMap = dbLetterMap;
    const pressedKeys = new Set();
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    function handleKeyDown(event) {
        const key = event.key.toLowerCase();
        if (key in letterMap && !pressedKeys.has(key)) {
            pressedKeys.add(key);
            synth.triggerAttack(Tone.Frequency(letterMap[key]+transposeValue, "midi"));
            // console.log("played: " + letterMap[key]+transposeValue); 
        } else if (key in pitchMap && !pressedKeys.has(key)) {
            transposeValue = pitchMap[key];
            transposeValueBox.innerHTML = pitchMap[key];
            scaleValueBox.innerHTML = transposeMap[pitchMap[key]];
            updateStatusMsg("transpose value updated to: " + pitchMap[key] + ". this means Q is playing " + pitchMap[key] + " semitones higher than C.");
            // console.log("key: " + key);
            
        }
    }
    
    function handleKeyUp(event) {
        const key = event.key.toLowerCase();
        if (key in letterMap) {
            pressedKeys.delete(key);
            synth.triggerRelease(Tone.Frequency(letterMap[key]+transposeValue, "midi"));
        }
    }

    document.addEventListener('click', async () => {
        await Tone.start();
    });


// buttons in html & their behaviour
    let sgToggle1 = document.getElementById("singlekeyboard1");
    let sgToggle2 = document.getElementById("singlekeyboard2");
    let dbToggle = document.getElementById("doublekeyboard");

    sgToggle1.addEventListener("click", (e) => {
        // update lettermap to single keyboard 1
        letterMap = sgLetterMap1;
        updateStatusMsg("current: single keyboard (lower)");
        
    })

    sgToggle2.addEventListener("click", (e) => {
        // update lettermap to single keyboard 2
        letterMap = sgLetterMap2;
        updateStatusMsg("current: single keyboard (higher)");
        
    })

    dbToggle.addEventListener("click", (e) => {
        // update lettermap to double keyboard
        letterMap = dbLetterMap;
        updateStatusMsg("current: doublekeyboard");
    })

    clearButton.addEventListener("click", (e) => {
        // clears status div
        messages = [];
        statusDiv.innerHTML = "";
    })

    // for logging
    function updateStatusMsg(message) {
        const now = new Date(Date.now());
        const formattedTime = now.toLocaleString();
        messages.push(message + " | Log time: " + formattedTime);
        const status = messages.join('<br>');
        statusDiv.innerHTML = status;
    }
});