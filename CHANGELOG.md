# Changelog

All notable changes to this project will be documented in this file.

Based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Table of Contents

<!-- - [Unreleased](#unreleased) -->
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

---

<!-- 
## [X.X.X] - 2025-MM-DD
### Added
- 

### Changed
- 

### Fixed
- 
 -->

## [0.9.1] - 2025-02-11
### Added
- changelog
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

### Fixed
- XXX


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