let messageLog: string[] = []; // past: messages
const messageLogDiv = document.getElementById("message-log-div")!; // past: statusDiv
const latestMessageDiv = document.getElementById("latest-message-div")!;
const clearStatusButton = document.getElementById("clear-status-button")!; 

let noteHistory: string[] = [];
const notesLogDiv = document.getElementById("notes-div")!; // past: notesDiv
const latestNoteDiv = document.getElementById("latest-note-div")!;
const clearNoteHistoryButton = document.getElementById("clear-note-history-button")!;


// ===========================================
// LOGGING: STATUS DIV

export const getFormattedDateTimeForDownload = (): string => {
    const now = new Date();
  
    const formattedDateTime = now.toLocaleString('default', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // 24h format
    })
    // filename safe characters
    .replace(/[/:]/g, '-')  
    .replace(/, /g, '_')    
    .replace(/ /g, '_');  
  
    return formattedDateTime;
  };


export function updateStatusMsg(message:string) {
    const now: Date = new Date(Date.now());
    const formattedTime: string = now.toLocaleString();
    messageLog.push(`${message}<br>Time: ${formattedTime}`);
    if (messageLog.length > 50) {
        messageLog.shift();
    } 
    const status: string = messageLog.join('<br>');
    messageLogDiv.innerHTML = status;
    messageLogDiv.scrollTop = messageLogDiv.scrollHeight;
    latestMessageDiv.innerHTML = messageLog[messageLog.length-1];
    console.log(message);
}

clearStatusButton.addEventListener("pointerdown", () => {
    messageLog = [];
    messageLogDiv.innerHTML = "";
});

export function updateNoteHistory(note:number, cumulativeKeypress:number) {
    noteHistory.push(`${midiToSPN(note)} (#${cumulativeKeypress+1})`);
    if (noteHistory.length > 20) {
        noteHistory.shift();
    } 
    const noteHistoryContent: string = noteHistory.join('<br>');
    notesLogDiv.innerHTML = noteHistoryContent;
    notesLogDiv.scrollTop = notesLogDiv.scrollHeight;
    latestNoteDiv.innerHTML = `${midiToSPN(note)} (Note #${cumulativeKeypress+1})`
}

function midiToSPN(midiNumber:number) {
    const noteNames: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
    const noteIndex: number = midiNumber % 12;
    const octave: number = Math.floor((midiNumber) / 12) - 1;
    return noteNames[noteIndex] + octave;
}

export function midiToNote(midiNumber:number) {
    const noteNames: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
    const noteIndex: number = midiNumber % 12;
    return noteNames[noteIndex];
}

export function midiToOctave(midiNumber:number) {
    const octave: number = Math.floor((midiNumber) / 12) - 1;
    return octave;
}

clearNoteHistoryButton.addEventListener("pointerdown", () => {
    // clears note history
    noteHistory = [];
    notesLogDiv.innerHTML = "";
})