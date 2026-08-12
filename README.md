# MediTime — Your Pharmacy Companion

A healthcare capstone project built for the 2026 Design Phase Cohort (eHealth Africa), designed and developed by a pharmacist with real patient-care problems in mind.

## Overview

MediTime is a single-page web app with one shared home screen and five sections, each tackling a common pharmacy-related need:

- **Doses** — Medication reminder & adherence tracker. Add medications with dosage and time, mark doses as taken, and track a daily streak.
- **Interactions** — A simplified drug interaction checker. Select two or more sample medications to see illustrative interaction warnings.
- **Pharmacy** — A pharmacy locator with sample listings, plus a refill request form and a status tracker for submitted requests.
- **Med guide** — A searchable library of common medications with dosage, purpose, and side effects in plain language.
- **Symptom guide** — A simple triage flow: pick a symptom and get guidance on whether it calls for self-care, a pharmacist, or a doctor.

The home screen shows an at-a-glance adherence ring and streak counter, with quick navigation into each section.

> **Note:** The interaction and symptom data in this app is a small, illustrative sample set built for demonstration purposes — it is not exhaustive and is not a substitute for professional medical or pharmacist advice.

## Tech stack

- HTML5
- CSS3 (custom properties, no framework)
- Vanilla JavaScript (no libraries)
- `localStorage` for saving doses, streaks, and refill requests between visits

## Design

- **Fonts:** Fraunces (headings), Inter (body/UI)
- **Palette:** Soft teal/green as the primary color, warm coral as the accent for alerts and overdue doses
- UI designed in Figma before development, following mentor-approved wireframes

## Project structure

```
health-app/
├── index.html      # App structure and all five views
├── style.css       # Styling and layout
├── script.js       # App logic: routing, doses, interactions, pharmacy, guide, symptoms
└── README.md
```

## Running locally

1. Clone or download this repository.
2. Open the folder in VS Code (or any editor).
3. Open `index.html` directly in a browser, or use the **Live Server** VS Code extension for auto-reload while editing.

## Deployment

This project is deployed and publicly accessible at:

`[https://pharm-meditime.netlify.app]`
`[https://www.figma.com/design/f8BhLVD9cJLQbH2Mp4GXIq/MediTime-%E2%80%94-Capstone-UI?node-id=0-1&t=gpkDGWBmukjBEqKi-1]`
## Author

Faiza — Pharmacist, Web Development Student (2026 Design Phase Cohort, eHealth Africa)
