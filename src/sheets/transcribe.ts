import { states, pressedKeys } from "../core/states";
import { songs } from "./songs";
import { rightKeyboardKeys } from "../core/maps";
import { pitchMap } from "../core/maps";
import { getFormattedDateTimeForDownload, updateStatusMsg } from "../core/logging";
import { refreshSongSelect, stopSong } from "./sheetPlayer";

type KeyboardMode = "+12" | "+1" | "-1";
type SheetType = "recorded" | "composed";

export interface RecordedNote {
    index: number;
    MIDI: number;
    keyboardKey: string; // qwert etc
    leftright: 0 | 1; // 0: left, 1: right
    isKeyDown: boolean;
    semitonePlusOne: boolean;
}

export interface RecordedOperation {
    index: number;
    nature: number; // 0: tranpose, 1: octave, 
    updatedTranspose?: number; // only for transpose operations
    updatedOctave?: number; // only for octave operations
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
    user: string;
    version: number; // 1 for now
    skysynthVersion: string; // skysynth version at time of recording (eg. "0.18.1")
    keyboardMode: KeyboardMode; // keyboard mode (0: +12, 1: +1, 2: -1)
    sheetType: SheetType; // always "recorded" for now
    // bpm: number; // TODO: find BPM for recorded songs?
    instruments: string; // TODO
    startingTranspose: number; // initial transpose value. default to 0 by “?? 0” during creation
    startingStopAudioWhenReleased: boolean;
    keypresses: Keypress[]; 
}

const toggleTranscribeButton = document.getElementById("toggle-transcribe-button")!;
const downloadTranscribeButton = document.getElementById("download-transcribe-button")!;
toggleTranscribeButton.addEventListener("pointerdown", toggleTranscribingState);
downloadTranscribeButton.addEventListener("pointerdown", downloadTranscription);

function downloadTranscription() {
    if (songs.length != 0) {
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
    } else {
        alert("No transcriptions to download!");
    }

  }


function toggleTranscribingState() {
    if (states.isTranscribing) {
        let songNameInput: string | null = prompt("Song Name:",`New Song (${states.lastTranscribedSongID})`);
        let songName = songNameInput ? songNameInput : `New Song (${states.lastTranscribedSongID})`;
        let userInput: string | null = prompt("Played by","Anonymous User");
        let user = userInput ? userInput : "Anonymous User";
        songs[states.lastTranscribedSongID].name = songName;
        songs[states.lastTranscribedSongID].user = user;
        states.lastTranscribedSongID++;
        updateStatusMsg(`stopped transcribing song "${songName}" by ${user}. ID: ${states.lastTranscribedSongID}`);
        refreshSongVisuals();
        toggleTranscribeButton.style.backgroundColor = "";
        toggleTranscribeButton.textContent = "Start Transcribing";
    } else {
        startTranscribing();
        updateStatusMsg("started transcribing. transcribing song ID: " + states.lastTranscribedSongID);
        toggleTranscribeButton.style.backgroundColor = "#F08080";
        toggleTranscribeButton.textContent = "Stop Transcribing";
    }
    // refresh songlist for playing transcribing
    states.isTranscribing = !states.isTranscribing;
}

function startTranscribing() {
    states.currentSongStartTime = performance.now();

    // keypresses.length = 0;

    const nowKeypresses: Keypress[] = [];
    const song: RecordedSong = {
        id: states.lastTranscribedSongID,
        name: `New Song ${states.lastTranscribedSongID}`,
        user: "Anonymous User",
        version: 1,
        skysynthVersion: states.skysynthVersion,
        keyboardMode: states.currentKeyboardMode,
        sheetType: "recorded",
        instruments: states.currentInstrumentName,
        startingTranspose: states.transposeValue,
        startingStopAudioWhenReleased: states.stopAudioWhenReleased,
        keypresses: nowKeypresses
    };
    songs.push(song);
    console.log(song);
}



export function transcribeKeypress(keyIsNote: boolean, key: string, finalMIDI: number | null = null, noteIsKeyDown: boolean = true) {
    let note: RecordedNote | null = null;
    let operation: RecordedOperation | null = null;

    if (keyIsNote) {
        note = {
            index: states.latestTranscribeNoteIndex,
            MIDI: finalMIDI as number,
            keyboardKey: key,
            leftright: 0, // set as left first
            isKeyDown: noteIsKeyDown,
            semitonePlusOne: (states.shiftPressed || states.leftAltPressed) ? true : false
        }
        if (rightKeyboardKeys.has(key)) {
            note.leftright = 1;
            note.semitonePlusOne = (states.shiftPressed || states.rightAltPressed) ? true : false;
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
        }

        operation = {
            index: states.latestTranscribeOperationIndex,
            nature: nature,
            updatedTranspose: states.transposeValue,
            updatedOctave: states.octave,
            
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
        time: performance.now() - states.currentSongStartTime,
        // note
        note: keyIsNote ? note : null,
        operation: keyIsNote ? null: operation
    } as Keypress
}

export function refreshSongVisuals() {
    const songlist = document.getElementById("songlist-modal")!;
    let HTML: string = "";
    if (songs.length != 0) {
        for (let i = 0; i<songs.length; i++) {
            HTML += `${songs[i].name} (ID: ${i}) | <span id="songlist-span-${i}" class="text-2xl"><b>×</b></span><br \>`;
        }
        songlist.innerHTML = HTML;
        for (let i = 0; i<songs.length; i++) {
            document.getElementById(`songlist-span-${i}`)!.addEventListener("pointerdown", () => deleteSongFromList(i));
        }
    } else {
        HTML = "No songs transcribed yet!";
        songlist.innerHTML = HTML;
    }
    refreshSongSelect();
}



function deleteSongFromList(songID:number) {
    const deleteConfirmation = confirm(`Are you sure you wish to delete song: ${songs[songID].name}?`);
    if (deleteConfirmation) {
        stopSong()
        updateStatusMsg(`Deleting song ${songs[songID].name}`);
        songs.splice(songID, 1); // remove the song
        states.lastTranscribedSongID--;
        for (let i = songID; i<songs.length; i++) {
            songs[i].id--; // lower all subsequent IDs
        }
        refreshSongVisuals();
        
    } else {
        updateStatusMsg("Cancelled song deletion");
    }
}
