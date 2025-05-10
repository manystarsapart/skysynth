
// ===========================================
// CUMULATIVE TIME SPENT

const cumTimeDisplay = document.getElementById("cum-time")!; // past: cumTimeBox
let cumulativeTime: number = parseInt(localStorage.getItem("cumulativeTime") ?? '100') || 100;
let globalStartTime: number = Date.now();

document.addEventListener("DOMContentLoaded", () => {
    cumTimeDisplay.textContent = formatTime(cumulativeTime);

})



function formatTime(seconds:number) {
    const hours: number = Math.floor(seconds / 3600);
    const minutes: number = Math.floor((seconds % 3600) / 60);
    const secs: number = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// start timer
const interval = setInterval(() => {
    const currentTime: number = Date.now();
    const elapsedTime: number = Math.floor((currentTime - globalStartTime) / 1000); // to seconds
    cumulativeTime += elapsedTime;
    globalStartTime = currentTime; 
    cumTimeDisplay.textContent = formatTime(cumulativeTime);
    localStorage.setItem("cumulativeTime", cumulativeTime.toString());
}, 1000); // updates every second

// on page exit
window.addEventListener("beforeunload", () => {
    clearInterval(interval); // stop timer
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - globalStartTime) / 1000); // to seconds
    cumulativeTime += elapsedTime;
    localStorage.setItem("cumulativeTime", cumulativeTime.toString());
});
