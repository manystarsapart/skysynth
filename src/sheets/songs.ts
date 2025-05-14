import { updateStatusMsg } from "../core/logging";
import { states } from "../core/states";
import { refreshSongSelect } from "./sheetPlayer";
import { RecordedSong, Keypress, refreshSongVisuals } from "./transcribe";

export let songs: RecordedSong[] = [];
export let keypresses: Keypress[] = [];

document.getElementById('song-import')?.addEventListener('change', async (e) => {
    const input = e.target as HTMLInputElement;
    const importedVersNumbers:string[] = [];

    if (!input.files || input.files.length === 0) return;
  
    const file = input.files[0];
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        updateStatusMsg("Import failed: JSON must be an array of songs.");
        return;
      }
  
      let added = 0;
      for (const item of data) {
        if (
          typeof item === 'object' &&
          item !== null &&
          typeof item.name === 'string' &&
          Array.isArray(item.keypresses)
        ) {

          // stops duplicate ids & names. temp disabled 
        //   if (!songs.some(s => s.id === item.id && s.name === item.name)) {
            songs.push(item as RecordedSong);
            added++;
            if (!item.sheetVersion) {
              importedVersNumbers.push("old-v1"); // catch for old sheet ver
            } else {
              importedVersNumbers.push(item.sheetVersion);
            }
            states.lastTranscribedSongID++;
        //   }
        }
      }
  
      refreshSongVisuals();
      updateStatusMsg(`Imported ${added} new song(s). Imported sheet version: ${importedVersNumbers}
        \nCurrent App version: ${states.skysynthSheetVersion}`);
    } catch (err) {
      updateStatusMsg("Failed to import: Invalid JSON file.");
      console.error(err);
    }

    refreshSongSelect();
  });
  