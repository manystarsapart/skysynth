import { updateStatusMsg } from "../core/logging";
import { refreshSongSelect } from "./sheetPlayer";
import { RecordedSong, Keypress, updateTranscribeModal } from "./transcribe";

export let songs: RecordedSong[] = [];
export let keypresses: Keypress[] = [];

document.getElementById('song-import')?.addEventListener('change', async (e) => {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
  
    const file = input.files[0];
    try {
      const text = await file.text();
      const data = JSON.parse(text);
  
      // validate: must be an array and each element must look like a RecordedSong
      if (!Array.isArray(data)) {
        updateStatusMsg("Import failed: JSON must be an array of songs.");
        return;
      }
  
      let added = 0;
      for (const item of data) {
        // basic type check for now
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
        //   }
        }
      }
  
      updateTranscribeModal();
      updateStatusMsg(`Imported ${added} new song(s).`);
    } catch (err) {
      updateStatusMsg("Failed to import: Invalid JSON file.");
      console.error(err);
    }

    // refresh songlist
    refreshSongSelect();
  });
  