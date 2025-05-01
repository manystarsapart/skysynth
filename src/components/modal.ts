import { states } from "../core/states";
import { updateTranscribeModal } from "../sheets/transcribe";

const modalOverlay = document.getElementById("modal-overlay")!;
const closeModalButton = document.getElementById("close-modal")!;
const mainContent = document.getElementById("main-content")!;
const modalContent = document.getElementById("modal-content")!;

closeModalButton.addEventListener('pointerdown', () => toggleModal(false));

// ==========
// CONTROLS BUTTON


// TODO: FIX THIS
// const showControlsButton = document.getElementById("show-controls-button")!;
// showControlsButton.addEventListener('pointerdown', showControlModal)
// function showControlModal() {
//     // alert("test")
//     document.getElementById("controls-modal")!.classList.remove("hidden");
//     toggleModal(true);
//     document.getElementById("transcribe-modal")!.classList.add("hidden");
// }

// ==========

let lastFocusedElement: HTMLElement | null = null;

export function toggleModal(show: boolean) {
    updateTranscribeModal();
    if (show) {
        document.getElementById("transcribe-modal")!.classList.remove("hidden");
        lastFocusedElement = document.activeElement as HTMLElement;
        mainContent.classList.add("pointer-events-none", "opacity-50");
        modalOverlay.classList.remove("hidden");
        trapFocus(modalContent);
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

// for tab
function trapFocus(element: HTMLElement) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    element.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' || e.key === 'Tab') {
        toggleModal(false);
        document.getElementById("controls-modal")!.classList.add("hidden");
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


