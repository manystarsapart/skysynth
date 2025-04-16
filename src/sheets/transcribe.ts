import { states, pressedKeys } from "../core/states";
import { songs, keypresses } from "./songs";
import { rightKeyboardKeys, relativeMapping } from "../core/maps";
import { pitchMap } from "../core/maps";
import { getFormattedDateTimeForDownload, updateStatusMsg } from "../core/logging";

type KeyboardMode = "+12" | "+1" | "-1";
type SheetType = "recorded" | "composed";

interface RecordedNote {
    index: number;
    MIDI: number;
    relativeKeyValue: number; // 0-14
    leftright: 0 | 1; // 0: left, 1: right
}

interface RecordedOperation {
    index: number;
    nature: number; // 0: tranpose, 1: octave, 2: temp-transpose
    updatedTranspose?: number; // only for transpose operations
    updatedOctave?: number; // only for octave operations
    tempTranspose?: {
        isKeyDown: boolean;
        key?: number; // 0: shift, 1: L alt, 2: R alt. NO NEED IF ISKEYDOWN == FALSE
    };
}

export interface Keypress {
    isNote: boolean;
    time: number; 
    note?: RecordedNote; // note content if nature is "note"
    operation?: RecordedOperation; // operation content if nature is "operation"
}

export interface RecordedSong {
    id: number;
    name: string;
    version: number; // 1 for now
    skysynthVersion: string; // skysynth version at time of recording (eg. "0.18.1")
    keyboardMode: KeyboardMode; // keyboard mode (0: +12, 1: +1, 2: -1)
    sheetType: SheetType; // always "recorded" for now
    // bpm: number; // TODO: find BPM for recorded songs?
    instruments: string; // TODO
    startingTranspose: number; // initial transpose value. default to 0 by “?? 0” during creation
    keypresses: Keypress[]; 
}

const toggleTranscribeButton = document.getElementById("toggle-transcribe-button")!;
const downloadTranscribeButton = document.getElementById("download-transcribe-button")!;
toggleTranscribeButton.addEventListener("pointerdown", toggleTranscribingState);
downloadTranscribeButton.addEventListener("pointerdown", downloadTranscription);

function downloadTranscription() {

    const jsonString = JSON.stringify(songs);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = `songs_${getFormattedDateTimeForDownload()}.json`;
    document.body.appendChild(a);
    a.click();
  
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

const transcribeStartTime = Date.now();

function toggleTranscribingState() {
    if (states.isTranscribing) {
        states.lastTranscribedSongID++;
        updateStatusMsg("stopped transcribing. transcribed song ID: " + states.lastTranscribedSongID);
        toggleTranscribeButton.style.backgroundColor = "";
        toggleTranscribeButton.textContent = "Start Transcribing";
    } else {
        startTranscribing();
        updateStatusMsg("started transcribing. transcribing song ID: " + states.lastTranscribedSongID);
        toggleTranscribeButton.style.backgroundColor = "#F08080";
        toggleTranscribeButton.textContent = "Stop Transcribing";
    }

    states.isTranscribing = !states.isTranscribing;
}

function startTranscribing() {
    const song: RecordedSong = {
        id: states.lastTranscribedSongID,
        name: "New Song",
        version: 1,
        skysynthVersion: states.skysynthVersion,
        keyboardMode: states.currentKeyboardMode,
        sheetType: "recorded",
        // bpm: 
        instruments: states.currentInstrumentName,
        startingTranspose: states.transposeValue,
        keypresses: keypresses
    };
    songs.push(song);
    console.log(song);

}

const getTempTransposeKey = () => {
    if (states.shiftPressed) return 0;
    else if (states.leftAltPressed) return 1;
    else if (states.rightAltPressed) return 2; 
}


export function transcribeKeypress(keyIsNote: boolean, key: string, finalMIDI: number | null = null, tempTransposeIsKeyDown: boolean = false) {
    let note: RecordedNote | null = null;
    let operation: RecordedOperation | null = null;

    if (keyIsNote) {
        note = {
            index: states.latestTranscribeNoteIndex,
            MIDI: finalMIDI as number,
            relativeKeyValue: relativeMapping[key],
            leftright: 0 // set as left first
        }
        if (rightKeyboardKeys.has(key)) {
            note.leftright = 1;
        }
        states.latestTranscribeNoteIndex++;

    } else {
        let nature: number = 0;

        if (key in pitchMap && !pressedKeys.has(key)) {
            // transpose
            nature = 0;
        } else if (key == "arrowleft" || key == "arrowright" || key == "arrowup" || key == "arrowdown") {
            // octave
            nature = 1;
        } else {
            // temp transpose
            nature = 2;
            
        }

        operation = {
            index: states.latestTranscribeOperationIndex,
            nature: nature,
            updatedTranspose: states.transposeValue,
            updatedOctave: states.octave,
            tempTranspose: {
                isKeyDown: tempTransposeIsKeyDown,
                key: getTempTransposeKey(),
            }
            
        }
        states.latestTranscribeOperationIndex++;
        
    }
    
    const keypress: Keypress = generateKeypressToPush(keyIsNote, note, operation);

    songs[states.lastTranscribedSongID].keypresses.push(keypress);
    
    console.log(keypress);
    
}

function generateKeypressToPush(keyIsNote:boolean, note: RecordedNote | null = null, operation: RecordedOperation | null = null) {
    return {
        isNote: keyIsNote,
        time: Date.now() - transcribeStartTime,
        // note
        note: keyIsNote ? note : null,
        operation: keyIsNote ? null: operation
    } as Keypress
}
