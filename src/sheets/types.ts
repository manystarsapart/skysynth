type KeyboardMode = "+12" | "+1" | "-1";
type SheetType = "recorded" | "composed";

export interface RecordedNote {
    index: number;
    MIDI: number;
    relativeKeyValue: number; // 0-14
    leftright: 0 | 1; // 0: left, 1: right
}

export interface RecordedOperation {
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
    name: string;
    version: number; // 1 for now
    skysynthVersion: string; // skysynth version at time of recording (eg. "0.18.1")
    keyboardMode: KeyboardMode; // keyboard mode (0: +12, 1: +1, 2: -1)
    sheetType: SheetType; // always "recorded" for now
    // bpm: number; // TODO: find BPM for recorded songs?
    instruments: any[]; // TODO
    startingTranspose: number; // initial transpose value. default to 0 by “?? 0” during creation
    keypresses: Keypress[]; 
}





