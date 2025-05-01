import * as Tone from 'tone';
import { states } from "../core/states";
import { RecordedSong } from './transcribe';
import { updateStatusMsg } from '../core/logging';
import { songs } from './songs';

// TODO: IMPORT SONG LOGIC

// I AM GOING TO USE THE TRANSCRIBED SONG DURING THE SESSION. NO IMPORT YET

const playTranscribedButton = document.getElementById("play-transcription-button")!;


playTranscribedButton.addEventListener("pointerdown", () => {playSong(songs[states.songIDToPlay])})

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

  if (currentPart) {
    currentPart.stop();
    currentPart.dispose();
    currentPart = null;
  }
}


transcribeSelection.addEventListener('input', (e:any) => {
    const selectedID = parseInt(e.target.value);
    states.songIDToPlay = selectedID;
    updateStatusMsg("selected song to play: " + selectedID);
});

let currentPart: Tone.Part | null = null;

async function playSong(song: RecordedSong) {
  const context = Tone.getContext();
  const transport = Tone.getTransport();

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

  const noteEvents: Array<[number, { MIDI: number, isKeyDown: boolean, semitonePlusOne: boolean }]> = [];

  for (const keypress of song.keypresses) {
    if (keypress.isNote && keypress.note) {
      noteEvents.push([
        keypress.time / 1000,
        {
          MIDI: keypress.note.MIDI,
          isKeyDown: keypress.note.isKeyDown,
          semitonePlusOne: keypress.note.semitonePlusOne
        }
      ]);
    }
  }

  const part = new Tone.Part((time, value) => {
    const noteFreq = Tone.Frequency(value.MIDI, "midi");
    const noteFreqPlusOne = Tone.Frequency(value.MIDI+1, "midi");
    if (value.isKeyDown) {
      // console.log(`attack: ${value.MIDI}`);
      states.currentInstrument.triggerAttack(noteFreq, time);
    } else {
      // console.log(`release: ${value.MIDI}`);
      if (!value.semitonePlusOne) states.currentInstrument.triggerRelease(noteFreq, time);
      else states.currentInstrument.triggerRelease(noteFreqPlusOne, time);
    }
  }, noteEvents);

  part.start(0);
  transport.start();

  currentPart = part;

  return part;
}


