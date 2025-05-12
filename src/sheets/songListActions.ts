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
    updateStatusMsg(`renamed song "${songs[songID].name}". new name: "${newNameInput as string}"`);
    songs[songID].name = newNameInput as string;
    refreshSongVisuals();
}