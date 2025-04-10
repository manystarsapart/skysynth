import { states } from "../core/states";

// menu
const navbar = document.getElementById("navbar")!;
const menuTitle = document.getElementById("menu-title")!;
const navContent = navbar.querySelectorAll("li > div")!;
// menu

// ===========================================
// MENU TOGGLE

const handleClickOutside = (e: PointerEvent) => {
    // check for click outside menu
    if (!navbar.contains(e.target as Node)) {
        toggleMenu();
    }
};

navbar.addEventListener('pointerdown', toggleMenu);

export function toggleMenu() {
    navbar.classList.toggle("w-[400px]");
    menuTitle.classList.toggle("hidden");
    navContent.forEach(div => {
        div.classList.toggle("hidden");
    });
    states.navbarExtended = !states.navbarExtended;

    if (states.navbarExtended) {
        navbar.removeEventListener('pointerdown', toggleMenu);
        document.addEventListener('pointerdown', handleClickOutside);
    } else {
        navbar.addEventListener('pointerdown', toggleMenu);
        document.removeEventListener('pointerdown', handleClickOutside);
    }
}