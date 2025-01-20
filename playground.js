document.addEventListener("DOMContentLoaded", (e) => {

    let messages = [];
    const statusDiv = document.getElementById("status-div");
    const transposeValueBox = document.getElementById("transpose-value");
    const scaleValueBox = document.getElementById("scale-value");
    const scaleValueBox2 = document.getElementById("scale-value-2")
    const clearButton = document.getElementById("clear-button");
    const layoutValueBox = document.getElementById("layout-value");
    const notesDiv = document.getElementById("notes-div")

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

    function mapNumbersToNotes(currentKey) {
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
    
        const keyNotes = notes[currentKey];

        return mapping.flatMap(row => 
            row.map(num => `<div class="flex items-center justify-center p-2">${keyNotes[(num - 1) % 7]}</div>`)
        ).join('');
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
            scaleValueBox2.innerHTML = transposeMap[pitchMap[key]];
            updateStatusMsg("transpose value updated to: " + pitchMap[key]);
            // console.log("key: " + key);


            const currentKey = transposeMap[pitchMap[key]]
            notesDiv.innerHTML = mapNumbersToNotes(currentKey);
            
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
        updateStatusMsg("current: single keyboard (low)");
        layoutValueBox.innerHTML = "single (low)"
        
    })

    sgToggle2.addEventListener("click", (e) => {
        // update lettermap to single keyboard 2
        letterMap = sgLetterMap2;
        updateStatusMsg("current: single keyboard (high)");
        layoutValueBox.innerHTML = "single (high)" 
        
    })

    dbToggle.addEventListener("click", (e) => {
        // update lettermap to double keyboard
        letterMap = dbLetterMap;
        updateStatusMsg("current: doublekeyboard");
        layoutValueBox.innerHTML = "double (default)"        
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
        messages.push(message + " | Time: " + formattedTime);
        const status = messages.join('<br>');
        statusDiv.innerHTML = status;
    }
});