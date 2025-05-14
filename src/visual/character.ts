import { instrumentSpriteCounts } from "../audio/instruEffect";
import { updateStatusMsg } from "../core/logging";
import { states } from "../core/states";

// function preloadImages(imagePaths:string[]) {
//     imagePaths.forEach((path) => {
//       const img = new Image();
//       img.src = path;
//     });
//   }
  
//   preloadImages([
//     'playing/0/1.png',
// UGHGHGHHHHH
//   ]);




let idleTimeout: ReturnType<typeof setTimeout>;

function setNewIdleTimeout() {
    idleTimeout = setTimeout(() => {
        updateCharacter(true);
        // console.log("timeout ended. back to idle");
    }, 1000); // 1s
}

let lastSpriteSwitchTime: number = 0;

const charSizeInput = document.getElementById("char-size-input")!;

charSizeInput.addEventListener("input", () => {
    const input = charSizeInput as HTMLInputElement;
    states.charWidthPercentage = input.value;
    localStorage.setItem("savedCharWidth", input.value);
    updateCharacter(true);
    // updateStatusMsg(states.charWidthPercentage);
})

window.addEventListener("DOMContentLoaded", () => {
    const input = charSizeInput as HTMLInputElement;
    input.value = states.charWidthPercentage.toString();
});

export function updateCharacter(idle: boolean) {
    if (!states.charVisible) {
        return;
    }

    // idle value: the value to update to
    const char = document.getElementById("character-div")!
    if (idle) {
        
        states.charIdle = true;
        states.charCurrentSpriteID = 0;
        if (instrumentSpriteCounts[states.currentInstrumentIndex] === 0) {
            char.innerHTML = `<img id="character-image" src="../assets/char/idle/0.png" class="fixed ml-auto mr-auto left-1/2 -translate-x-1/2 bottom-0 translate-y-1/5 -z-10" alt="skykid character">`;
        } else {
        char.innerHTML = `<img id="character-image" src="../assets/char/idle/${states.currentInstrumentIndex}.png" class="fixed ml-auto mr-auto left-1/2 -translate-x-1/2 bottom-0 translate-y-1/5 -z-10" alt="skykid character">`;
        } 
    }   
    else {

        states.charIdle = false;
        clearTimeout(idleTimeout);

        setNewIdleTimeout();

        // if too many inputs at once, return. rate limited to 1 action per 100ms
        const now: number = Date.now();
        if (now - lastSpriteSwitchTime < 100) { // 100ms
            return;
        }
        // console.log("timeout refreshed by keypress. duration between keypresses: " + ((now - lastSpriteSwitchTime) / 1000) + "s");
        lastSpriteSwitchTime = now;

        
        
        // gives random sprite ID in pool for that instrument. if no sprite in pool, use default sprites (instrument id 0)
        // states.charCurrentSpriteID = (instrumentSpriteCounts[states.currentInstrumentIndex] !== 0) ?  : Math.floor(Math.random() * instrumentSpriteCounts[0] + 1);
        // console.log("spriteID: " + states.charCurrentSpriteID);
        // console.log("instID: " + states.currentInstrumentIndex);
        

        if (instrumentSpriteCounts[states.currentInstrumentIndex] != 0) {
            let newSpriteID;
            do {
                newSpriteID = Math.floor(Math.random() * instrumentSpriteCounts[states.currentInstrumentIndex] + 1);
            } while (newSpriteID === states.charCurrentSpriteID);
        
            states.charCurrentSpriteID = newSpriteID;
            char.innerHTML = `<img id="character-image" src="../assets/char/playing/${states.currentInstrumentIndex}/${states.charCurrentSpriteID}.png" class="fixed ml-auto mr-auto left-1/2 -translate-x-1/2 bottom-0 translate-y-1/5 -z-10" alt="skykid character">`;
        } else {
            let newSpriteID;
            do {
                newSpriteID = Math.floor(Math.random() * instrumentSpriteCounts[0] + 1);
            } while (newSpriteID === states.charCurrentSpriteID);
        
            states.charCurrentSpriteID = newSpriteID;
            char.innerHTML = `<img id="character-image" src="../assets/char/playing/0/${states.charCurrentSpriteID}.png" class="fixed ml-auto mr-auto left-1/2 -translate-x-1/2 bottom-0 translate-y-1/5 -z-10" alt="skykid character">`;
        }
        
    } 
    document.getElementById("character-image")!.style.width = `${states.charWidthPercentage}%`;
    // char.style.width = "10%"
}


// ==========
// turn off

const toggleSpriteButton = document.getElementById("toggle-sprite-button")!;

toggleSpriteButton.addEventListener("pointerdown", () => {
        states.charVisible = !states.charVisible;
        toggleSpriteButton.classList.remove(states.charVisible ? "bg-[#F08080]" : "bg-[#588157]");
        toggleSpriteButton.classList.add(!states.charVisible ? "bg-[#F08080]" : "bg-[#588157]");
        document.getElementById("character-div")!.classList.toggle("hidden");
        charSizeInput.classList.toggle("hidden");
        updateStatusMsg("sprite toggled to: " + states.charVisible);
})