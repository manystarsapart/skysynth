import * as Tone from 'tone';
import { updateStatusMsg, updateNoteHistory } from './logging.ts';
import { effectNodes, instruments, instrumentNames } from './instrueffect.ts';
import { keyboardMode0, keyboardMode1, keyboardMode2, pitchMap, transposeMap, leftKeyboardKeys, rightKeyboardKeys } from './maps.ts';
import { } from './water.ts';
import { states, pressedKeys, activeKeyTimeouts } from './states.ts';
import { updateVisualGuide, toggleVGWhiteBg, applyVisualGuideStyleChange, removeVisualGuideStyleChange } from './visualguide.ts';

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

    // let letterMap = keyboardMode0;



    // menu
    let navbarExtended: boolean = false;

    // water
    const maxWaterLevel: number = 500;

    // lights
    // let states.currentLightsOn: boolean = true;

    // stopAudioWhenReleased
    // let stopAudioWhenReleased: boolean = false;

    // octave
    // let states.lastPressedTransposeKey: string = "`"; // ` 1 2 3 4 5 6 7 8 9 0 - =
    // let states.octave: number = 0;
    // let states.octaveAdjustment: number = 0;



    // cumulative time
    let globalStartTime: number = Date.now();

    // volume
    volumeNode = new Tone.Volume().toDestination();



    // instruments & effects
    let effectLevel: number = 50;

    // let transposeValue: number = 0;


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

    // changing EFFECTS
    effectSelection.addEventListener('input', (e:any) => {
        const selectedID = parseInt(e.target.value); 
        getEffectLevelInput(effectNodes[selectedID]); 
        // ^^read from slider BEFORE setting new effect. this ensures we are setting things for the correct node

        let newEffectNode = effectNodes[selectedID]; // set new effect 

        // rewiring to include new effect node
        states.currentInstrument.disconnect();
        if (states.currentEffectNode) { // if existing effect is connected, unwire
            states.currentEffectNode.disconnect(volumeNode);
        }
        states.currentEffectNode = newEffectNode; 
        if (states.currentEffectNode) { // rewire to new effect
            states.currentInstrument.connect(states.currentEffectNode); // rewire only for
            states.currentEffectNode.connect(volumeNode);
        } else {
            states.currentInstrument.connect(volumeNode);
        }
    });

    // update again to realise new connection
    effectSelection.dispatchEvent(new Event('input'));

    // changing INSTRUMENTS
    instrumentSelection.addEventListener("input", (e:any) => {
        // the actual changing

        states.currentInstrument = instruments[e.target.value]; 
        // rewiring
        states.currentInstrument.disconnect();
        if (states.currentEffectNode) states.currentInstrument.connect(states.currentEffectNode);
        else states.currentInstrument.connect(volumeNode);
        if (states.currentInstrument instanceof Tone.Sampler && e.target.value != 1 && e.target.value != 12 && e.target.value != 14) {
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


    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);


    
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
        if (key in states.letterMap && !pressedKeys.has(key)) { 
            incrementWater();
            // key in noteplaying map: play MIDI note
            pressedKeys.add(key);
            let midiNote: number = states.letterMap[key] + states.transposeValue + states.octaveAdjustment;

            if (e.shiftKey) {midiNote++;} 
            else if (leftKeyboardKeys.has(key)) {
                if (e.altKey && e.location === 1) {midiNote++;}
            }
            else if (rightKeyboardKeys.has(key)) {
                if (e.altKey && e.location === 2) {midiNote++;}
            }            

            updateNoteHistory(midiNote, cumulativeKeypress);
            // calculating latency 
            const audioStartTime: number = performance.now();
            const latency: number = audioStartTime - keyPressTime;
            console.log(`Latency: ${latency} ms`); 
            states.currentInstrument.triggerAttack(Tone.Frequency(midiNote, "midi"),Tone.getContext().currentTime);
            applyVisualGuideStyleChange(document.getElementById(key) as HTMLElement);

            incrementCumKeypress();
        } else if (key in pitchMap && !pressedKeys.has(key)) {
            // detecting for transposing. number keys
            states.lastPressedTransposeKey = key;
            states.transposeValue = pitchMap[key]; // in semitones
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
        const key: string = getBaseKey(e.key).toLowerCase();
        if (key in states.letterMap) {
            removeVisualGuideStyleChange(document.getElementById(key) as HTMLElement);
            pressedKeys.delete(key);
            let midiNote = states.letterMap[key] + states.transposeValue + states.octaveAdjustment;
            if (states.stopAudioWhenReleased == false) return; // IF SAMPLER && NOT E-GUITAR && NOT OTTO-SYNTH
            else;
            states.currentInstrument.triggerRelease(Tone.Frequency(midiNote, "midi"));
            states.currentInstrument.triggerRelease(Tone.Frequency(midiNote+1, "midi"));
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

    lightSwitch.addEventListener("pointerdown", toggleLights);

    function toggleLights() {
        if (states.currentLightsOn) {
            states.currentLightsOn = false;
            staticBackground.classList.replace("brightness-110", "brightness-0");
            lightSwitch.style.backgroundColor = "#F08080";
            waterMask.style.display = "none";
            updateStatusMsg("Lights out!");
            toggleVGWhiteBg();
        }
        else {
            states.currentLightsOn = true;
            staticBackground.classList.replace("brightness-0", "brightness-110");
            lightSwitch.style.backgroundColor = "#588157";
            waterMask.style.display = "block";
            updateStatusMsg("Lights back on!");
            toggleVGWhiteBg();
        }
    }



    // ===========================================
    // SWITCH KEYBOARDS
    
    // let states.currentKeyboardMode = 0
    // 0: +12 (default)
    // 1: +1 (accidentals)

    switchKeyboardButton.addEventListener('pointerdown', toggleKeyboardMode);

    function toggleKeyboardMode() {
        if (states.currentKeyboardMode === 0) {
            // current +12, toggle to +1
            states.currentKeyboardMode = 1;
            states.letterMap = keyboardMode1;
            switchKeyboardButton.textContent = "+1";
            updateVisualGuide(states.lastPressedTransposeKey);
        } else if (states.currentKeyboardMode === 1) {
            // current +1, toggle to -1
            states.currentKeyboardMode = 2;
            states.letterMap = keyboardMode2;
            switchKeyboardButton.textContent = "-1";
            updateVisualGuide(states.lastPressedTransposeKey);
        } else {
          // current -1, toggle to +12
          states.currentKeyboardMode = 0;
          states.letterMap = keyboardMode0;
          switchKeyboardButton.textContent = "+12";
          updateVisualGuide(states.lastPressedTransposeKey);
        }
        console.log(`keyboard mode changed. current mode: ${states.currentKeyboardMode}`);
        updateStatusMsg(`keyboard mode changed to: ${states.currentKeyboardMode}`);
    }



    // ===========================================
    // OCTAVE CHANGE

    function octaveUp(target:number | null = null) {
        if (target == null) {
            if (states.octave >= 3) {
                updateStatusMsg("Already at maximum octave!");
                return;
            }
            states.octave++;
            states.octaveAdjustment += 12;
            octaveValueDisplay.innerHTML = states.octave.toString();
            updateStatusMsg(`states.octave shift updated to: ${states.octave}`);
            updateVisualGuide(states.lastPressedTransposeKey);
        }
    }

    function octaveDown(target:number | null = null) {
        if (target == null) {
            if (states.octave <= -2) {
                updateStatusMsg("Already at minimum octave!");  
                return;
            }
            states.octave--;
            states.octaveAdjustment -= 12;
            octaveValueDisplay.innerHTML = states.octave.toString(); 
            updateStatusMsg(`states.octave shift updated to: ${states.octave}`);
            updateVisualGuide(states.lastPressedTransposeKey); 
        }
    }





    // ===========================================
    // STOP AUDIO WHEN RELEASED

    function toggleStopAudioWhenReleased(manualState: boolean | null = null) {
        if (manualState !== null) {
            states.stopAudioWhenReleased = manualState;
        } else {
            states.stopAudioWhenReleased = !states.stopAudioWhenReleased;
        }
        stopAudioWhenReleasedButton.style.backgroundColor = states.stopAudioWhenReleased ? "#588157" : "#F08080";
        stopAudioWhenReleasedButton.textContent = states.stopAudioWhenReleased ? "instant release" : "smooth release";
      
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