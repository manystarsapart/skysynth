import * as Tone from 'tone';
import { updateStatusMsg, updateNoteHistory } from './logging.ts';
import { pitchMap, transposeMap, leftKeyboardKeys, rightKeyboardKeys } from './maps.ts';
import { states, pressedKeys } from './states.ts';
import { updateVisualGuide, applyVisualGuideStyleChange, removeVisualGuideStyleChange } from './visual/visualguide.ts';
import { octaveUp, octaveDown } from './audio/octave.ts';
import { toggleStopAudioWhenReleased } from './audio/stopAudioWhenReleased.ts';
import { toggleMenu } from './components/menu.ts';
import { toggleKeyboardMode } from './audio/switchKeyboard.ts';
import { incrementWater, waterLevelDisplay, waterRewardDisplay, updateWaterMaskPosition } from './visual/water.ts';
import { toggleLights } from './visual/lights.ts';
import { volumeValueDisplay } from './components/instruSelect.ts';
import './audio/recording.ts';


document.addEventListener("DOMContentLoaded", () => {

    // NOT IN THIS CODE: FIREBASE & ALL SERVER INTERACTION

    // ======================
    // DATA & DISPLAYS

    // span displays
    const transposeValueDisplay = document.getElementById("transpose-value")!; // past: transposeValueBox
    const scaleValueDisplay1 = document.getElementById("scale-value")!; // past: scaleValueBox
    const scaleValueDisplay2 = document.getElementById("scale-value-2")!; // past: scaleValueBox2

    const cumKeypressDisplay = document.getElementById("cum-keypress")!; // past: cumKeypressBox
    const cumTimeDisplay = document.getElementById("cum-time")!; // past: cumTimeBox

    // ======================
    // USER VALUES & FUNCTIONS

    let cumulativeKeypress: number = parseInt(localStorage.getItem("cumulativeKeypress") ?? '0') || 0;
    let cumulativeTime: number = parseInt(localStorage.getItem("cumulativeTime") ?? '100') || 100;

    // cumulative time
    let globalStartTime: number = Date.now();

    // ===========================================
    // INITIALISE WATER

    waterLevelDisplay.textContent = `${states.currentWaterLevel} / ${states.maxWaterLevel}`;
    waterRewardDisplay.textContent = states.totalWaterReward.toString();
    updateWaterMaskPosition();

    // ===========================================
    // VOLUME CONTROL

    volumeValueDisplay.textContent = `${states.volume}%`;

    // ===========================================
    // HANDLING KEYPRESSES
    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values

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
                if (states.leftAltPressed) {midiNote++;}
            }
            else if (rightKeyboardKeys.has(key)) {
                if (states.rightAltPressed) {midiNote++;}
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

// export { volumeNode };