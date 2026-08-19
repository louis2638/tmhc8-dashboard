# TMHC8 Ward Dashboard

A comprehensive single-file HTML dashboard for TMHC8 ward management.

## Features

- **Bed Management**: 50 beds across 9 cubicles (C1-C9) with visual floor plan
- **Patient Profiles**: Full patient demographics, clinical flags, care plans
- **Clinical Risk Tracking**: MDRO status (VRE, CPE, MRA, C. Auris), fall risk, DNR
- **Ward Round**: WR tracking with done/pending status per bed
- **Appointments**: Patient appointment scheduling and management
- **Handover**: Nursing and medical handover notes
- **Screening**: Contact screening tracking with result logging
- **Settings**: 5-tab settings (Display, Beds, Flags, Staff, Data)
- **Role Switcher**: Nurse/Admin/Manager role-based views
- **Theme Support**: Dark/light mode toggle
- **Backup/Restore**: Automatic backup with configurable frequency
- **Undo/Redo**: Full undo stack for all state changes
- **LocalStorage**: All data persisted locally

## Usage

Simply open `index.html` in a modern web browser. No server or build step required.

All data is stored in browser LocalStorage under key `tmhC8v46`.

## Architecture

- Single-file HTML/CSS/JS (~400KB)
- Central state object `S` with LocalStorage persistence
- `commit(actionName, fn)` pattern for state mutations
- Unified `FLAG_META` color system with 22 flag definitions
- CSS Grid + Flexbox for responsive layout

## Version

Current: v48+ (dashboard view with profile as side panel tab)

## Author

TMHC8 Ward Team
