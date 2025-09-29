# Speed Typing Test

A small browser-based typing test that displays a random passage and measures words, errors, accuracy, and time.

Files

- `index.html` — main page and UI markup
- `styles.css` — styles and layout
- `script.js` — main application logic (timer, input handling, metrics)
- `textDisplay.js` — sample passages used by the test

Quick start

1. Open the `index.html` file in your browser (double-click or use a static server).

Or use the Live Server extension in VS Code.

How it works (short)

- On "Start Test" a random passage from `textDisplay.js` is rendered as individual spans.
- Keystrokes are tracked using `keydown` and compared against the spans to mark correct/incorrect characters.
- Timer counts down from 60 seconds and a completion popup shows final stats.

Copyright (c) 2025 [Abdulrahman ahmed]
