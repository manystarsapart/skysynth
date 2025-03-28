import { states } from '../states.ts';
import { updateStatusMsg } from '../logging.ts';
import { updateVisualGuide } from '../visual/visualguide.ts';

const octaveValueDisplay = document.getElementById("octave-value")!; // past: octaveValueBox


    // ===========================================
    // OCTAVE CHANGE

    export function octaveUp(target:number | null = null) {
        if (target == null) {
            if (states.octave >= 3) {
                updateStatusMsg("Already at maximum octave!");
                return;
            }
            states.octave++;
            states.octaveAdjustment += 12;
            octaveValueDisplay.innerHTML = states.octave.toString();
            updateStatusMsg(`states.octave shift updated to: ${states.octave}`);
            updateVisualGuide(states.lastPressedTransposeKey);
        }
    }

    export function octaveDown(target:number | null = null) {
        if (target == null) {
            if (states.octave <= -2) {
                updateStatusMsg("Already at minimum octave!");  
                return;
            }
            states.octave--;
            states.octaveAdjustment -= 12;
            octaveValueDisplay.innerHTML = states.octave.toString(); 
            updateStatusMsg(`states.octave shift updated to: ${states.octave}`);
            updateVisualGuide(states.lastPressedTransposeKey); 
        }
    }