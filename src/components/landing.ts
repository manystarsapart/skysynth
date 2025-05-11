import { states } from "../core/states";

document.addEventListener("DOMContentLoaded", () => {
    function isFirstVisit(): boolean {
        if (!localStorage.getItem('visited')) {
          localStorage.setItem('visited', 'true');
          return true;
        }
        // else
        return false;
      }
      
      if (isFirstVisit()) {
        // first time
        document.getElementById("skysynth-greeting")!.textContent = "hello"
        // showControlsButton.dispatchEvent(new Event("pointerdown"));
      } else {  
        // repeated visit
        document.getElementById("skysynth-greeting")!.textContent = "welcome back"
        if (isFirstVisitAfterUpdate()) {
          // // show modal that shows most recent update
          // const changelogModalContent = document.getElementById("changelog-modal-content")!;
          // // convert changelog md to html
          // showdown.setFlavor('github');
          // const showdownConverter = new showdown.Converter();
          // const showdownText = changelogMD;
          // const showDdownHTML = showdownConverter.makeHtml(showdownText);
          // changelogModalContent.innerHTML = showDdownHTML;
          // toggleModal(true, "changelog");
        }
      }

      function isFirstVisitAfterUpdate(): boolean {
        if (localStorage.getItem('lastVisitedVersion') != states.skysynthVersion) {
          states.skysynthVersionOnLastVisit = localStorage.getItem('lastVisitedVersion');
          localStorage.setItem('lastVisitedVersion', states.skysynthVersion);
          return true;
        }
        // else
        return false;
      }
})