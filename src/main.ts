import * as Tone from 'tone';
import { updateStatusMsg, updateNoteHistory } from './logging.ts';
import { effectNodes, instruments, instrumentNames } from './instrueffect.ts';
import { keyboardMode0, keyboardMode1, keyboardMode2, pitchMap, transposeMap, leftKeyboardKeys, rightKeyboardKeys, mapNumbersToNotesOctaves, preserveKeyIDLeft, preserveKeyIDRight, mapNumbersToNotesMapping, transposeList } from './maps.ts';
import { } from './water.ts';

let volumeNode: Tone.Volume;

document.addEventListener("DOMContentLoaded", () => {

    // NOT IN THIS CODE: FIREBASE & ALL SERVER INTERACTION

    // ======================
    // DATA & DISPLAYS


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
    const stopAudioWhenReleasedButton = document.getElementById("stop-audio-when-released-button")!;
    const shiftIndicator = document.getElementById("shift-indicator")!;
    const leftAltIndicator = document.getElementById("l-alt-indicator")!;
    const rightAltIndicator = document.getElementById("r-alt-indicator")!;
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

    let letterMap = keyboardMode0;

    // note animations
    const activeKeyTimeouts = new Map();

    // menu
    let navbarExtended: boolean = false;

    // water
    const maxWaterLevel: number = 500;

    // lights
    let currentLightsOn: boolean = true;

    // stopAudioWhenReleased
    let stopAudioWhenReleased: boolean = false;

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
    volumeNode = new Tone.Volume().toDestination();



    // instruments & effects
    let effectLevel: number = 50;

    let transposeValue: number = 0;


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
    const pressedKeys: Set<string> = new Set();

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // detects for SHIFT pressed & released AND alt pressed & released
    let shiftPressed: boolean = false;
    let leftAltPressed: boolean = false;
    let rightAltPressed: boolean = false;

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Shift') {
            shiftPressed = true;
            shiftIndicator.style.backgroundColor = "#588157";
            const newTranspose = (pitchMap[lastPressedTransposeKey] + 1);
        
            // THE SHIFT-NON-LIGHTING-UP PROBLEM LIES IN THESE TWO LINES
            updateVisualGuideOnOneSide(transposeMap[newTranspose.toString() as KeyType], 0);
            updateVisualGuideOnOneSide(transposeMap[newTranspose.toString() as KeyType], 1);

            // if (!currentLightsOn) {
            //     // toggleVGWhiteBg();
            //     if (shiftIndicator.classList.contains("bg-white/80")) {
            //         shiftIndicator.classList.toggle("bg-white/80");
            //     }
            //     if (leftAltIndicator.classList.contains("bg-white/80")) {
            //         leftAltIndicator.classList.toggle("bg-white/80");
            //     }
            //     if (rightAltIndicator.classList.contains("bg-white/80")) {
            //         rightAltIndicator.classList.toggle("bg-white/80");
            //     }
            // }
        } 
        else if (e.key === 'Alt' && e.location === 1) {
            // left alt key
            e.preventDefault();
            leftAltPressed = true;
            leftAltIndicator.style.backgroundColor = "#588157";
            updateVisualGuideOnOneSide(transposeMap[pitchMap[lastPressedTransposeKey]+1],0);
        } 
        else if (e.key === 'Alt' && e.location === 2) {
            // right alt key
            e.preventDefault();
            rightAltPressed = true;
            rightAltIndicator.style.backgroundColor = "#588157";
            updateVisualGuideOnOneSide(transposeMap[pitchMap[lastPressedTransposeKey]+1],1);
        }
    });
    document.addEventListener('keyup', function(e) {
        if (e.key === 'Shift') {
            shiftPressed = false;
            shiftIndicator.style.backgroundColor = "";
            updateVisualGuideOnOneSide(transposeMap[pitchMap[lastPressedTransposeKey]],0);
            updateVisualGuideOnOneSide(transposeMap[pitchMap[lastPressedTransposeKey]],1);
        }
        else if (e.key === 'Alt' && leftAltPressed) {
            // left alt key
            leftAltPressed = false;
            leftAltIndicator.style.backgroundColor = "";
            updateVisualGuideOnOneSide(transposeMap[pitchMap[lastPressedTransposeKey]],0);
        } 
        else if (e.key === 'Alt' && rightAltPressed) {
            // right alt key
            rightAltPressed = false;
            rightAltIndicator.style.backgroundColor = "";
            updateVisualGuideOnOneSide(transposeMap[pitchMap[lastPressedTransposeKey]],1);
        }
    });
    
    // when any key is pressed
    function handleKeyDown(e:any) {
        const keyPressTime: number = performance.now(); // for latency
        const key: string = getBaseKey(e.key).toLowerCase(); // catches shifted notes but not symbols

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

            if (shiftPressed) {midiNote++;} 
            else if (leftKeyboardKeys.has(key)) {
                if (leftAltPressed) {midiNote++;}
            }
            else if (rightKeyboardKeys.has(key)) {
                if (rightAltPressed) {midiNote++;}
            }            

            updateNoteHistory(midiNote, cumulativeKeypress);
            // calculating latency 
            const audioStartTime: number = performance.now();
            const latency: number = audioStartTime - keyPressTime;
            console.log(`Latency: ${latency} ms`); 
            currentInstrument.triggerAttack(Tone.Frequency(midiNote, "midi"),Tone.getContext().currentTime);
            applyVisualGuideStyleChange(document.getElementById(key) as HTMLElement);

            incrementCumKeypress();
        } else if (key in pitchMap && !pressedKeys.has(key)) {
            // detecting for transposing. number keys
            lastPressedTransposeKey = key;
            transposeValue = pitchMap[key]; // in semitones
            transposeValueDisplay.innerHTML = pitchMap[key].toString(); // returns semitone count
            scaleValueDisplay1.innerHTML = transposeMap[pitchMap[key]].toString(); // returns scale ("C", "D", etc)
            scaleValueDisplay2.innerHTML = transposeMap[pitchMap[key]].toString(); // returns the same scale for better visualisation
            updateVisualGuide(key);
            console.log(`transpose pressed: ${key}`);
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
        const key: string = getBaseKey(e.key).toLowerCase();
        if (key in letterMap) {
            removeVisualGuideStyleChange(document.getElementById(key) as HTMLElement);
            pressedKeys.delete(key);
            let midiNote = letterMap[key] + transposeValue + octaveAdjustment;
            if (stopAudioWhenReleased == false) return; // IF SAMPLER && NOT E-GUITAR && NOT OTTO-SYNTH
            else;
            currentInstrument.triggerRelease(Tone.Frequency(midiNote, "midi"));
            currentInstrument.triggerRelease(Tone.Frequency(midiNote+1, "midi"));
        }
    }

    function getBaseKey(key: string): string { // unshifts shifted symbol key
        const shiftMap: Record<string, string> = {
            ':': ';',
            '<': ',',
            '>': '.',
            '?': '/',
        };
        return shiftMap[key] || key;
    }

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            disableSemitoneUp();
        }
      });

    window.addEventListener('focus',disableSemitoneUp);


    function disableSemitoneUp() { // only activated on visibility change
        
        if (shiftPressed) { // catch shift being held when tabbing away 
            shiftPressed = false;
            shiftIndicator.style.backgroundColor = "";
            
        }
        if (leftAltPressed) {
            leftAltPressed = false;
            leftAltIndicator.style.backgroundColor = "";
            updateVisualGuideOnOneSide(transposeMap[pitchMap[lastPressedTransposeKey]],0);
        }
        if (rightAltPressed) {
            rightAltPressed = false;
            rightAltIndicator.style.backgroundColor = "";
            updateVisualGuideOnOneSide(transposeMap[pitchMap[lastPressedTransposeKey]],1);
        }
        if (pressedKeys.size != 0) { // catch notes being held when tabbing away
            pressedKeys.forEach(element => {
                let releaseNote: number = letterMap[element] + transposeValue + octaveAdjustment;
                pressedKeys.delete(element);
                removeVisualGuideStyleChange(document.getElementById(element) as HTMLElement);
                currentInstrument.triggerRelease(Tone.Frequency(releaseNote, "midi"));
                currentInstrument.triggerRelease(Tone.Frequency(releaseNote, "midi"));
                currentInstrument.triggerRelease(Tone.Frequency(releaseNote+1, "midi"));
            });
        }

        updateVisualGuideOnOneSide(transposeMap[pitchMap[lastPressedTransposeKey]],0);
        updateVisualGuideOnOneSide(transposeMap[pitchMap[lastPressedTransposeKey]],1);
    }

    // ===========================================
    // APPLYING STYLE CHANGES TO DIV ON PRESS

    function applyVisualGuideStyleChange(key:HTMLElement) {
        // cancel pending removal

        if (activeKeyTimeouts.has(key)) {
            clearTimeout(activeKeyTimeouts.get(key));
            activeKeyTimeouts.delete(key);
        }
        // key.classList.remove('bg-white/80');
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
            key.classList.add('bg-white/80');
        }
        void key.offsetWidth; // force reflow
      }

    // ===========================================
    // MENU TOGGLE

    const handleClickOutside = (e: PointerEvent) => {
        // check for click outside menu
        if (!navbar.contains(e.target as Node)) {
            toggleMenu();
        }
    };

    navbar.addEventListener('pointerdown', toggleMenu);

    function toggleMenu() {
        navbar.classList.toggle("w-[400px]");
        menuTitle.classList.toggle("hidden");
        navContent.forEach(div => {
            div.classList.toggle("hidden");
        });
        acknowledgements.classList.toggle("hidden");
        navbarExtended = !navbarExtended;
    
        if (navbarExtended) {
            navbar.removeEventListener('pointerdown', toggleMenu);
            document.addEventListener('pointerdown', handleClickOutside);
        } else {
            navbar.addEventListener('pointerdown', toggleMenu);
            document.removeEventListener('pointerdown', handleClickOutside);
        }
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
        shiftIndicator.classList.toggle("bg-white/80");
        leftAltIndicator.classList.toggle("bg-white/80");
        rightAltIndicator.classList.toggle("bg-white/80");
        let visualGuideChildrenL = document.getElementById("notes-div-left")!.children;
        let visualGuideChildrenR = document.getElementById("notes-div-right")!.children;
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
        const effectiveTransposeValue: number = pitchMap[lastPressedTransposeKey] + (shiftPressed ? 1 : 0) + (!shiftPressed && (leftAltPressed || rightAltPressed) ? 1 : 0);
        realOctaveLeft = octave + 3 + Math.floor(effectiveTransposeValue / 12);
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
                return createNoteDiv(preserveKeyIDRight[keyIDcount-1],note,currentOctave);
            }
        });
        return elements.join('');


      } else if (currentKeyboardMode === 1) {
          // +1
          let effectiveTransposeL: number = transposeValue + (shiftPressed ? 1 : 0) + (!shiftPressed && leftAltPressed ? 1 : 0);
        //   effectiveTransposeL %= 12;
          const keyNotesL: KeyType = mapNumbersToNotesOctaves[transposeList[effectiveTransposeL] as KeyType];
          realOctaveLeft = octave + 3;
          let effectiveTransposeR: number = transposeValue + 1 + (shiftPressed ? 1 : 0) + (!shiftPressed && rightAltPressed ? 1 : 0);
        //   effectiveTransposeR %= 12;
          const keyNotesR: KeyType = mapNumbersToNotesOctaves[transposeList[effectiveTransposeR] as KeyType];
          realOctaveRight = realOctaveLeft;
          const octaveBase = leftright === 0 ? realOctaveLeft + Math.floor(effectiveTransposeL / 12): realOctaveRight + Math.floor(effectiveTransposeR / 12);
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
                return createNoteDiv(preserveKeyIDLeft[keyIDcount-1],note,currentOctave);
            } else {
                return createNoteDiv(preserveKeyIDRight[keyIDcount-1],note,currentOctave);
              }
          });
          // console.log(elements);
          return elements.join('');


      } else if (currentKeyboardMode === 2) {
        // -1
        let effectiveTransposeR: number = transposeValue + (shiftPressed ? 1 : 0) + (!shiftPressed && rightAltPressed ? 1 : 0);
        //   effectiveTransposeR %= 12;
          const keyNotesR: KeyType = mapNumbersToNotesOctaves[transposeList[effectiveTransposeR] as KeyType];
          realOctaveRight = octave + 3;
          
        let effectiveTransposeL: number = transposeValue + 1 + (shiftPressed ? 1 : 0) + (!shiftPressed && leftAltPressed ? 1 : 0);
        //   effectiveTransposeL %= 12;
          const keyNotesL: KeyType = mapNumbersToNotesOctaves[transposeList[effectiveTransposeL] as KeyType];
          realOctaveLeft = realOctaveRight;

          const octaveBase = leftright === 0 ? realOctaveLeft + Math.floor(effectiveTransposeL / 12): realOctaveRight + Math.floor(effectiveTransposeR / 12);
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
                return createNoteDiv(preserveKeyIDLeft[keyIDcount-1],note,currentOctave);
            } else {
                return createNoteDiv(preserveKeyIDRight[keyIDcount-1],note,currentOctave);
              }
          });
          // console.log(elements);
          return elements.join('');
      }
        
    }

    function updateVisualGuide(key: string) {
        notesDivL.innerHTML = mapNumbersToNotes(transposeMap[pitchMap[key]] as KeyType, 0)!;
        notesDivR.innerHTML = mapNumbersToNotes(transposeMap[pitchMap[key]] as KeyType, 1)!;
        if (!currentLightsOn) {
            toggleVGWhiteBg();
            if (shiftIndicator.classList.contains("bg-white/80")) {
                shiftIndicator.classList.toggle("bg-white/80");
            }
            if (leftAltIndicator.classList.contains("bg-white/80")) {
                leftAltIndicator.classList.toggle("bg-white/80");
            }
            if (rightAltIndicator.classList.contains("bg-white/80")) {
                rightAltIndicator.classList.toggle("bg-white/80");
            }
        }
    }
    
    function updateVisualGuideOnOneSide(transpose: any, leftright: number) {
        // 0: left
        // 1: right
        const operationalDiv = leftright ? notesDivR : notesDivL
        operationalDiv.innerHTML = mapNumbersToNotes(transpose, leftright)!;
        if (!currentLightsOn) {
            for (const child of operationalDiv.children) {
                if (child.classList.contains("bg-white/80")) {
                    child.classList.toggle("bg-white/80");
                }
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
        stopAudioWhenReleasedButton.textContent = stopAudioWhenReleased ? "instant release" : "smooth release";
      
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

export { volumeNode };