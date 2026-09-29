# Changelog

All notable changes to the CodeChef ABESEC Events portal ("Bawarchi Express") will be documented in this file.

## [P1 - Design Plan & Foundations] - 2026-09-29
- Initialized project architecture, design plan, and phase-gate structure.
- Defined color palette tokens (cream paper, charcoal ink, tomato red, turmeric yellow, coriander green).
- Configured typographic hierarchy (Bricolage Grotesque, DM Sans, JetBrains Mono).
- Migrated all editable content to standardized JSON format in `src/data/` (`clubInfo.json`, `events.json`, `departments.json`).
- Implemented `<Photo>` image slot component with aspect ratio framing, lazy loading, blur placeholder, and labeled fallback.
- Configured Tailwind v4 `@custom-variant dark` directive and updated `ThemeContext` to enable seamless class-based dark/light theme conversion.
- Restyled Events departures board to authentic Retro Solari Board with brass-riveted frame, unclipped typography, tactile mechanical flap tiles for time & platform, and glowing station signal indicators.
