# AER Field App — manual & deploy

**Files here (the source):** `AER_Field_App.html`, `sw.js`,
`manifest.webmanifest`, `icon-192.png`, `icon-512.png`.
**Version label in the app:** `2026-08-30 · r11`.

This folder is now the **canonical source** for the field app. Edit and upload
to GitHub from here.

---

## Part A — Using the app (in the field)

The field app is a phone web-app (PWA). It records inspections, photos and batch
changes, and exports them so the desktop **Commit app** can fold them into the
master.

### Install on a phone (once)
1. Open the live URL in the phone's browser:
   **https://jacovanstraten-glitch.github.io/AER-field/AER_Field_App.html**
2. Use the browser menu → **Add to Home screen**. It now opens like an app and
   works offline.

### Each session
1. Open the app and **load the current `AER_Data.xlsx`** (or a batch CSV) so it
   knows the batches and current steps.
2. **Scan the QR** on a batch label (or type the code). The app shows the batch
   and its current step.
3. Record what you need:
   - **Inspection** — pot counts (≥3 → plants/pot is set automatically, rounded
     **down**), sizes, leaf colour, disease/other notes, photos.
   - **Batch change** — location, **Pots** and **Plants/pot** (the total
     "Plants" is calculated = Pots × Plants/pot, shown read-only), step status,
     and **Harvest / handover** with waste %.
   - **Photos** — taken with a batch-info overlay burned into the image.
4. **Export**. The app builds `inspections_*.csv`, `batch_edits_*.csv` and a
   photos ZIP. Share/save them into the OneDrive **inbox**
   (`02 Production\Crop Inspection\inbox\`).
5. On a desktop, open **commit_app.html** to review and commit them.

> Plants total is calculated, not typed. To correct the number growing, change
> **Pots** and/or **Plants/pot**. "Interim count" was removed on purpose.

---

## Part B — Publishing an update (deploy)

The live app runs on **GitHub Pages**. There is **no local git clone** — you
update it by uploading the changed files on the GitHub website.

- **Repo:** https://github.com/jacovanstraten-glitch/AER-field  (public)
- **Pages setting:** branch `main`, folder `/` (root)  (repo → Settings → Pages)
- **Files live in the repo root** (not in a sub-folder).

### Steps
1. Open https://github.com/jacovanstraten-glitch/AER-field
2. **Add file → Upload files**.
3. Drag in the changed files from **this** folder (usually
   `AER_Field_App.html` + `sw.js`). Keep the exact same names (this overwrites
   the old ones). `manifest.webmanifest` and the icons only need re-uploading if
   they changed.
4. **Commit changes**.
5. Wait ~1 minute for Pages to rebuild.

### Make phones pick up the new version
The app caches itself for offline use, so bump the cache version **every time
you change the app**:
- In `sw.js`, increase the line `const CACHE = 'aer-field-vN';` (e.g. v9 → v10)
  before uploading.
- On the phone after deploy: close the app and open it once more; the new
  service worker then activates.
- Confirm it worked: the **version label** on the start screen changed.

### Important
Because deploy is a manual upload, the OneDrive copy and the live site can drift
apart. Always upload right after you change the files here, and only edit the
copy in **this** folder from now on.
