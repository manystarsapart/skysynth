import { states } from "../core/states";
import { refreshSongVisuals } from "../sheets/transcribe";

const modalOverlay = document.getElementById("modal-overlay")!;
const closeModalButton = document.getElementById("close-modal")!;
const mainContent = document.getElementById("main-content")!;
const modalContent = document.getElementById("modal-content")!;

closeModalButton.addEventListener('pointerdown', () => toggleModal(false));

// ==========
// CONTROLS BUTTON

export const showControlsButton = document.getElementById("show-controls-button")!;
showControlsButton.addEventListener("pointerdown", (e) => {
    hideAllModals();
    toggleModal(true, "controls");
    e.stopPropagation(); // prevents it from bubbling up
});

// ==========
// STATISTICS BUTTON
const showStatisticsButton = document.getElementById("show-statistics-button")!;
showStatisticsButton.addEventListener("pointerdown", (e) => {
    hideAllModals();
    toggleModal(true, "statistics");
    e.stopPropagation(); // prevents bubbling up
})

// ==========
// TRANSCRIBE BUTTON & TAB

const showTranscribeButton = document.getElementById("show-transcribe-button")!;
document.addEventListener("keydown", function(e) {
    if (!states.modalShown && e.key === 'Tab') {
        hideAllModals();
        e.preventDefault(); // prevent tabbing away
        toggleModal(true, "transcribe");
    }
});
showTranscribeButton.addEventListener("pointerdown", (e) => {
    hideAllModals();
    toggleModal(true, "transcribe");
    e.stopPropagation(); // prevents bubbling up
})

// ==========
// DEBUG BUTTON

const showDebugButton = document.getElementById("show-debug-button")!;
document.addEventListener("keydown", function(e) {
    if (!states.modalShown && e.key === 'Delete') {
        hideAllModals();
        e.preventDefault(); // prevent tabbing away
        toggleModal(true, "debug");
    }
});
showDebugButton.addEventListener("pointerdown", (e) => {
    hideAllModals();
    toggleModal(true, "debug");
    e.stopPropagation(); // prevents bubbling up
})

// ==========
// CUSTOMISE BUTTON

const showCustButton = document.getElementById("show-customise-button")!;
showCustButton.addEventListener("pointerdown", (e) => {
    hideAllModals();
    toggleModal(true, "customise");
    e.stopPropagation(); // prevents bubbling up
})

// ==========
// HIDE ALL

export function hideAllModals() {
    document.getElementById("controls-modal")!.classList.add("hidden");
    document.getElementById("transcribe-modal")!.classList.add("hidden");
    document.getElementById("changelog-modal")!.classList.add("hidden");
    document.getElementById("statistics-modal")!.classList.add("hidden");
    document.getElementById("debug-modal")!.classList.add("hidden");
    document.getElementById("customise-modal")!.classList.add("hidden");
}

// hideAllModals();

// ==========

let lastFocusedElement: HTMLElement | null = null;

export function toggleModal(show:boolean, mode = "transcribe") {
    console.log("toggleModal called", show, mode);

    refreshSongVisuals();

    // hide all modals
    

    if (show) {
        console.log("Trying to show modal, mode:", mode);
        if (mode === "controls" || mode === "transcribe" || mode === "changelog" || mode === "statistics" || mode === "debug" || mode === "customise") {
            document.getElementById(`${mode}-modal`)!.classList.remove("hidden");
        } else {
            return;
        }

        lastFocusedElement = document.activeElement as HTMLElement;
        mainContent.classList.add("pointer-events-none", "opacity-50");
        modalOverlay.classList.remove("hidden");
        // console.log("Should be visible now:", modalOverlay.className);
        closeModalButton.focus();
    } else {
        mainContent.classList.remove("pointer-events-none", "opacity-50");
        modalOverlay.classList.add("hidden");
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    states.modalShown = show;

    if (show) {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('pointerdown', handleClickOutside);
    } else {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('pointerdown', handleClickOutside);
    }
}


function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' || e.key === 'Tab' || e.key === 'Delete') {
        toggleModal(false);
        hideAllModals();
    }
}

function handleClickOutside(e: PointerEvent) {
    if (!modalContent.contains(e.target as Node) && e !instanceof HTMLSpanElement) {
        // not instanceof span: this allows for span elements (song list actions) to be selected without triggering the closing of the modal 
        toggleModal(false);
    } else {
        // e.preventDefault();
        // TEMPORARILY DISABLED TO ALLOW DROPDOWN TO BE CLICKED
    }
}


