# Study Feed

A phone-first study site that feels like scrolling a clean social feed: one idea per card, swipe up for the next one. Plain HTML, CSS and JavaScript with no build step, hosted on GitHub Pages.

## How it works

- **Home** (`index.html`) lists the courses. Each course has its own folder under `courses/`.
- **Course page** (`courses/<code>/index.html`) lists decks: one per lesson, a *Mixed review* deck per unit, and *Ones I've missed*.
- **Feed** (`courses/<code>/feed.html?deck=<id>`) plays a deck as full-screen cards with scroll snapping.
- **Progress** (`progress.html`) is a small view for parents: decks finished, first-try accuracy, weakest topics, best scores and recent sessions. It has a *parent mode* switch so a parent's own practice is not recorded, and a reset button.

Light and dark mode follow the device setting; the ◐ button overrides it.

## Card types

| Type | What it does |
|---|---|
| Explainer | One concept in a few short lines, with an example |
| Key term | The term, tap to reveal the meaning |
| Quick check | Multiple choice or true/false, instant feedback with a one-line "why" |

A quick check answered wrong comes back three cards later in the same session. Cards whose last answer was wrong make up the *Ones I've missed* deck; answering one correctly removes it from that deck.

## Progress storage

Everything is saved in the browser's `localStorage` under the key `studyfeed:v1`. Clearing site data, or using another browser or device, starts fresh.

## Optional: sync to a Google Sheet

With an Apps Script endpoint set in `assets/config.js`, the site also sends each answer and each finished deck to a private Google Sheet, so a parent can follow progress from any device. It sends only a random device id, card ids, right or wrong, scores and timestamps. Events queue in the browser and are sent in batches, so offline use still works. Parent mode stops both saving and sending. The script is in `apps-script/Code.gs` and the walkthrough is in [SHEET-SETUP.md](SHEET-SETUP.md).

## Adding content

Each course's cards live in `courses/<code>/cards.js`. Rules that keep progress tracking working:

- Every card has a stable id of the form `<course>-<unit>-<lesson>-<short>`. Never rename or reuse an id.
- Add new cards at the **end** of a lesson's list. Add new lessons at the end of a unit.
- Hebrew (or any right-to-left text) goes inside `«…»` so it renders right-to-left.

To add a course: create `courses/<code>/` with `cards.js`, `index.html` and `feed.html` (copy them from `courses/ivr1/`), then add the course to `courses/index.js`.

## Privacy

The site contains no names of students, schools or teachers. Card text is written in our own words from study notes, not copied from class handouts.

## Local preview

Any static server works, for example:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.
