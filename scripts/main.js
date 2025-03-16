// ===============================================
// import { updateOnUnload } from "./auth.js";
// // const { freemem } = require("os");

// import { initializeApp } from "firebase/app";
// // import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
// import { getFirestore, doc, setDoc } from "firebase/firestore/lite";

// i am using CDN links here because i have yet to use a bundler
// how do you use a bundler

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js'
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js'
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js'


const firebaseConfig = {
    // no need for secrets
    apiKey: "AIzaSyCgiE5ApD5dSnUI2gZKGWjPR4yQc_-BXP4",
    authDomain: "skysynth-c537d.firebaseapp.com",
    projectId: "skysynth-c537d",
    storageBucket: "skysynth-c537d.firebasestorage.app",
    messagingSenderId: "294068589398",
    appId: "1:294068589398:web:6d45ea54f5bf937b35fcf7"
};


const app = initializeApp(firebaseConfig);

// // TODO: APPCHECK
// const appCheck = initializeAppCheck(app, {
//     provider: new ReCaptchaV3Provider('6LdjZOYqAAAAALIvUr25lZxVSgJ-wPJSYSUAQGWI'),
//     isTokenAutoRefreshEnabled: true
//   });



// ===============================================
// responsive js for website

document.addEventListener("DOMContentLoaded", () => {

    // getting from DOM & assigning variables
    let messages = [];
    let noteHistory = [];
    let transposeValue = 0;
    let stopAudioWhenReleased = false;
    const statusDiv = document.getElementById("status-div");
    const notesDiv = document.getElementById("notes-div");
    const transposeValueBox = document.getElementById("transpose-value");
    const scaleValueBox = document.getElementById("scale-value");
    const scaleValueBox2 = document.getElementById("scale-value-2");
    const octaveValueBox = document.getElementById("octave-value");
    const clearStatusButton = document.getElementById("clear-status-button");
    const clearNoteHistoryButton = document.getElementById("clear-note-history-button")
    const stopAudioWhenReleasedButton = document.getElementById("stop-audio-when-released-button");
    const shiftIndicator = document.getElementById("shift-indicator");
    const activeKeyTimeouts = new Map();

    let globalStartTime = Date.now();

    // ===========================================
    // LOGIN

    const auth = getAuth();
    const db = getFirestore();

    let user = null;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            // sign in
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            user = userCredential.user;

        } catch (error) {
            console.error("error in login:", error);
            // TODO: need to display error handling for specific errors?
        }
      });

    async function updateOnUnload() {
        const user = auth.currentUser; 

        if (user) {
            console.log('updating db on unload...');
            const userDoc = doc(db, 'users', user.uid);

            try {
                const docSnap = getDoc(userDoc);
                const dbData = docSnap.data();
                // get localstorage
                const localTotalWaterReward = parseInt(localStorage.getItem('totalWaterReward')) || 0;
                const localSavedWaterLevel = parseInt(localStorage.getItem('savedWaterLevel')) || 0;
                const localCumulativeKeypress = parseInt(localStorage.getItem('cumulativeKeypress')) || 0;
                const localCumulativeTime = parseInt(localStorage.getItem('cumulativeTime')) || 0;

                // compare for max
                const newtotalWaterReward = Math.max(dbData.totalWaterReward, localTotalWaterReward);
                const newSavedWaterLevel = Math.max(dbData.savedWaterLevel, localSavedWaterLevel);
                const newCumulativeKeypress = Math.max(dbData.cumulativeKeypress, localCumulativeKeypress);
                const newCumulativeTime = Math.max(dbData.cumulativeTime, localCumulativeTime);

                // update firestore
                await updateDoc(userDoc, {
                totalWaterReward: newtotalWaterReward,
                savedWaterLevel: newSavedWaterLevel,
                cumulativeKeypress: newCumulativeKeypress,
                cumulativeTime: newCumulativeTime
                });

                // globalStartTime = Date.now();

                console.log('firestore updated');
            } 
            catch (error) {
                console.error('error updating firestore', error);
            }
        }
    }

    // ===========================================
    // LOG OUT

    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener('click', () => auth.signOut())
        


    // //
    // if (user) {
    //     console.log('user is logged in:', user);
        
    //     try {
    //     const userDoc = doc(db, "users", user.uid);
    //     const docSnap = getDoc(userDoc);

    //     document.getElementById('logout-button').style.display = 'block';
    //     document.getElementById('login-form').style.display = 'none';
    //     document.getElementById('signup-form').style.display = 'none';

    //     if (docSnap.exists()) {
    //         const dbData = docSnap.data();
            
    //         // get localstorage
    //         const localTotalWaterReward = parseInt(localStorage.getItem('totalWaterReward')) || 0;
    //         const localSavedWaterLevel = parseInt(localStorage.getItem('savedWaterLevel')) || 0;
    //         const localCumulativeKeypress = parseInt(localStorage.getItem('cumulativeKeypress')) || 0;
    //         const localCumulativeTime = parseInt(localStorage.getItem('cumulativeTime')) || 0;

    //         // compare for max
    //         const newtotalWaterReward = Math.max(dbData.totalWaterReward, localTotalWaterReward);
    //         const newSavedWaterLevel = Math.max(dbData.savedWaterLevel, localSavedWaterLevel);
    //         const newCumulativeKeypress = Math.max(dbData.cumulativeKeypress, localCumulativeKeypress);
    //         const newCumulativeTime = Math.max(dbData.cumulativeTime, localCumulativeTime);

    //         // update firestore
    //         updateDoc(userDoc, {
    //         totalWaterReward: newtotalWaterReward,
    //         savedWaterLevel: newSavedWaterLevel,
    //         cumulativeKeypress: newCumulativeKeypress,
    //         cumulativeTime: newCumulativeTime
    //         });

    //         // update localStorage
    //         localStorage.setItem('totalWaterReward', newtotalWaterReward);
    //         totalWaterReward = newtotalWaterReward;
    //         waterRewardDisplay.textContent = totalWaterReward;
    //         // ===
    //         localStorage.setItem('savedWaterLevel', newSavedWaterLevel);
    //         currentWaterLevel = newSavedWaterLevel
    //         if (currentWaterLevel >= maxWaterLevel) {
    //             triggerWaterReward();
    //             currentWaterLevel = 0;
    //         }
    //         localStorage.setItem("savedWaterLevel", currentWaterLevel.toString());
    //         waterLevelDisplay.textContent = `${currentWaterLevel} / ${maxWaterLevel}`;
    //         updateWaterMaskPosition();
    //         // ===
    //         localStorage.setItem('cumulativeKeypress', newCumulativeKeypress);
    //         cumulativeKeypress = newCumulativeKeypress;
    //         cumKeypressBox.textContent = newCumulativeKeypress;
    //         // ===
    //         localStorage.setItem('cumulativeTime', newCumulativeTime);

    //     } else {

    //         // create document if document does not exist
    //         setDoc(userDoc, {
    //         totalWaterReward: parseInt(localStorage.getItem('totalWaterReward')) || 0,
    //         savedWaterLevel: parseInt(localStorage.getItem('savedWaterLevel')) || 0,
    //         cumulativeKeypress: parseInt(localStorage.getItem('cumulativeKeypress')) || 0,
    //         cumulativeTime: parseInt(localStorage.getItem('cumulativeTime')) || 0,
    //         email: user.email,
    //         createdAt: new Date()
    //         });
    //     }
    //     } catch (error) {
    //     console.error('error syncing data:', error);
    //     }
    // } else {
    //     console.log('user is logged out');
    //     document.getElementById('logout-button').style.display = 'none';
    //     document.getElementById('login-form').style.display = 'block';
    //     document.getElementById('signup-form').style.display = 'block';
    // }


    // ===========================================
    // SIGN UP

    document.getElementById("signup-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const signUpEmail = document.getElementById("signup-email").value;
        const signUpPassword = document.getElementById("signup-password").value; 
        const displayName = document.getElementById("signup-display-name").value;

        try {
            // create user account
            const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
            const user = userCredential.user;

            // update localstorage into db
            const userData = {
                displayName: displayName,
                totalWaterReward: parseInt(localStorage.getItem('totalWaterReward')) || 0,
                savedWaterLevel: parseInt(localStorage.getItem('savedWaterLevel')) || 0,
                cumulativeKeypress: parseInt(localStorage.getItem('cumulativeKeypress')) || 0,
                cumulativeTime: parseInt(localStorage.getItem('cumulativeTime')) || 0,

            };

            // create user document
            await setDoc(doc(db, "users", user.uid), {
                ...userData,
                email: user.email,
                createdAt: new Date()
            });

            console.log("created user");

        } catch (error) {
            console.error("error in signup:", error);
            // TODO: need to display error handling for specific errors?
        }
    })

    // ===========================================
    // MODAL OVERLAY

    const accountButton = document.getElementById("account-button");
    const modalOverlay = document.getElementById("modal-overlay");
    const closeModalButton = document.getElementById("close-modal");
    const mainContent = document.getElementById("main-content");

    accountButton.addEventListener('click', () => toggleModal(true));
    closeModalButton.addEventListener('click', () => toggleModal(false));

    function toggleModal(show) {
        if (show) {
            mainContent.classList.add("pointer-events-none", "opacity-50");

            modalOverlay.classList.remove("hidden");
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        } else {
            mainContent.classList.remove("pointer-events-none", "opacity-50");

            modalOverlay.classList.add("hidden");
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);
        }
    }

    // ===========================================
    // DETECT FOR LOGIN

    onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log('user is logged in:', user);
        
        try {
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);

        document.getElementById('logout-button').style.display = 'block';
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('signup-form').style.display = 'none';

        if (docSnap.exists()) {
            const dbData = docSnap.data();
            
            // get localstorage
            const localTotalWaterReward = parseInt(localStorage.getItem('totalWaterReward')) || 0;
            const localSavedWaterLevel = parseInt(localStorage.getItem('savedWaterLevel')) || 0;
            const localCumulativeKeypress = parseInt(localStorage.getItem('cumulativeKeypress')) || 0;
            const localCumulativeTime = parseInt(localStorage.getItem('cumulativeTime')) || 0;

            // compare for max
            const newtotalWaterReward = Math.max(dbData.totalWaterReward, localTotalWaterReward);
            const newSavedWaterLevel = Math.max(dbData.savedWaterLevel, localSavedWaterLevel);
            const newCumulativeKeypress = Math.max(dbData.cumulativeKeypress, localCumulativeKeypress);
            const newCumulativeTime = Math.max(dbData.cumulativeTime, localCumulativeTime);

            // update firestore
            await updateDoc(userDoc, {
            totalWaterReward: newtotalWaterReward,
            savedWaterLevel: newSavedWaterLevel,
            cumulativeKeypress: newCumulativeKeypress,
            cumulativeTime: newCumulativeTime
            });

            // update localStorage
            localStorage.setItem('displayName', dbData.displayName);
            const displayNameBox = document.getElementById("display-name-box");
            displayNameBox.textContent = dbData.displayName;

            localStorage.setItem('totalWaterReward', newtotalWaterReward);
            totalWaterReward = newtotalWaterReward;
            waterRewardDisplay.textContent = totalWaterReward;
            // ===
            localStorage.setItem('savedWaterLevel', newSavedWaterLevel);
            currentWaterLevel = newSavedWaterLevel
            if (currentWaterLevel >= maxWaterLevel) {
                triggerWaterReward();
                currentWaterLevel = 0;
            }
            localStorage.setItem("savedWaterLevel", currentWaterLevel.toString());
            waterLevelDisplay.textContent = `${currentWaterLevel} / ${maxWaterLevel}`;
            updateWaterMaskPosition();
            // ===
            localStorage.setItem('cumulativeKeypress', newCumulativeKeypress);
            cumulativeKeypress = newCumulativeKeypress;
            cumKeypressBox.textContent = newCumulativeKeypress;
            // ===
            localStorage.setItem('cumulativeTime', newCumulativeTime);

        } else {

            // create document if document does not exist
            await setDoc(userDoc, {
            totalWaterReward: parseInt(localStorage.getItem('totalWaterReward')) || 0,
            savedWaterLevel: parseInt(localStorage.getItem('savedWaterLevel')) || 0,
            cumulativeKeypress: parseInt(localStorage.getItem('cumulativeKeypress')) || 0,
            cumulativeTime: parseInt(localStorage.getItem('cumulativeTime')) || 0,
            email: user.email,
            createdAt: new Date()
            });
        }
        } catch (error) {
        console.error('error syncing data:', error);
        }
    } else {
        console.log('user is logged out');
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('signup-form').style.display = 'block';
    }
    });


    // ===========================================
    // MENU TOGGLE

    const navbar = document.getElementById("navbar");
    const menuTitle = document.getElementById("menu-title");
    const navContent = navbar.querySelectorAll("li > div");
    const acknowledgements = document.getElementById("acknowledgements");

    function toggleMenu() {
        navbar.classList.toggle("w-[400px]");
        navbar.classList.toggle("hover:w-[400px]");
        menuTitle.classList.toggle("hidden");
        menuTitle.classList.toggle("group-hover:block");
        navContent.forEach(div => {
            div.classList.toggle("hidden");
            div.classList.toggle("group-hover:block");
        });
        acknowledgements.classList.toggle("hidden");
        acknowledgements.classList.toggle("group-hover:block");
    }

    // ===========================================
    // WATER COLLECTION

    let currentWaterLevel = parseInt(localStorage.getItem("savedWaterLevel")) || 0;
    let totalWaterReward = parseInt(localStorage.getItem("totalWaterReward")) || 0;
    const waterLevelDisplay = document.getElementById("water-level-display");
    const waterRewardDisplay = document.getElementById("water-reward-display");
    const waterMask = document.getElementById("water-mask");
    const maxWaterLevel = 500;
    
    // Initialize display and water position
    waterLevelDisplay.textContent = `${currentWaterLevel} / ${maxWaterLevel}`;
    waterRewardDisplay.textContent = totalWaterReward;
    updateWaterMaskPosition();
    
    function triggerWaterReward() {
        totalWaterReward = parseInt(localStorage.getItem("totalWaterReward"));
        updateStatusMsg("Triggered water reward!");
        totalWaterReward++;
        localStorage.setItem("totalWaterReward", totalWaterReward.toString());
        waterRewardDisplay.textContent = totalWaterReward;
        // alert("Water reward! wooooo");
    }
    
    function incrementWater() {
        currentWaterLevel = parseInt(localStorage.getItem("savedWaterLevel"));
        currentWaterLevel++;
        
        if (currentWaterLevel >= maxWaterLevel) {
            triggerWaterReward();
            currentWaterLevel = 0;
        }
        
        localStorage.setItem("savedWaterLevel", currentWaterLevel.toString());
        waterLevelDisplay.textContent = `${currentWaterLevel} / ${maxWaterLevel}`;
        updateWaterMaskPosition();
    }
    
    function updateWaterMaskPosition() {
        // Calculate percentage from top (0% = full, 100% = empty)
        const topPercentage = (1 - currentWaterLevel / maxWaterLevel) * 100;
        waterMask.style.top = `${topPercentage.toFixed(2)}%`;
    }


    // ===========================================
    // TURNING OFF THE LIGHTS

    const lightSwitch = document.getElementById("light-switch");
    const staticBackground = document.getElementById("static-background");
    let currentLightsOn = true; 
    function toggleLights() {
        if (currentLightsOn) {
            currentLightsOn = false;
            staticBackground.classList.replace("brightness-110", "brightness-0");
            lightSwitch.style.backgroundColor = "#F08080";
            waterMask.style.display = "none";
            updateStatusMsg("Lights out!");
            toggleVGWhiteBg();
        }
        else {
            currentLightsOn = true;
            staticBackground.classList.replace("brightness-0", "brightness-110");
            lightSwitch.style.backgroundColor = "#588157";
            waterMask.style.display = "block";
            updateStatusMsg("Lights back on!");
            toggleVGWhiteBg();
        }
    }

    lightSwitch.addEventListener("click", (e) => {
        toggleLights();
    })

    // ===========================================
    // TOGGLE WHITE BACKGROUND ON VISUAL GUIDE

    function toggleVGWhiteBg() {
        let visualGuideChildrenL = document.getElementById("notes-div-left").children;
        let visualGuideChildrenR = document.getElementById("notes-div-right").children;
        shiftIndicator.classList.toggle("bg-white/80");
        for (let i=0; i<visualGuideChildrenL.length; i++) {
            visualGuideChildrenL[i].classList.toggle("bg-white/80");
        }
        for (let i=0; i<visualGuideChildrenR.length; i++) {
            visualGuideChildrenR[i].classList.toggle("bg-white/80");
        }
    }

    // ===========================================
    // KEYBOARD SELECTION
    
    const keyboardSelection = document.getElementById("keyboard-selection");
    const keyboards = [
        "Double Keyboard (Recom.)",
        "Single Keyboard - Low",
        "Single Keyboard - High"
    ]

    // dynamically update select elements
    for (var i = 0; i < keyboards.length; i++) {
        keyboardSelection.appendChild(
            Object.assign(
                document.createElement("option"),
                { value: i, innerHTML: keyboards[i] }
            )
        );
    }

    keyboardSelection.addEventListener("input", (e) => {
        const selectedID = parseInt(e.target.value); 
        switch (selectedID) {
            case 0: // double
                letterMap = dbLetterMap;
                updateStatusMsg("current: doublekeyboard");
                break;
            case 1: // single low
                letterMap = sgLetterMap1;
                updateStatusMsg("current: single keyboard (low)");
                break;
            case 2: // single high
                letterMap = sgLetterMap2;
                updateStatusMsg("current: single keyboard (high)");
                break;
        }
    });

    // ===========================================
    // RECORDING FUNCTIONALITY

    let mediaRecorder;
    let audioChunks = [];
    let hasRecording = false;
    let isRecording = false;
    let audio;
    let audioUrl;
    
    const startRecordButton = document.getElementById('start-record-button');
    const stopRecordButton = document.getElementById('stop-record-button');
    const playRecordButton = document.getElementById('play-record-button');
    const saveRecordButton = document.getElementById('save-record-button');
    const stopPlaybackButton = document.getElementById("stop-playback-button");
    // const clearRecordButton = document.getElementById('clear-record-button');
    
    startRecordButton.addEventListener('click', startRecording);
    stopRecordButton.addEventListener('click', stopRecording);
    playRecordButton.addEventListener('click', playRecording);
    saveRecordButton.addEventListener('click', saveRecording);
    stopPlaybackButton.addEventListener('click', stopPlayback)
    // clearRecordButton.addEventListener('click', clearRecording);
    
    function startRecording() {
        if (isRecording) {
            updateStatusMsg("Recording already in progress!");
            return;
        }
        hasRecording = false;
        isRecording = true;
        startRecordButton.style.backgroundColor = "#F08080";
        audioChunks = [];
        const audioStream = Tone.context.createMediaStreamDestination();
        volumeNode.connect(audioStream);
        
        mediaRecorder = new MediaRecorder(audioStream.stream);
        mediaRecorder.ondataavailable = (e) => {
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
            // TODO: something is wrong here. i forgot what i was going to fix
            // i will come back to fixing this later
        };
        mediaRecorder.start();
        updateStatusMsg("Recording started...");
    }
    
    function stopRecording() {
        mediaRecorder.stop();
    }
    
    function playRecording() {
        if (hasRecording && audio) {
            audio.onended = () => {
                updateStatusMsg("Recording playback finished.");
            }
            audio.play();
            updateStatusMsg("Playing recording...");
        } else if (isRecording) {
            updateStatusMsg("There is a recording in progress! Cannot play!");
        } else {
            updateStatusMsg("No stored recording.");
        }
    }

    // TODO: ADD STOP PLAYBACK BUTTON
    function stopPlayback() {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            updateStatusMsg("Playback stopped.");
        }
    }

    function saveRecording() {
        updateStatusMsg("Saving recording...");
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = 'recording.wav';
        link.click();
    }

    // function clearRecording() {
    //     // THIS IS BENCHED UNTIL FURTHER ACTION BECAUSE THE CLEAR BUTTON ALSO CLEARS EVERY AUDIO THING
    //     // I WILL FIX THIS SOON
    //     hasRecording = false;
    //     audioChunks = [];
    //     if (audio) {
    //         audio.pause();
    //         audio.src = '';
    //         audio.removeAttribute('src');
    //         audio = null;
    //     }
    //     if (audioUrl) {
    //         URL.revokeObjectURL(audioUrl);
    //         audioUrl = null;
    //     }
    //     updateStatusMsg("Recording cleared!");
    // }

    // ===========================================
    // MAPS FOR KEY --- MIDINOTE

    updateStatusMsg("Initialised!");
    
    // for double music pad
    const dbLetterMap = {
        'q': 48, 'w': 50, 'e': 52, 'r': 53, 't': 55,
        'a': 57, 's': 59, 'd': 60, 'f': 62, 'g': 64,
        'z': 65, 'x': 67, 'c': 69, 'v': 71, 'b': 72,
        'y': 60, 'u': 62, 'i': 64, 'o': 65, 'p': 67,
        'h': 69, 'j': 71, 'k': 72, 'l': 74, ';': 76,
        'n': 77, 'm': 79, ',': 81, '.': 83, '/': 84,
    };

    // for singular (low) music pad
    const sgLetterMap1 = {
        'q': 36, 'w': 38, 'e': 40, 'r': 41, 't': 43,
        'a': 45, 's': 47, 'd': 48, 'f': 50, 'g': 52,
        'z': 53, 'x': 55, 'c': 57, 'v': 59, 'b': 60,
    };

    // for singular (high) music pad
    const sgLetterMap2 = {
        'q': 60, 'w': 62, 'e': 64, 'r': 65, 't': 67,
        'a': 69, 's': 71, 'd': 72, 'f': 74, 'g': 76,
        'z': 77, 'x': 79, 'c': 81, 'v': 83, 'b': 84,
    };

    // for keys pressed to initiate transposing
    const pitchMap = {
        '`': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, 
        '6': 6, '7': 7, '8': 8, '9': 9, '0':10, '-': 11, 
        '=': 12
    };

    // shows exact scale of tranposed key
    // JUST FOR VISUAL GUIDE
    // note that this is separate because pitchMap values are the ones used in the midiNotes
    const transposeMap = {
        '0': "C", 
        '1': "C#",
        '2': "D", 
        '3': "D#",
        '4': "E", 
        '5': "F", 
        '6': "F#",
        '7': "G", 
        '8': "G#",
        '9': "A", 
        '10': "Bb",
        '11': "B", 
        '12': "C"
    };


    // ===========================================
    // OCTAVE CHANGE

    let lastPressedTransposeKey = "`";
    // ` 1 2 3 4 5 6 7 8 9 0 - =
    let octave = 0;
    let octaveAdjustment = 0;

    function octaveUp() {
        if (octave >= 3) {
            updateStatusMsg("Already at maximum octave!");
            return;
        }
        octave++;
        octaveAdjustment += 12;
        octaveValueBox.innerHTML = octave;
        updateStatusMsg(`Octave shift updated to: ${octave}`);
        updateVisualGuide(lastPressedTransposeKey);
    }

    function octaveDown() {
        if (octave <= -2) {
            updateStatusMsg("Already at minimum octave!");  
            return;
        }
        octave--;
        octaveAdjustment -= 12;
        octaveValueBox.innerHTML = octave; 
        updateStatusMsg(`Octave shift updated to: ${octave}`);
        updateVisualGuide(lastPressedTransposeKey); 
    }

    // ===========================================
    // FOR VISUAL GUIDE FOR NOTE NAMES

    const notesDivL = document.getElementById("notes-div-left");
    const notesDivR = document.getElementById("notes-div-right")

    let realOctaveLeft = octave + 3;
    let realOctaveRight = realOctaveLeft + 1;

    const mapNumbersToNotesOctaves = {
        'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        'C#': ['C#', 'D#', 'F', 'F#', 'G#', 'Bb', 'C'],
        'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
        'D#': ['D#', 'F', 'G', 'G#', 'Bb', 'C', 'D'],
        'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
        'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
        'F#': ['F#', 'G#', 'Bb', 'B', 'C#', 'D#', 'F'],
        'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
        'G#': ['G#', 'Bb', 'C', 'C#', 'D#', 'F', 'G'],
        'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
        'Bb': ['Bb', 'C', 'D', 'D#', 'F', 'G', 'A'],
        'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'Bb']
    };

    const preserveKeyIDLeft = {
        '0':'q', '1':'w', '2':'e', '3':'r', '4':'t', 
        '5':'a', '6':'s', '7':'d', '8':'f', '9':'g', 
        '10':'z', '11':'x', '12':'c', '13':'v', '14':'b'
    };

    const preserveKeyIDRight = {
        '0':'y', '1':'u', '2':'i', '3':'o', '4':'p',
        '5':'h', '6':'j', '7':'k', '8':'l', '9':';',
        '10':'n', '11':'m', '12':',', '13':'.', '14':'/'
    };

    const mapNumbersToNotesMapping = [
        [1, 2, 3, 4, 5],
        [6, 7, 1, 2, 3],
        [4, 5, 6, 7, 8]
    ];

    function mapNumbersToNotes(currentKey, leftright) {    
        realOctaveLeft = octave + 2;
        realOctaveRight = realOctaveLeft + 1;
        const keyNotes = mapNumbersToNotesOctaves[currentKey];
        const octaveBase = leftright === 0 ? realOctaveLeft : realOctaveRight;
        const mappingFlattened = mapNumbersToNotesMapping.flat();
        let countC = 0;
        let keyIDcount = 0;
        const elements = mappingFlattened.map(num => {
            keyIDcount++;
            const isC = (num - 1) % 7 === 0;
            if (isC) countC++;
            const noteIndex = (num - 1) % 7;
            const note = keyNotes[noteIndex];
            const currentOctave = octaveBase + (countC - 1);
            if (leftright == 0) {
                return `<div id="${preserveKeyIDLeft[keyIDcount-1]}" class="flex flex-col items-center justify-center p-2 rounded-4xl border-3 text-center h-30 w-30 relative bg-white/80">
                    <div>
                    ${note}<sub class="text-lg">${currentOctave}</sub>
                    </div>
                    <span class="text-2xl">${preserveKeyIDLeft[keyIDcount-1].toUpperCase()}</span>
                </div>`;
            } else {
                return `<div id="${preserveKeyIDRight[keyIDcount-1]}" class="flex flex-col items-center justify-center p-2 rounded-4xl border-3 text-center h-30 w-30 relative bg-white/80">
                <div>
                    ${note}<sub class="text-lg">${currentOctave}</sub>
                </div>
                <span class="text-2xl">${preserveKeyIDRight[keyIDcount-1].toUpperCase()}</span>
                </div>`;
            }
        });
        // console.log(elements);
        return elements.join('');
    }

    // ^^^ THIS FUNCTION WAS IMPROVED BY DEEPSEEK R1 TO HELP DISPLAY EACH OCTAVES NUMBER CORRECTLY
    // ALL HAIL OUR AI OVERLORDS

    function updateVisualGuide(key) {
        notesDivL.innerHTML = mapNumbersToNotes(transposeMap[pitchMap[key]], 0);
        notesDivR.innerHTML = mapNumbersToNotes(transposeMap[pitchMap[key]], 1);
        if (!currentLightsOn) {
            toggleVGWhiteBg();
            if (shiftIndicator.classList.contains("bg-white/80")) {
                shiftIndicator.classList.toggle("bg-white/80");
            }
        }
    }

    // ===========================================
    // CUMULATIVE NOTES PLAYED

    const cumKeypressBox = document.getElementById("cum-keypress");
    let cumulativeKeypress = parseInt(localStorage.getItem("cumulativeKeypress")) || 0;
    cumKeypressBox.textContent = cumulativeKeypress;
    function incrementCumKeypress() { // logs each time a key is pressed
        cumulativeKeypress = parseInt(localStorage.getItem("cumulativeKeypress"));
        cumulativeKeypress++; 
        cumKeypressBox.textContent = cumulativeKeypress;
        localStorage.setItem("cumulativeKeypress", cumulativeKeypress.toString());
    }
    
    // ===========================================
    // CUMULATIVE TIME SPENT

    const cumTimeBox = document.getElementById("cum-time");
    let cumulativeTime = parseInt(localStorage.getItem("cumulativeTime")) || 0;
    cumTimeBox.textContent = formatTime(cumulativeTime);

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // start timer
    const interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - globalStartTime) / 1000); // to seconds
        cumulativeTime += elapsedTime;
        globalStartTime = currentTime; 
        cumTimeBox.textContent = formatTime(cumulativeTime);
        localStorage.setItem("cumulativeTime", cumulativeTime.toString());
    }, 1000); // updates every second

    window.addEventListener("storage", handleStorageUpdate);

    function handleStorageUpdate(e) {
        if (e.key === "cumulativeTime") {
            const newValue = parInt(e.newValue) || 0;
            alert(newValue);
            if (newValue > cumulativeTime) {
                cumulativeTime = newValue;
                globalStartTime = Date.now();
                cumTimeBox.textContent = formatTime(cumulativeTime);
            }
        }
    }

    // on page exit
    window.addEventListener("beforeunload", () => {
        clearInterval(interval); // stop timer
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - globalStartTime) / 1000); // to seconds
        cumulativeTime += elapsedTime;
        localStorage.setItem("cumulativeTime", cumulativeTime.toString());
    });


    // ===========================================
    // VOLUME CONTROL

    const volumeNode = new Tone.Volume().toDestination();
    let volume = parseInt(localStorage.getItem("savedVolume")) || 0; 
    const volumeControl = document.getElementById("volume-control");
    const volumeValueBox = document.getElementById("volume-value");
    volumeValueBox.textContent = `${volume}%`;
    volumeControl.addEventListener("input", (e) => {
        volume = e.target.value;
        localStorage.setItem("savedVolume", volume.toString()); // stored in localStorage
        volumeValueBox.textContent = `${volume}%`; // display
        volumeNode.volume.value = Tone.gainToDb(volume/100); // % to db
        // console.log(`volume in db: ${volumeNode.volume.value}`); // debug
    }); 


    // ===========================================
    // CHOOSING INSTRUMENTS & EFFECTS
    
    const instrumentSelection = document.getElementById("instrument-selection");
    const effectSelection = document.getElementById("effect-selection");
    const effectLevelControl = document.getElementById("effect-level-control");
    let effectLevel = 50;
    
    let effectNodes = [
        null, // 0 no effect
        new Tone.Distortion(), // 1
        new Tone.AutoWah(),    // 2
        new Tone.BitCrusher(),  // 3
        new Tone.Freeverb(), // 4

    ];
    
    const instruments = [
        new Tone.Sampler({ 
            urls: {
                "A4": "a4.mp3",
                "A5": "a5.mp3",
                "A6": "a6.mp3",
                "A7": "a7.mp3",
                "D#4": "ds4.mp3",
                "D#5": "ds5.mp3",
                "D#6": "ds6.mp3",
                "D#7": "ds7.mp3"
            },
            baseUrl: "../assets/audio/piano/",
            onload: () => {
                console.log("piano samples loaded");
            }, 
        }), // 0 piano sampler
        new Tone.Sampler({ 
            urls: {
                "A3": "a3.mp3",
                "A4": "a4.mp3",
                "A5": "a5.mp3",
                "D#3": "ds3.mp3",
                "D#4": "ds4.mp3",
                "D#5": "ds5.mp3",
            },
            baseUrl: "../assets/audio/eguitar/",
            onload: () => {
                console.log("e-guitar samples loaded");
            }, 
        }), // 1 eguitar sampler
        new Tone.Sampler({ 
            urls: {
                "A3": "a3.mp3",
                "A4": "a4.mp3",
                "A5": "a5.mp3",
                "A6": "a6.mp3",
                "D#4": "ds4.mp3",
                "D#5": "ds5.mp3",
                "D#6": "ds6.mp3",
                "D#7": "ds7.mp3"
            },
            baseUrl: "../assets/audio/musicbox/",
            onload: () => {
                console.log("musicbox samples loaded");
            }, 
        }), // 2 musicbox sampler
        new Tone.Sampler({ 
            urls: {
                "A4": "a4.mp3",
                "A5": "a5.mp3",
                "A6": "a6.mp3",
                "D#4": "ds4.mp3",
                "D#5": "ds5.mp3",
                "D#6": "ds6.mp3",
            },
            baseUrl: "../assets/audio/flute/",
            onload: () => {
                console.log("flute samples loaded");
            }, 
        }), // 3 flute sampler
        new Tone.Sampler({ 
            urls: {
                "A3": "a3.mp3",
                "A4": "a4.mp3",
                "A5": "a5.mp3",
                "D#3": "ds3.mp3",
                "D#4": "ds4.mp3",
                "D#5": "ds5.mp3",
            },
            baseUrl: "../assets/audio/horn/",
            onload: () => {
                console.log("horn samples loaded");
            }, 
        }), // 4 horn sampler
        new Tone.Sampler({ 
            urls: {
                "A4": "a4.mp3",
                "A5": "a5.mp3",
                "A6": "a6.mp3",
                "D#4": "ds4.mp3",
                "D#5": "ds5.mp3",
                "D#6": "ds6.mp3",
            },
            baseUrl: "../assets/audio/bugle/",
            onload: () => {
                console.log("bugle samples loaded");
            }, 
        }), // 5 bugle sampler
        new Tone.PolySynth(Tone.Synth), // 6
        new Tone.PolySynth(Tone.DuoSynth), // 7
        new Tone.PolySynth(Tone.FMSynth), // 8
        new Tone.PolySynth(Tone.AMSynth), // 9
        new Tone.Sampler({ 
            urls: {
                "A3": "a3.mp3",
                "B2": "b2.mp3",
                "B4": "b4.mp3",
                "B5": "b5.mp3",
                "C4": "c4.mp3",
                "D#4": "ds4.mp3",
                "F3": "f3.mp3",
                "F4": "f4.mp3",
                "F5": "f5.mp3"
            },
            baseUrl: "../assets/audio/meow/",
            onload: () => {
                console.log("meow samples loaded");
            }, 
        }), // 10 meow sampler
        new Tone.Sampler({ 
            urls: {
                "F3": "f3.wav",
                "A3": "a3.wav",
                "C4": "c4.wav",
                "F4": "f4.wav",
                "Bb4": "bb4.wav",
                "C5": "c5.wav",
                "F5": "f5.wav",
                "C6": "c6.wav",
                "F6": "f6.wav",
            },
            baseUrl: "../assets/audio/otto-doo/",
            onload: () => {
                console.log("otto doo samples loaded");
            }, 
        }), // 11 otto doo
        new Tone.Sampler({ 
            urls: {
                "C3": "c3.wav",
                "F3": "f3.wav",
                "C4": "c4.wav",
                "F4": "f4.wav",
                "Bb4": "bb4.wav",
                "C5": "c5.wav",
                "F5": "f5.wav",
                "C6": "c6.wav",
                "F6": "f6.wav",
            },
            baseUrl: "../assets/audio/otto-synth/",
            onload: () => {
                console.log("otto synth samples loaded");
            }, 
        }), // 12 otto synth

        new Tone.Sampler({ 
            urls: {
                "A3": "a3.mp3",
                "A4": "a4.mp3",
                "A5": "a5.mp3",
                "D#3": "ds3.mp3",
                "D#4": "ds4.mp3",
                "D#5": "ds5.mp3",
            },
            baseUrl: "../assets/audio/guitar/",
            onload: () => {
                console.log("guitar samples loaded");
            }, 
        }), // 13 guitar

        new Tone.Sampler({ 
            urls: {
                "A3": "a3.wav",
                "A4": "a4.wav",
                "A5": "a5.wav",
                "D#4": "ds4.wav",
                "D#5": "ds5.wav",
                "D#6": "ds6.wav",
                "F#6": "fs6.wav"
            },
            baseUrl: "../assets/audio/violin/",
            onload: () => {
                console.log("violin samples loaded");
            }, 
        }), // 14 violin 
        // SOURCE: FREESOUND.ORG

        // todo: explore & add more
    ];

    const instrumentNames = [
        "Piano (Sampler)",
        "E-Guitar (Sampler)",
        "Music Box (Sampler)",
        "Flute (Sampler)",
        "Horn (Sampler)",
        "Bugle (Sampler)",
        "Synth",
        "Duo Synth",
        "FM Synth",
        "AM Synth",
        "Meow",
        "Otto - Doo",
        "Otto - Synth",
        "Guitar (Sampler)",
        "Violin (Sampler)"
    ] 

    // dynamically update select elements
    for (var i = 0; i < instrumentNames.length; i++) {
        instrumentSelection.appendChild(
            Object.assign(
                document.createElement("option"),
                { value: i, innerHTML: instrumentNames[i] }
            )
        );
    }

    for (var i = 0; i < effectNodes.length; i++) {
        effectSelection.appendChild(
            Object.assign(
                document.createElement("option"),
                { value: i, innerHTML: effectNodes[i] != null ? effectNodes[i].name : "None" }
            )
        )
    }
  
    // effectNodes[4].dampening = 5000; // or 1000 if you want a rough sound

    // default: synth & no effect
    let currentInstrument = instruments[0];
    let currentEffectNode = effectNodes[0];
  
    // changing EFFECTS
    effectSelection.addEventListener('input', (e) => {
        const selectedID = parseInt(e.target.value); 
        getEffectLevelInput(effectNodes[selectedID]); 
        // ^^read from slider BEFORE setting new effect. this ensures we are setting things for the correct node

        let newEffectNode = effectNodes[selectedID]; // set new effect 

        // rewiring to include new effect node
        currentInstrument.disconnect();
        if (currentEffectNode) { // if existing effect is connected, unwire
            currentEffectNode.disconnect(volumeNode);
        }
        currentEffectNode = newEffectNode; 
        if (currentEffectNode) { // rewire to new effect
            currentInstrument.connect(currentEffectNode); // rewire only for
            currentEffectNode.connect(volumeNode);
        } else {
            currentInstrument.connect(volumeNode);
        }
    });


    // update again to realise new connection
    effectSelection.dispatchEvent(new Event('input'));

    // changing INSTRUMENTS
    instrumentSelection.addEventListener("input", (e) => {
        // the actual changing
        currentInstrument = instruments[e.target.value]; 
        // rewiring
        currentInstrument.disconnect();
        if (currentEffectNode) currentInstrument.connect(currentEffectNode);
        else currentInstrument.connect(volumeNode);
        if (currentInstrument == "Sampler" && e.target.value != 1 && e.target.value != 12 && e.target.value != 14) {
            // IF SAMPLER && NOT E-GUITAR && NOT OTTO-SYNTH && NOT VIOLIN
            toggleStopAudioWhenReleased(false); 
        } 
        else {
            toggleStopAudioWhenReleased(true);
        } 
    });

    stopAudioWhenReleasedButton.addEventListener("click", (e) => {
        toggleStopAudioWhenReleased();
    })

    effectLevelControl.addEventListener("input", (e) => {effectSelection.dispatchEvent(new Event('input'))});

    // update
    instrumentSelection.dispatchEvent(new Event('input'));

    // read from slider
    function getEffectLevelInput(node) {
        if (node == null || node.name == "Freeverb") {
            console.log("No effect.");
            effectLevelControl.style.display = "none";
            return;
        }

        effectLevel = parseInt(effectLevelControl.value);

        effectLevelControl.style.display = "inline-block";
        console.log(node.name);
        switch (node.name) {
            case "Distortion":
                effectNodes[1].distortion = effectLevel / 100;
                // sounds better around mid range
                break;
            case "AutoWah":
                effectNodes[2].sensitivity = effectLevel / 100 * 60 - 60;
                // effect more apparent at higher values
                break;
            case "BitCrusher":
                effectNodes[3].bits = effectLevel / 100 * 15 + 1;
                // sounds better at higher values
                break;
            // case "Freeverb":
            //     effectNodes[4].roomSize = effectLevel / 100;
            //     // sounds better for me at lower values
            //     break;
        }
    }

    // ===========================================
    // HANDLING KEYPRESSES

    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values

    // grabs set of KEYS PRESSED
    let letterMap = dbLetterMap;
    const pressedKeys = new Set();

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // detects for SHIFT pressed & released
    let shiftPressed = false;
    document.addEventListener('keydown', function(e) {
        if (e.shiftKey) {
            shiftPressed = true;
            shiftIndicator.style.backgroundColor = "#588157";
        }
    });
    document.addEventListener('keyup', function(e) {
        if (e.key === 'Shift') {
            shiftPressed = false;
            shiftIndicator.style.backgroundColor = "";
        }
    });
    
    // when any key is pressed
    function handleKeyDown(e) {
        const keyPressTime = performance.now(); // for latency
        const key = e.key.toLowerCase();
        // allow 'r' and 'Shift' to bypass preventDefault
        if (key != 'r' && key != 'shift') {
            e.preventDefault(); 
            // to stop other action e.g. shortcuts & spacebar scrolling from happening
            // r is let through to reload
        } 
        // note / transpose logic (works for all keys)
        if (key in letterMap && !pressedKeys.has(key)) { 
            incrementWater();
            // key in noteplaying map: play MIDI note
            pressedKeys.add(key);
            let midiNote = letterMap[key] + transposeValue + octaveAdjustment;
            if (shiftPressed) {midiNote += 1;}
            updateNoteHistory(midiNote);
            // calculating latency 
            const audioStartTime = performance.now();
            const latency = audioStartTime - keyPressTime;
            console.log(`Latency: ${latency} ms`); 
            currentInstrument.triggerAttack(Tone.Frequency(midiNote, "midi"),Tone.context.currentTime);
            applyVisualGuideStyleChange(document.getElementById(key));

            incrementCumKeypress();
        } else if (key in pitchMap && !pressedKeys.has(key)) {
            // detecting for transposing. number keys
            lastPressedTransposeKey = key;
            transposeValue = pitchMap[key]; // in semitones
            transposeValueBox.innerHTML = pitchMap[key]; // returns semitone count
            scaleValueBox.innerHTML = transposeMap[pitchMap[key]]; // returns scale ("C", "D", etc)
            scaleValueBox2.innerHTML = transposeMap[pitchMap[key]]; // returns the same scale for better visualisation
            updateVisualGuide(key);
            updateStatusMsg(`transpose value updated to: ${pitchMap[key]}`);
        } else if (e.key == 'CapsLock') {
            toggleStopAudioWhenReleased();
        } else if (key == ' ' || key == 'spacebar') {
            toggleLights();
        } else if (key == 'escape') { 
            toggleMenu();
        }
        // detect arrow key: octave change
        switch(e.key) {
            case 'ArrowLeft':
                octaveDown(pitchMap[key]);
                break;
            case 'ArrowDown':
                octaveDown(pitchMap[key]);
                break;
            case 'ArrowRight':
                octaveUp(pitchMap[key]);
                break;
            case 'ArrowUp':
                octaveUp(pitchMap[key]);
                break;
        }         
    }
    
    function handleKeyUp(e) {
        const key = e.key.toLowerCase();
        if (key in letterMap) {
           
            removeVisualGuideStyleChange(document.getElementById(key));
            pressedKeys.delete(key);
            let midiNote = letterMap[key] + transposeValue + octaveAdjustment;
            if (stopAudioWhenReleased == false) return; // IF SAMPLER && NOT E-GUITAR && NOT OTTO-SYNTH
            else;
            currentInstrument.triggerRelease(Tone.Frequency(midiNote, "midi"));
            currentInstrument.triggerRelease(Tone.Frequency(midiNote + 1, "midi")); 
            // failsafe for tone not stopping when:
            // 1. shift is held down
            // 2. note is pressed
            // 3. shift is released
        }
    }


    // ===========================================
    // APPLYING STYLE CHANGES TO DIV ON PRESS

    function applyVisualGuideStyleChange(key) {
        // cancel pending removal
        if (activeKeyTimeouts.has(key)) {
            clearTimeout(activeKeyTimeouts.get(key));
            activeKeyTimeouts.delete(key);
        }
        
        key.classList.add(stopAudioWhenReleased ? 'key-active-instant' : 'key-active');
        void key.offsetWidth; // force reflow
      }

      
    function removeVisualGuideStyleChange(key) {
        key.classList.remove('key-active-instant');
        
        if (stopAudioWhenReleased) {
            key.classList.remove('key-active');
        } else {
            const timeoutId = setTimeout(() => {
                key.classList.remove('key-active');
                activeKeyTimeouts.delete(key);
            }, 100); // 100ms because duration-100
            activeKeyTimeouts.set(key, timeoutId);
        }
        void key.offsetWidth; // force reflow
      }


    // ===========================================
    // STOP AUDIO WHEN RELEASED

    function toggleStopAudioWhenReleased(manualState = null) {
        if (manualState !== null) {
            stopAudioWhenReleased = manualState;
            stopAudioWhenReleasedButton.style.backgroundColor = manualState ? "#588157" : "#F08080";
            stopAudioWhenReleasedButton.textContent = manualState;
        } else {
            if (stopAudioWhenReleased == true) {
                stopAudioWhenReleased = false;
                stopAudioWhenReleasedButton.style.backgroundColor = "#F08080";
                stopAudioWhenReleasedButton.textContent = "false"
            } else {
                stopAudioWhenReleased = true;
                stopAudioWhenReleasedButton.style.backgroundColor = "#588157";
                stopAudioWhenReleasedButton.textContent = "true"
            }
        }
    }

    function toggleStopAudioWhenReleased(manualState = null) {
        if (manualState !== null) {
            stopAudioWhenReleased = manualState;
        } else {
            stopAudioWhenReleased = !stopAudioWhenReleased;
        }
        stopAudioWhenReleasedButton.style.backgroundColor = stopAudioWhenReleased ? "#588157" : "#F08080";
        stopAudioWhenReleasedButton.textContent = stopAudioWhenReleased ? "Instant Release" : "Smooth Release";
      
        // clear pending animations when changing modes
        activeKeyTimeouts.forEach((timeout, key) => {
            clearTimeout(timeout);
            key.classList.remove('key-active');
            activeKeyTimeouts.delete(key);
        });
      }
    
    // ===========================================
    // LOGGING: STATUS DIV

    function updateStatusMsg(message) {
        const now = new Date(Date.now());
        const formattedTime = now.toLocaleString();
        messages.push(`${message} | Time: ${formattedTime}`);
        if (messages.length > 50) {
            messages.shift();
        } 
        const status = messages.join('<br>');
        statusDiv.innerHTML = status;
        statusDiv.scrollTop = statusDiv.scrollHeight;
    }

    // ===========================================
    // CLEARING STATUS DIV
    
    clearStatusButton.addEventListener("click", (e) => {
        // clears status div
        messages = [];
        statusDiv.innerHTML = "";
    })

    // ===========================================
    // LOGGING: NOTE PLAYING HISTORY

    function updateNoteHistory(note) {
        noteHistory.push(`${midiToSPN(note)} | ${cumulativeKeypress+1}`);
        if (noteHistory.length > 20) {
            noteHistory.shift();
        } 
        const noteHistoryContent = noteHistory.join('<br>');
        notesDiv.innerHTML = noteHistoryContent;
        notesDiv.scrollTop = notesDiv.scrollHeight;
    }

    function midiToSPN(midiNumber) {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
        const noteIndex = midiNumber % 12;
        const octave = Math.floor((midiNumber - 12) / 12) - 1;
        return noteNames[noteIndex] + octave;
    }

    // ===========================================
    // CLEARING NOTE HISTORY
    
    clearNoteHistoryButton.addEventListener("click", (e) => {
        // clears note history
        noteHistory = [];
        notesDiv.innerHTML = "";
    })

    // ===========================================
    // UPDATING ALL VALUES FROM LOCALSTORAGE TO DB ON PAGE EXIT
    window.addEventListener("beforeunload", () => {
        updateOnUnload();
    });

});

