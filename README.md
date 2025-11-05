Usage
-----

This project is a single-page portfolio. I updated styles and JS to use a background image for the hero and added more advanced interactivity (particles, parallax, mobile navigation, skills animations, portfolio filtering, testimonials slider, back-to-top, and client-side form validation).

Important: place the supplied image you attached into the project at:

assets/hero-bg.jpg

Create the folder if it doesn't exist. Example path from your workspace root:

c:\Users\HP\Desktop\portfolio\assets\hero-bg.jpg

If you prefer a different filename/path, update `css/style.css` (the override at the bottom) and/or the path in `.showcase:before`.

How to test locally
-------------------

Open `index.html` in a browser (Chrome/Edge/Firefox). For best experience serve with a simple static server, e.g. using Python:

# Windows PowerShell
python -m http.server 8000 ; Start-Process http://localhost:8000

Notes & next steps
------------------
- The hero background references `assets/hero-bg.jpg`. If you want me to add the image file to the repo directly, upload it here or tell me and I'll embed a copy (note: binary files must be provided).
- I added a slide-in nav that toggles with the menu toggle button and keyboard (Enter/Space). Accessibility is improved with `aria-expanded` and focus styles.
- If you'd like a different particle style (lines, connections), I can switch the canvas routine.
- I created non-destructive overrides in CSS (appended to the end), so original styles are preserved.

If you want, I can also:
- Add a small unit test or a dev NPM-based setup to run a local server + live reload.
- Convert the project to use a build toolchain (Vite) for asset bundling.

Tell me if you'd like me to embed the image into the repo or further tune animations and accessibility.