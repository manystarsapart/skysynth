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


const instrumentSpriteCounts: Record<number, number> = {
    0: 10, // piano
    1: 0, //  e-guitar
    2: 0, // music box
    3: 5, // flute
    4: 7, // horn
    5: 7, // bugle
    6: 5, // guitar
    7: 0, // violin
    8: 5, // harp
    9: 0, // synth
    10: 0, // duo synth
    11: 0, // fm synth
    12: 0, // am synth
    13: 0, // meow
    14: 7, // otto - doo
    15: 0, // otto - synth
}

let idleTimeout: ReturnType<typeof setTimeout>;

function setNewIdleTimeout() {
    idleTimeout = setTimeout(() => {
        updateCharacter(true);
        console.log("timeout ended. back to idle");
    }, 1000); // 1s
}

let lastSpriteSwitchTime: number = 0;






export function updateCharacter(idle: boolean) {
    // idle value: the value to update to
    if (idle) {
        states.charIdle = true;
        states.charCurrentSpriteID = 0;
        if (instrumentSpriteCounts[states.currentInstrumentIndex] === 0) {
            document.getElementById("character-div")!.innerHTML = `<img src="./assets/char/idle/0.png" class="block ml-auto mr-auto w-[50%]" alt="skykid character">`;
            return;
        };
        document.getElementById("character-div")!.innerHTML = `<img src="./assets/char/idle/${states.currentInstrumentIndex}.png" class="block ml-auto mr-auto w-[50%]" alt="skykid character">`;
    }   
    else {

        states.charIdle = false;
        clearTimeout(idleTimeout);

        setNewIdleTimeout();
        console.log("timeout refreshed by keypress");

        // if too many inputs at once, return. rate limited to 1 action per 100ms
        const now: number = Date.now();
        if (now - lastSpriteSwitchTime < 100) { // 100ms
            return;
        }
        lastSpriteSwitchTime = now;
        
        // gives random sprite ID in pool for that instrument. if no sprite in pool, use default sprites (instrument id 0)
        // states.charCurrentSpriteID = (instrumentSpriteCounts[states.currentInstrumentIndex] !== 0) ?  : Math.floor(Math.random() * instrumentSpriteCounts[0] + 1);
        console.log("spriteID: " + states.charCurrentSpriteID);
        console.log("instID: " + states.currentInstrumentIndex);
        

        if (instrumentSpriteCounts[states.currentInstrumentIndex] != 0) {
            states.charCurrentSpriteID = Math.floor(Math.random() * instrumentSpriteCounts[states.currentInstrumentIndex] + 1);
            document.getElementById("character-div")!.innerHTML = `<img src="./assets/char/playing/${states.currentInstrumentIndex}/${states.charCurrentSpriteID}.png" class="block ml-auto mr-auto w-[50%]" alt="skykid character">`;
        } else {
            console.log
            states.charCurrentSpriteID = Math.floor(Math.random() * instrumentSpriteCounts[0] + 1);
            document.getElementById("character-div")!.innerHTML = `<img src="./assets/char/playing/0/${states.charCurrentSpriteID}.png" class="block ml-auto mr-auto w-[50%]" alt="skykid character">`;
        }
    } 
}