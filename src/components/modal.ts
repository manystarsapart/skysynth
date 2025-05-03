import { states } from "../core/states";
import { refreshSongVisuals } from "../sheets/transcribe";

const modalOverlay = document.getElementById("modal-overlay")!;
const closeModalButton = document.getElementById("close-modal")!;
const mainContent = document.getElementById("main-content")!;
const modalContent = document.getElementById("modal-content")!;

closeModalButton.addEventListener('pointerdown', () => toggleModal(false));

// ==========
// CONTROLS BUTTON

const showControlsButton = document.getElementById("show-controls-button")!;
showControlsButton.addEventListener('pointerdown', (e) => {
    toggleModal(true, "controls");
    e.stopPropagation(); // prevents it from bubbling up
});

// ==========
// TAB

document.addEventListener('keydown', function(e) {
    if (!states.modalShown && e.key === 'Tab') {
        e.preventDefault(); // prevent tabbing away
        toggleModal(true, "transcribe");
    }
});

// ==========

let lastFocusedElement: HTMLElement | null = null;

export function toggleModal(show:boolean, mode = "transcribe") {
    console.log("toggleModal called", show, mode);

    refreshSongVisuals();

    // hide both
    document.getElementById("controls-modal")!.classList.add("hidden");
    document.getElementById("transcribe-modal")!.classList.add("hidden");

    if (show) {
        console.log("Trying to show modal, mode:", mode);
        if (mode === "controls") {
            document.getElementById("controls-modal")!.classList.remove("hidden");
        } else {
            document.getElementById("transcribe-modal")!.classList.remove("hidden");
        }

        lastFocusedElement = document.activeElement as HTMLElement;
        mainContent.classList.add("pointer-events-none", "opacity-50");
        modalOverlay.classList.remove("hidden");
        console.log("Should be visible now:", modalOverlay.className);
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
    if (e.key === 'Escape' || e.key === 'Tab') {
        toggleModal(false);
        document.getElementById("controls-modal")!.classList.add("hidden");
        document.getElementById("transcribe-modal")!.classList.add("hidden");
    }
}

function handleClickOutside(e: PointerEvent) {
    if (!modalContent.contains(e.target as Node)) {
        toggleModal(false);
    } else {
        // e.preventDefault();
        // TEMPORARILY DISABLED TO ALLOW DROPDOWN TO BE CLICKED
    }
}


