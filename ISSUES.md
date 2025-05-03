# KNOWN ISSUES

4. water level does not cover the entire vertical screen if using low viewport width

6. low viewport width also squishes the note visual guide

7. website may be too zoomed in while accessing. doesnt happen on mine for some reason

~~9. keypress and waterlevel displays return NAN if keypress is updated while not signed in~~ <--- currently disabled firebase feature. temporarily solved

11. when pressing alt on firefox (not tested on other browsers), the alt menu is brought up and affects playing. solve this by changing client side settings: navigate to about:config --> `ui.key.menuAccessKeyFocuses` --> false
 
14. `ctrl + shift + r` is now broken. cant refresh. issue lies in [keypress.ts](src/core/keypress.ts).


# FIXED ISSUES BY DATE

### 2025-05-04

15. if user changes stopAudioWhenReleased setting during transcription, visual guide bugs out when playing

### 2025-04-10

12. when holding both alt keys, right alt key release causes code to detect a left alt key release

13. visual guide incorrectly displays octave numbers as a result of poorly integrated visualguide changing

### 2025-03-23

1. selection dropdown can be janky and requires holding down to select

2. notes can continue to play after being held due to various actions   

5. tabbing away using ctrl + shift + tab causes shift to be always held. press again to resolve issue

10. instrument violin after transpose does not stop audio when released

### 2025-03-17

3. transposing to +12 uses the visual guide for +0

8. when revisiting page, volume display sometimes becomes 0% until further change