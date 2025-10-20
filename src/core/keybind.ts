// // I WILL LET THE USER SET ONLY THE NON-MUSIC & NON-TRANSPOSE KEYBINDS. ELSE IT IS TOO MUCH TO HANDLE (FOR NOW)

// let pendingKeybindAction: string = "";

// function startKeybindChange(actionName: string) {
//     userKeybinds.isListeningForKeybind = true;

//     pendingKeybindAction = actionName;
//     alert(`Press a key to set as the hotkey for ${actionName}`);
// }

// document.addEventListener('keydown', (e) => {
//     if (!userKeybinds.isListeningForKeybind) return;

//     const key: string = e.key.toLowerCase();
//     if (Object.values(userKeybinds).includes(key)) {
//         alert("Keybind already in use! Please try another.");
//         return;
//     }

//     // if (['shift', 'control', 'alt', 'meta'].includes(key)) return; // reject modifiers 

    
// // TODO: WEB APP
// // https://www.perplexity.ai/search/i-have-a-web-app-that-i-want-t-peiSdeWGTEeiJMgDsRFALw

// })

// export let userKeybinds: any = {
//     default: true,
//     isListeningForKeybind: false,

//     // music keys cannot be set
//     // tranpose keys cannot be set
//     transposeDownOne: "[",
//     transposeUpOne: "]",
//     toggleAudioWhenReleased: "capslock",
    

// }

