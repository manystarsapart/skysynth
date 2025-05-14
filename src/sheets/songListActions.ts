import { updateStatusMsg } from "../core/logging";
import { states } from "../core/states";
import { stopSong } from "./sheetPlayer";
import { songs } from "./songs";
import { refreshSongVisuals } from "./transcribe";

// ==========
// DELETE SONG

export function deleteSongFromList(songID:number) {
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

// ==========
// RENAME SONG

export function renameSong(songID:number) {
    let newNameInput: string | null = prompt(`Current name is "${songs[songID].name}". New name: `, songs[songID].name);
    const newName = newNameInput ? newNameInput : songs[songID].name;
    if (newNameInput) {
        updateStatusMsg(`renamed song "${songs[songID].name}". new name: "${newName}"`);
    } else {
        updateStatusMsg(`aborted renaming of song "${songs[songID].name}"`);
    }

    songs[songID].name = newName;
    refreshSongVisuals();
}

// ==========
// SHIFT SONG

export function shiftSongUpOne(songID: number) {
    if (songID <= 0 || songID >= songs.length) {
        updateStatusMsg("cannot move song up!");
        return;
    }

    [songs[songID - 1], songs[songID]] = [songs[songID], songs[songID - 1]];

    songs[songID - 1].id = songID - 1;
    songs[songID].id = songID;
    updateStatusMsg(`moved "${songs[songID - 1].name}" up`);
    refreshSongVisuals();
}

export function shiftSongDownOne(songID: number) {
    if (songID < 0 || songID >= songs.length - 1) {
        updateStatusMsg("cannot move song down!");
        return;
    }

    [songs[songID], songs[songID + 1]] = [songs[songID + 1], songs[songID]];

    songs[songID].id = songID;
    songs[songID + 1].id = songID + 1;
    updateStatusMsg(`moved "${songs[songID].name}" down`);
    refreshSongVisuals();
}