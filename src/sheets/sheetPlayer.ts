import * as Tone from 'tone';
import { states } from "../core/states";
import { Keypress, RecordedSong } from './transcribe';
import { updateStatusMsg } from '../core/logging';
import { songs } from './songs';
import { octaveDown, octaveTo, octaveUp, transposeDownOne, transposeToNumericalKey, transposeUpOne } from '../audio/transposeOctave';
import { leftAltIndicator, rightAltIndicator, shiftIndicator, updateVisualGuide, updateVisualGuideOnOneSide } from '../visual/visualGuide';
import { RELEASE_SETTINGS } from '../audio/instruEffect';
import { spaceIndicator } from '../core/keypress';

const playTranscribedButton = document.getElementById("play-transcription-button")!;
const stopPlaybackButton = document.getElementById("stop-transcription-playback-button")!;

const operationTimeouts: any[] = [];
// TODO: FIX. USE TIMEOUT INTERFACE. THIS IS A TEMPORARY FIX

playTranscribedButton.addEventListener("pointerdown", () => {
  if (songs.length != 0) {
    playSong(songs[states.songIDToPlay]);
  } else {
    alert("No transcriptions to play!")
  }
});
stopPlaybackButton.addEventListener("pointerdown", stopSong);

export const transcribeSelection = document.getElementById("transcribe-selection")!;

export function refreshSongSelect() {
  transcribeSelection.innerHTML = "";
  for (var i = 0; i < songs.length; i++) {
    transcribeSelection.appendChild(
      Object.assign(
        document.createElement("option"),
        { value: i, innerHTML: songs[i] != null ? songs[i].name : "None" }
      )
    );
  }
}


transcribeSelection.addEventListener('input', (e:any) => {
    const selectedID = parseInt(e.target.value);
    states.songIDToPlay = selectedID;
    updateStatusMsg("selected song to play: " + selectedID);
});

let currentPart: Tone.Part | null = null;

async function playSong(song: RecordedSong) {

  // ====================
  // check if version is up to date

  // catch for ver 1 skysheets
  if (!song.sheetVersion) {
    alert(`Old sheet version. Sheet player behaviour may not be optimal. 
      \n(Uploaded sheet version: 1.0 (legacy); App version: ${states.skysynthSheetVersion})`);
      song.sheetVersion = "1.0";
  }

  const [sheetVer, sheetPatch] = song.sheetVersion.split(".");
  const [appVer, appPatch] = states.skysynthSheetVersion.split(".");
  // big version change: breaks
  // small patch change: non-breaking

  if (sheetVer != appVer) {
    alert(`Mismatched version! Sheet cannot be played. 
      \n(Uploaded sheet version: ${song.sheetVersion}; App version: ${states.skysynthSheetVersion})`);
    return;
  } else if (sheetPatch != appPatch) {
    alert(`Mismatched patch number. Sheet player behaviour may not be optimal. 
    \n(Uploaded sheet version: ${song.sheetVersion}; App version: ${states.skysynthSheetVersion})`);
  }

  // ====================

  const context = Tone.getContext();
  const transport = Tone.getTransport();

  transposeToNumericalKey(song.startingTranspose);
  octaveTo(song.startingOctave);

  // resume audio context
  if (context.state !== "running") {
    await Tone.start();
  }

  // stop existing part
  if (currentPart) {
    currentPart.stop();
    currentPart.dispose();
    currentPart = null;
  }

  // remove existing transport
  transport.stop();
  transport.cancel();
  transport.position = 0; // reset to time 0

  updateStatusMsg(`now playing: ${song.name}`);
  updateStatusMsg(`song id: ${states.songIDToPlay}`);

  playTranscribedButton.style.backgroundColor = "#F08080";
  
  const noteEvents: Array<[number, { MIDI:number, isKeyDown:boolean, semitonePlusOne:boolean, keyboardKey:string, stopAudioWhenReleased:boolean }]> = [];
  const operations: Keypress[] = [];


  const audioContext = new AudioContext(); // for operations
  const startTime = audioContext.currentTime;

  for (const keypress of song.keypresses) {
    if (keypress.isNote && keypress.note) {
      // NOTES
      noteEvents.push([
        keypress.time / 1000,
        {
          MIDI: keypress.note.MIDI,
          isKeyDown: keypress.note.isKeyDown,
          semitonePlusOne: keypress.note.semitonePlusOne,
          keyboardKey: keypress.note.keyboardKey,
          stopAudioWhenReleased: keypress.note.stopAudioWhenReleased, // CURRENTLY UNUSED. MAY BE USEFUL
        }
      ]);
    } else if (keypress.operation) {
      // OPERATIONS
      operations.push(keypress);
    }
  }

  const part = new Tone.Part((time, value) => {
    const noteFreq = Tone.Frequency(value.MIDI, "midi");
    const noteFreqPlusOne = Tone.Frequency(value.MIDI+1, "midi");
    if (value.isKeyDown) {
      // keydown
      states.currentInstrument.triggerAttack(noteFreq, time);
      if (value.stopAudioWhenReleased || RELEASE_SETTINGS.INSTANT_RELEASE_INSTRUMENTS.includes(states.currentInstrumentName)) {
        // instant release OR forced instant release due to instrument
        document.getElementById(value.keyboardKey)!.classList.add("key-active-instant-playback");
      } else {
        // smooth release
        document.getElementById(value.keyboardKey)!.classList.add("key-active-playback");
        setTimeout(() => {
          document.getElementById(value.keyboardKey)!.classList.remove("key-active-playback")
        },500)
        setTimeout(() => {
          if (!value.semitonePlusOne) states.currentInstrument.triggerRelease(noteFreq);
          else states.currentInstrument.triggerRelease(noteFreqPlusOne);

          
        },3000)
      }

    } else { 
      // keyup
      if (value.stopAudioWhenReleased || RELEASE_SETTINGS.INSTANT_RELEASE_INSTRUMENTS.includes(states.currentInstrumentName)) {
        // instant release OR forced instant release due to instrument
        if (!value.semitonePlusOne) states.currentInstrument.triggerRelease(noteFreq, time);
        else states.currentInstrument.triggerRelease(noteFreqPlusOne, time);

        

        document.getElementById(value.keyboardKey)!.classList.remove("key-active-instant-playback");
      } else {
        // smooth release: do nothing on keyup
      }
    }
  }, noteEvents);

  const lastKeypressTime = noteEvents.length > 0 ? noteEvents[noteEvents.length - 1][0] : 0; // catches 0 length transcriptions
  const songDuration = lastKeypressTime + 3; // small buffer to ensure all keypresses finish

  setTimeout(() => {
    playTranscribedButton.style.backgroundColor = ""; // reset background
    console.log("song duration: " + songDuration);
    stopSong();
  }, songDuration*1000);


  // HANDLING OPERATION KEYPRESSES

  for (const keypress of operations) {
    const operationTime = startTime + keypress.time;
    operationTimeouts.push(setTimeout(() => {
      if (keypress.operation!.nature === 0) {
        // TRANSPOSE
        transposeToNumericalKey(keypress.operation!.updatedTranspose!);
        updateVisualGuide()
      } else if (keypress.operation!.nature === 1) {
        // OCTAVE
        octaveTo(keypress.operation!.updatedOctave!);
        updateVisualGuide()
      } else if (keypress.operation!.nature === 2) {
        // TRANSPOSE BY 1
          if (keypress.key === "[") {
            transposeDownOne();
        } else if (keypress.key === "]") {
          transposeUpOne();
          
        }
      } else if (keypress.operation!.nature === 3) {
        // TEMP TRANSPOSE
        const tempTranspose = keypress.operation!.tempTranspose
          if (tempTranspose.isSemitoneUp) {
            // note down --> semitone up
            switch (keypress.key) {
              case "shift":
                states.shiftPressed = true;
                shiftIndicator.style.backgroundColor = "#FAE29C";
                updateVisualGuideOnOneSide(0);
                updateVisualGuideOnOneSide(1);
                break;
              case "altL":
                states.leftAltPressed = true;
                leftAltIndicator.style.backgroundColor = "#FAE29C";
                updateVisualGuideOnOneSide(0);
                break;
              case "altR":
                states.rightAltPressed = true;
                rightAltIndicator.style.backgroundColor = "#FAE29C";
                updateVisualGuideOnOneSide(1);
                break;
            }
          } else {
            // note up --> semitone down
            switch (keypress.key) {
              case "shift":
                states.shiftPressed = false;
                shiftIndicator.style.backgroundColor = "";
                updateVisualGuideOnOneSide(0);
                updateVisualGuideOnOneSide(1);
                break;
              case "altL":
                states.leftAltPressed = false;
                leftAltIndicator.style.backgroundColor = "";
                updateVisualGuideOnOneSide(0);
                break;
              case "altR":
                states.rightAltPressed = false;
                rightAltIndicator.style.backgroundColor = "";
                updateVisualGuideOnOneSide(1);
                break;
            }
          }
      } else if (keypress.operation!.nature === 4) {
        if (keypress.operation!.isKeyDown) {
          states.spacePressed = true;
          spaceIndicator.style.backgroundColor = "#FAE29C";
          octaveUp();
          updateVisualGuideOnOneSide(0);
          updateVisualGuideOnOneSide(1);
        } else {
          states.spacePressed = false;
          spaceIndicator.style.backgroundColor = "";
          octaveDown();
          updateVisualGuideOnOneSide(0);
          updateVisualGuideOnOneSide(1);
        }
      }
  }, operationTime));
    
  }


  part.start(0);
  transport.start();

  currentPart = part;

  return part;
}

export async function stopSong() {
  leftAltIndicator.style.backgroundColor = "";
  rightAltIndicator.style.backgroundColor = "";
  shiftIndicator.style.backgroundColor = "";
  spaceIndicator.style.backgroundColor = "";

  const transport = Tone.getTransport();

  // stop existing part
  if (currentPart) {
    currentPart.stop();
    currentPart.dispose();
    currentPart = null;
  }

  // remove existing transport
  transport.stop();
  transport.cancel();
  transport.position = 0; // reset to time 0

  states.currentInstrument.triggerRelease();
  

  for (let midi = 0; midi < 128; midi++) {
    states.currentInstrument.triggerRelease(Tone.Frequency(midi, "midi"));
  } // failsafe

  // remove timeouts
  for (var i=0; i<operationTimeouts.length; i++) {
    clearTimeout(operationTimeouts[i]);
  }
  operationTimeouts.length = 0;
  playTranscribedButton.style.backgroundColor = ""; // reset bg
}