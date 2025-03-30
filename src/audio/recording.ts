import * as Tone from 'tone';
import { getFormattedDateTimeForDownload, updateStatusMsg } from "../core/logging";
import { volumeNode } from '../components/instruSelect';

// recording
const startRecordButton = document.getElementById('start-record-button')!;
const stopRecordButton = document.getElementById('stop-record-button')!;
const playRecordButton = document.getElementById('play-record-button')!;
const saveRecordButton = document.getElementById('save-record-button')!;
const stopPlaybackButton = document.getElementById("stop-playback-button")!;

// recording
let mediaRecorder: any;
let audioChunks: any[] = [];
let hasRecording: boolean = false;
let isRecording: boolean = false;
let audio: any;
let audioUrl: any;

// ===========================================
// RECORDING
startRecordButton.addEventListener('pointerdown', startRecording);
stopRecordButton.addEventListener('pointerdown', stopRecording);
playRecordButton.addEventListener('pointerdown', playRecording);
saveRecordButton.addEventListener('pointerdown', saveRecording);
stopPlaybackButton.addEventListener('pointerdown', stopPlayback);

function startRecording() {
    if (mediaRecorder?.state === 'recording') {
        mediaRecorder.stop();
    }
    hasRecording = false;
    isRecording = true;
    startRecordButton.style.backgroundColor = "#F08080";
    audioChunks = [];
    const audioStream = Tone.getContext().createMediaStreamDestination();
    if (volumeNode) {
        volumeNode.connect(audioStream);
      } else {
        console.error('volumeNode is not initialized');
    }
    
    mediaRecorder = new MediaRecorder(audioStream.stream);
    mediaRecorder.ondataavailable = (e:any) => {
        audioChunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        audioUrl = URL.createObjectURL(audioBlob);
        audio = new Audio(audioUrl);
        hasRecording = true;
        isRecording = false;
        updateStatusMsg("Recording stopped!");
        startRecordButton.style.backgroundColor = "";
    };
    mediaRecorder.start();
    updateStatusMsg("Recording started...");
}

function stopRecording() {
    mediaRecorder.stop();
}

function playRecording() {
    if (hasRecording && audio) {
        playRecordButton.style.backgroundColor = "#F08080";
        audio.onended = () => {
            updateStatusMsg("Recording playback finished.");
            playRecordButton.style.backgroundColor = "";
        }
        audio.play();
        updateStatusMsg("Playing recording...");
    } else if (isRecording) {
        updateStatusMsg("There is a recording in progress! Cannot play!");
    } else {
        updateStatusMsg("No stored recording.");
    }
}

function stopPlayback() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        updateStatusMsg("Playback stopped.");
        playRecordButton.style.backgroundColor = "";
    }
}

function saveRecording() {
    updateStatusMsg("Saving recording...");
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `recording_${getFormattedDateTimeForDownload()}.wav`;
    link.click();
}