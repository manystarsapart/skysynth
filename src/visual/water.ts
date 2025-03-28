import { updateStatusMsg } from "../core/logging";
import { states } from "../core/states";

// water
export const waterLevelDisplay = document.getElementById("water-level-display")!; // past: waterLevelBox
export const waterRewardDisplay = document.getElementById("water-reward-display")!; // past: waterRewardBox
export const waterMask = document.getElementById("water-mask")!;

// ===========================================
// WATER COLLECTION

function triggerWaterReward() {
    states.totalWaterReward = parseInt(localStorage.getItem("totalWaterReward") ?? '0');
    updateStatusMsg("Triggered water reward!");
    states.totalWaterReward++;
    localStorage.setItem("totalWaterReward", states.totalWaterReward.toString());
    waterRewardDisplay.textContent = states.totalWaterReward.toString();
    // alert("Water reward! wooooo");
}

export function incrementWater() {
    states.currentWaterLevel = parseInt(localStorage.getItem("savedWaterLevel") ?? '0');
    states.currentWaterLevel++;
    
    if (states.currentWaterLevel >= states.maxWaterLevel) {
        triggerWaterReward();
        states.currentWaterLevel = 0;
    }
    
    localStorage.setItem("savedWaterLevel", states.currentWaterLevel.toString());
    waterLevelDisplay.textContent = `${states.currentWaterLevel} / ${states.maxWaterLevel}`;
    updateWaterMaskPosition();
}

export function updateWaterMaskPosition() {
    // calculate percentage from top (0% = full, 100% = empty)
    const topPercentage = (1 - states.currentWaterLevel / states.maxWaterLevel) * 100;
    waterMask.style.top = `${topPercentage.toFixed(2)}%`;
}