// import { states, pressedKeys } from "../core/states";
// import { RecordedSong, Keypress, RecordedNote, RecordedOperation } from "./types";
// import { songs, keypresses } from "./songs";
// import { leftKeyboardKeys, rightKeyboardKeys, relativeMapping } from "../core/maps";
// import { pitchMap } from "../core/maps";

// const startTranscribeButton = document.getElementById("start-transcribe-button")!;
// startTranscribeButton.addEventListener("pointerdown", startTranscribing);

// // export interface RecordedSong {
// //     name: string;
// //     version: number; // 1 for now
// //     skysynthVersion: string; // skysynth version at time of recording (eg. "0.18.1")
// //     keyboardMode: KeyboardMode; // keyboard mode (0: +12, 1: +1, 2: -1)
// //     sheetType: SheetType; // always "recorded" for now
// //     // bpm: number; // TODO: find BPM for recorded songs?
// //     instruments: any[]; // TODO
// //     startingTranspose: number; // initial transpose value. default to 0 by “?? 0” during creation
// //     keypresses: Keypress[]; 
// // }

// // interface Keypress {
// //     nature: KeypressNature;
// //     time: number; 
// //     note?: RecordedNote; // note content if nature is "note"
// //     operation?: RecordedOperation; // operation content if nature is "operation"
// // }

// const transcribeStartTime = Date.now();

// function startTranscribing() {
//     states.isTranscribing = true;

//     const song: RecordedSong = {
//         name: "New Song",
//         version: 1,
//         skysynthVersion: states.skysynthVersion,
//         keyboardMode: states.currentKeyboardMode,
//         sheetType: "recorded",
//         // bpm: 
//         instruments: states.currentInstrument,
//         startingTranspose: states.transposeValue,
//         keypresses: keypresses
//     };



//     songs.push(song);

//     console.log(song);




// }

// // export interface RecordedNote {
// //     index: number;
// //     MIDI: number;
// //     relativeKeyValue: number; // 0-14
// //     leftright: 0 | 1; // 0: left, 1: right
// // }

// function transcribeKeypress(keyIsNote: boolean, key: string, finalMIDI: number | null = null, isKeyDown: boolean) {
//     if (keyIsNote) {
//         const note: RecordedNote = {
//             index: states.latestTranscribeNoteIndex,
//             MIDI: finalMIDI as number,
//             relativeKeyValue: relativeMapping[key],
//             leftright: 0 // set as left first
//         }
//         if (rightKeyboardKeys.has(key)) {
//             note.leftright = 1;
//         }
//         states.latestTranscribeNoteIndex++;

//     } else {
//         let nature: number = 0;

//         if (key in pitchMap && !pressedKeys.has(key)) {
//             // transpose
//             nature = 0;
//         } else if (key == "arrowleft" || key == "arrowright" || key == "arrowup" || key == "arrowdown") {
//             // octave
//             nature = 1;
//         } else {
//             // temp transpose
//             nature = 2;
            
//         }

//         // const operation: RecordedOperation = {
//         //     index: states.latestTranscribeOperationIndex,
//         //     nature: nature,
//         //     updatedTranspose: states.transposeValue,
//         //     updatedOctave: states.octave,
//         //     tempTranspose: {
//         //         isKeyDown: isKeyDown,
//         //         // key: states.shiftPressed ||
//         //     }
            
//         // }

//         // TODO
        
//     }
    

//     const keypress: Keypress = {
//         isNote: keyIsNote,
//         time: Date.now() - transcribeStartTime,
//         // note
        
        
//     }

//     songs[0].keypresses.push(keypress);
    
//     console.log(keypress);
    
// }