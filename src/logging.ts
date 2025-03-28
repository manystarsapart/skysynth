let messageLog: string[] = []; // past: messages
const messageLogDiv = document.getElementById("status-div")!; // past: statusDiv
const clearStatusButton = document.getElementById("clear-status-button")!; 

let noteHistory: string[] = [];
const notesLogDiv = document.getElementById("notes-div")!; // past: notesDiv
const clearNoteHistoryButton = document.getElementById("clear-note-history-button")!;


// ===========================================
// LOGGING: STATUS DIV

export function updateStatusMsg(message:string) {
    const now: Date = new Date(Date.now());
    const formattedTime: string = now.toLocaleString();
    messageLog.push(`${message} | Time: ${formattedTime}`);
    if (messageLog.length > 50) {
        messageLog.shift();
    } 
    const status: string = messageLog.join('<br>');
    messageLogDiv.innerHTML = status;
    messageLogDiv.scrollTop = messageLogDiv.scrollHeight;
}

clearStatusButton.addEventListener("pointerdown", () => {
    messageLog = [];
    messageLogDiv.innerHTML = "";
});

export function updateNoteHistory(note:number, cumulativeKeypress:number) {
    noteHistory.push(`${midiToSPN(note)} | ${cumulativeKeypress+1}`);
    if (noteHistory.length > 20) {
        noteHistory.shift();
    } 
    const noteHistoryContent: string = noteHistory.join('<br>');
    notesLogDiv.innerHTML = noteHistoryContent;
    notesLogDiv.scrollTop = notesLogDiv.scrollHeight;
}

function midiToSPN(midiNumber:number) {
    const noteNames: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
    const noteIndex: number = midiNumber % 12;
    const octave: number = Math.floor((midiNumber) / 12) - 1;
    return noteNames[noteIndex] + octave;
}

clearNoteHistoryButton.addEventListener("pointerdown", () => {
    // clears note history
    noteHistory = [];
    notesLogDiv.innerHTML = "";
})