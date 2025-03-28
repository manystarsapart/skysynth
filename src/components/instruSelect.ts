import * as Tone from 'tone';
import { effectNodes, instruments, instrumentNames } from '../audio/instruEffect.ts';
import { states } from '../states';
import { toggleStopAudioWhenReleased } from '../audio/stopAudioWhenReleased';

// volume
export let volumeNode = new Tone.Volume().toDestination();

// volume
const volumeControl = document.getElementById("volume-control")!;

// instruments & effects
const instrumentSelection = document.getElementById("instrument-selection")!;
const effectSelection = document.getElementById("effect-selection")!;
const effectLevelControl = document.getElementById("effect-level-control")! as HTMLInputElement;

export const volumeValueDisplay = document.getElementById("volume-value")!; // past: volumeValueBox

// instruments & effects
let effectLevel: number = 50;

volumeControl.addEventListener("input", (e:any) => {
    states.volume = e.target.value;
    localStorage.setItem("savedVolume", states.volume.toString()); // stored in localStorage
    volumeValueDisplay.textContent = `${states.volume}%`; // display
    volumeNode.volume.value = Tone.gainToDb(states.volume/100); // % to db
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
