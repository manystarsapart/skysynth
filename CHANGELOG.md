# Changelog

All notable changes to this project will be documented in this file.

Based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Table of Contents

<!-- - [Unreleased](#unreleased) -->
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
- actual real sustain pedal key. tab to sustain and release tab to release

- transcriber & export & import. may require overhaul for recorder logic
- background customisation
- 

 -->

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