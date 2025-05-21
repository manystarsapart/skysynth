# Changelog

All notable changes to this project will be documented in this file.

Based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Table of Contents

<!-- - [Unreleased](#unreleased) -->
- [0.20.4 - 2025-05-20](#0204---2025-05-20)
- [0.20.3 - 2025-05-15](#0203---2025-05-15)
- [0.20.2 - 2025-05-14](#0202---2025-05-14)
- [0.20.1 - 2025-05-12](#0201---2025-05-12)
- [0.20.0 - 2025-05-11](#0200---2025-05-11)
- [0.19.8 - 2025-05-10](#0198---2025-05-10)
- [0.19.7 - 2025-05-04](#0197---2025-05-04)
- [0.19.6 - 2025-05-03](#0196---2025-05-03)
- [0.19.5 - 2025-05-02](#0195---2025-05-02)
- [0.19.4 - 2025-05-02](#0194---2025-05-02)
- [0.19.3 - 2025-04-19](#0193---2025-04-19)
- [0.19.2 - 2025-04-17](#0192---2025-04-17)
- [0.19.1 - 2025-04-16](#0191---2025-04-16)
- [0.19.0 - 2025-04-15](#0190---2025-04-15)
- [0.18.1 - 2025-04-10](#0181---2025-04-10)
- [0.18.0 - 2025-04-09](#0180---2025-04-09)
- [0.17.0 - 2025-04-08](#0170---2025-04-08)
- [0.16.1 - 2025-03-30](#0161---2025-03-30)
- [0.16.0 - 2025-03-28](#0160---2025-03-28)
- [0.15.0 - 2025-03-25](#0150---2025-03-25)
- [0.14.2 - 2025-03-23](#0142---2025-03-23)
- [0.14.1 - 2025-03-20](#0141---2025-03-20)
- [0.14.0 - 2025-03-17](#0140---2025-03-17)
- [0.13.2 - 2025-03-17](#0132---2025-03-17)
- [0.13.1 - 2025-03-06](#0131---2025-03-06)
- [0.13.0 - 2025-03-05](#0130---2025-03-05)
- [0.12.0 - 2025-03-02](#0120---2025-03-02)
- [0.11.5 - 2025-03-01](#0115---2025-03-01)
- [0.11.4 - 2025-02-28](#0114---2025-02-28)
- [0.11.3 - 2025-02-19](#0113---2025-02-19)
- [0.11.2 - 2025-02-18](#0112---2025-02-18)
- [0.11.1 - 2025-02-17](#0111---2025-02-17)
- [0.11.0 - 2025-02-16](#0110---2025-02-16)
- [0.10.1 - 2025-02-14](#0101---2025-02-14)
- [0.10.0 - 2025-02-14](#0100---2025-02-14)
- [0.9.1 - 2025-02-11](#091---2025-02-11)
- [0.9.0 - 2025-02-10](#090---2025-02-10)
- [0.8.0 - 2025-01-29](#080---2025-01-29)
- [0.7.0 - 2025-01-28](#070---2025-01-28)
- [0.6.0 - 2025-01-27](#060---2025-01-27)
- [0.5.0 - 2025-01-25](#050---2025-01-25)
- [0.4.0 - 2025-01-24](#040---2025-01-24)
- [0.3.0 - 2025-01-21](#030---2025-01-21)
- [0.2.0 - 2025-01-20](#020---2025-01-20)
- [0.1.0 - 2025-01-20](#010---2025-01-20)
- [0.0.0 - 2025-01-18](#000---2025-01-18)

<!-- 
## [X.X.X] - 2025-MM-DD
### Added
- 

### Changed
- 

### Fixed
- 
 -->


<!-- 

FUTURE PLANS

- LEADERBOARD LEADERBOARD LEADERBOARD. needs auth to work
- (put auth back again... its been ages... maybe try google auth?)

- actual real sustain pedal key. tab to sustain and release tab to release

- overhaul for recorder logic? is recording still needed?
- background customisation
- keybind customisation (VERY FAR)

- PRELOAD / CACHE IMAGES FOR SKYKID

- changelog modal on version update

 -->

## [0.20.4] - 2025-05-20
### Added
- option to temporary octave up (spacebar)
- tapping spacebar on landing page brings one straight to player page

### Changed
- sheet ver: 1.1 --> 1.2 (due to abovementioned temp octave feature)
- sprite initial scale: 50 --> 30


## [0.20.3] - 2025-05-15
### Added
- option to name a transcription before downloading

### Changed
- sheet file extensinon: .json --> .skysynth (actual format unchanged)


## [0.20.2] - 2025-05-14
### Added
- move transcribed song up / down the list feature
- option to turn off sprite
- colours displaying on/off for customisation settings

### Changed
- condense the yellow chunk of text stating transpose & octave values to a smaller section at top right

### Fixed
- clicking song list actions always closes the modal --> does not close the modal
- volume setting persistence issues
- shift & alt indicator touch: default --> prevent default
- background toggling broken


## [0.20.1] - 2025-05-12
### Added
- edit transcribed song name feature


## [0.20.0] - 2025-05-11
### Added
- landing page
- blog page (todo)
- TGC acknowledgements 

### Changed
- UI changes!!!
- move status div (for status messages) into debug modal. leaves only the latest
- move note history into debug modal. leaves only the latest
- move statistics paragraph into statistics modal 
- move misc buttons in menu into customisation modal
- improve positioning of main notes div
- improve size of shift & alt indicators
- background gradient shades

## [0.19.8] - 2025-05-10
### Fixed
- z index of character image is too high and interferes with touchscreen playing
- NaN showing for notehistory when localstorage has no previously stored value

## [0.19.7] - 2025-05-04
### Added
- instruments: 
    - grand piano
    - banjo
    - pipa
    - kalimba
    - xylophone
    - saxophone
    - harmonica (?)
    - violin (fix)
- different website behaviour between first-time visitor & not. shows controls modal

### Changed
- slightly more streamedlined instrument selection & char sprite

### Fixed
- sheetPlayer logic for stopAudioWhenReleased broken due to lack of individual property


## [0.19.6] - 2025-05-03
### Added
- transcription playback visualisation: notes, transpose keys

### Fixed
- control guide not showing properly (due to propagation of pointerdown)


## [0.19.5] - 2025-05-02
### Added
- delete song feature. transcriptions deemed unsatisfactory can now be deleted

### Fixed
- song name not immediately reflected after saving transcription
- tone not releasing non-terminating notes after forceful song end: fixed with blanket tone stop


## [0.19.4] - 2025-05-02 
### Added
- sheet playing, sheet importing (PROOF OF CONCEPT). only visualising sheet left

### Changed
- sheet format

## [0.19.3] - 2025-04-19
### Added
- aurora voice instrument from Specy (no sustain)

### Changed 
- shift transcription buttons into another modal

### Fixed
- improve slightly on touchscreen compatibility support
- sprite size rendering issues for non-supported sprites


## [0.19.2] - 2025-04-17
### Added
- song name & player name & initial boolean for stopaudiowhenreleased in RecordedSong

### Fixed
- transcription time incorrectly used Date.now() 
- time not displaying correctly due to missing import


## [0.19.1] - 2025-04-16
### Added
- EXPERIMENTAL: option to transcribe and download a series of keypresses. no way to display & re-view the transcription yet

## [0.19.0] - 2025-04-15
### Added
- pointerevent support. you can now click the visual guide on this website to play for touchscreen computers / tablets


## [0.18.1] - 2025-04-10
### Added
- skykid size slider bar at bottom left (persists)

### Changed
- move acknowledgements to tab menu
- overhaul visual guide code. should be much more reliable

### Fixed
- when holding both alt keys, right alt key release causes code to detect a left alt key release


## [0.18.0] - 2025-04-09
### Added
- skykid character actions (experimental)
- water visibility toggle
- background visibility toggle


## [0.17.0] - 2025-04-08
### Added
- harp instrument (samples from mcbeeringi)

### Changed
- organise instrument list
- improve stopAudioWhenReleased logic to allow for dynamic checks when instrument is changed
- add currentInstrumentIndex and currentInstrumentName states


## [0.16.1] - 2025-03-30
### Added
- red background persists for playback

### Changed
- recording name: unix time stamp --> better formatting & local time

### Fixed
- display issue: volume display retains past value but actual volume still defaults to 100%


## [0.16.0] - 2025-03-28
### Added
- dynamic visual guide changes when shift / alt pressed
- `[` and `]` now allow for adjustment of one semitone
- controls guide: `Tab` to view

### Changed
- (BREAKING) spilt main.ts up into many files containing each component of the main code
- light switch: `Spacebar` --> `\`


## [0.15.0] - 2025-03-25
### Added
- left and right alt can now individually increase one semitone on either side of the keyboard. acts as `shift` but only for one side


## [0.14.2] - 2025-03-23
### Added
- check for tabbing back into skysynth. this stops audio & reverts shift

### Changed
- menu behaviour: appear on hover --> on pointerdown

### Fixed
- known issues (listed below)
- selection dropdown can be janky and requires holding down to select
- notes can continue to play after being held due to various actions   
- tabbing away using ctrl + shift + tab causes shift to be always held. press again to resolve issue
- instrument violin after transpose does not stop audio when released (solved with previous patch)


## [0.14.1] - 2025-03-20
### Changed
- helper function to declutter div generation in visual guide

### Fixed
- incorrect labelling of SPN notes
- volume too low for otto-doo & otto-synth
- both notes stop playing when one note is stopped, when a note and another note one semitone higher is played together 
- visual guide & alt keyboard support had broken values


## [0.14.0] - 2025-03-17
### Changed
- BREAKING: migrate to typescript & vite bundler
- integrate an improved keyboard changer from mobile skysynth into the web version
- reorganise code for better readability & debugging
- temporarily remove firebase interactions

### Fixed
- volume value display starts at 0% on first website load
- transposing to +12 uses the visual guide for +0


## [0.13.2] - 2025-03-17
### Added
- experimental violin sampler (freesound.org)
- new animations for keypress


## [0.13.1] - 2025-03-06
### Added
- guitar sampler (mcbeeringi)

### Changed
- styling for the yellow text column


## [0.13.0] - 2025-03-05
### Changed
- WONDERFUL NEWS: shaved Tone.js's default delay off by using `Tone.context.currentTime` in triggerAttack. thank you Specy for the insight


## [0.12.1] - 2025-03-05
### Fixed
- freeverb room size is read-only

## [0.12.0] - 2025-03-02
### Added
- EXPERIMENTAL: authentication & user login using firebase
- hello, display name
- known issues markdown file

### Changed
- MAJOR: reorganise dir structure
- removed my sanity as i try to learn databases


## [0.11.5] - 2025-03-01
### Fixed
- icons collapse to top when menu is not expanded 


## [0.11.4] - 2025-02-28
### Changed
- add access to old version (0.9.1) at [old.skysynth.space](https://www.old.skysynth.space)


## [0.11.3] - 2025-02-19
### Added
- clear noteHistory feature 
- title for noteHistory

### Changed
- visual guide background: clear --> white (80% opaque) (incl. shift indicator)
- visual guide octave number: normal text --> subscript
- visual guide: Eb --> D#


## [0.11.2] - 2025-02-18
### Changed
- stop audio when key released: tab --> capslock
- noteHistory: A# --> Bb
- button colour: more muted


## [0.11.1] - 2025-02-17
### Changed
- readme update & known issues comment update

### Fixed
- website lags due to huge noteHistory array. now both messages and noteHistory clears at 20


## [0.11.0] - 2025-02-16
### Added
- shift held indicator feature
- toggle menu hotkey (esc)
- menu title in menu

### Changed
- light switch background colour now changes instead of staying colourless

### Fixed
- deprecated keyCode --> key value 


## [0.10.1] - 2025-02-14
### Added
- note history feature (top right)


## [0.10.0] - 2025-02-14
### Added
- light switch (spacebar)
- water collection feature. playing notes increases water count. yet to implement feature to use water count
- max water count: 500 (for now)
- SAO lake background (for now)
- readme acknowledgements

### Changed
- **UI REVAMP**
- move various buttons into sidebar
- merge note & keyboard key part of visual guide into one single guide
- keyboard selection: buttons --> select
- more accurate description: volume --> final gain


## [0.9.1] - 2025-02-11
### Added
- this changelog
- toggle key release feature (tab key)

### Changed
- improve otto-doo source sound effect (cut off excess time in front)
- add changelog link to readme
- changelog.md --> CHANGELOG.md
- max octave shift: +2 --> +3

### Fixed
- otto-doo path issue
- octave change message issue


## [0.9.0] - 2025-02-10
### Added
- instruments: otto-doo & otto-synth


## [0.8.0] - 2025-01-29
### Added
- slider feature for effect selection
- import samples from mcbeeringi/sky/instr and add samples as instruments: piano, musicbox, e-guitar, bugle
- more instruments from mcbeeringi: flute, horn (fwyr)
- instrument: meow

### Changed
- make all sampler notes play out in full instead of releasing on keyUp
- updating HTML list each time --> dynamic updating of select elements (fwyr)

### Fixed
- effect slider input not actually updating the values
- pressstart2p font for header (fwyr)


## [0.7.0] - 2025-01-28
### Added
- notes light-up feature (when pressed)
- preserving volume setting
- changing of instruments: synth, duosynth, fmsynth, amsynth
- stop playback feature
- effect selection: distortion, autowah, bitcrusher, freeverb

### Changed
- set npm run dev as tailwind compilation

### Fixed
- recording feature (fwyr)


## [0.6.0] - 2025-01-27
### Added
- final gain slider feature
- cumulative time spent feature
- cumulative notes played feature
- octave numbers on visual guide feature

### Changed
- remove overflow:hidden
- use local Tone.min.js instead of the online version
- clean up main.js
- update tailwindcss to version 4

### Fixed
- volume slider text not showing properly


## [0.5.0] - 2025-01-25
### Added
- recording feature
- octave shift feature
- octave shift indication feature
- patchnotes in footer
- reminder about saving recordings

### Changed
- decrease text font, give a max height to statusdiv so it fits within one page rather than continuously increasing page length
- thinner visual guide


## [0.4.0] - 2025-01-24
### Added
- preventDefault for keys on page. this means / can now be pressed instead of spacebar for highest note

### Fixed
- highest note: spacebar --> /
- text guide: right column overlapping with left column on smaller screens


## [0.3.0] - 2025-01-21
### Added
- transposing feature (using number keys)


## [0.2.0] - 2025-01-20
### Added
- current key indication feature
- comments for readibility

### Changed
- A# --> Bb
- string concat --> template literals
- br spam for instructions guide text --> ul & li


## [0.1.0] - 2025-01-20
### Added
- preview in assets folder
- thumbnail, description, icon, README.md
- tailwindcss

### Fixed
- low keyboard too low. made one octave overlap

### Changed
- made a new repo to store this project in


## [0.0.0] - 2025-01-18
### Added
- main structure & key recognition for playing notes
- option to switch between double & single keyboard (high) & single keyboard (low)
- keypress visual guide