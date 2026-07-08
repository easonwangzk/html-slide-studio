# HTML Slide Studio

A PPT-like HTML demo repository focused on:

- easy editing
- easy presenting  
- live demo publishing
- image/video embedding
- speaker view and teleprompter support
- upload and present your HTML instantly

This version is built on Reveal.js + Vite, with a design direction inspired by the frontend-slides philosophy: bold visual language, editable source, and web-native presentation.

## Features

- Markdown-first authoring in `slides/content.md`
- PPT-style presenter workflow:
  - speaker view via Reveal notes (`S`)
  - teleprompter overlay in main window (`T`)
- Live demo with hot reload (`npm run dev`)
- Asset pipeline for image/video in `public/media`
- HTML Upload & Demo:
  - upload an existing HTML file for instant preview/demo
  - full-screen presentation mode
  - open in new window for presenter view
- Presenter support:
  - open Reveal speaker view with one click
  - teleprompter window with editable script and auto-scroll
  - uploaded non-Reveal HTML can also open a generic presenter view
- Mobile-friendly behavior for both slides and teleprompter
- GitHub Pages deployment workflow included

## Quick start

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

- Unified workbench (recommended): `/`
- Alias page (same UI): `/studio.html`

## Editing guide

### Add a horizontal slide

Use `---` in `slides/content.md`.

### Add a vertical slide group

Use `--` for child slides under the current slide.

### Add speaker notes

Add lines under `Note:` in each slide block.

### Add image or video

1. Put files in `public/media/`
2. Reference in markdown/html:

```html
<img src="/media/your-image.jpg" alt="description" />
<video src="/media/your-video.mp4" controls muted></video>
```

## Presentation shortcuts

- Next/prev slide: arrow keys
- Overview mode: `Esc`
- Search: `Ctrl+Shift+F`
- Zoom: `Alt + click`
- Speaker view: `S`
- Teleprompter overlay: `T`
- Teleprompter speed: `[` slower, `]` faster
- Teleprompter pause/resume: `Space`

## HTML Upload & Demo

Open `/studio.html` or `/` and:
1. Upload an HTML file (*.html)
2. Preview instantly in the iframe
3. Open full-screen or in a new window for presentation
4. Use presenter view with speaker notes
5. Open teleprompter window for notes/script display

## Deploy live demo (GitHub Pages)

1. Push this folder as a GitHub repository.
2. In GitHub, enable Pages with "GitHub Actions" as source.
3. Push to `main`; workflow auto-builds and deploys.

The workflow sets `BASE_PATH` automatically for project pages.

## Project structure

```text
html-slide-studio/
  index.html
  studio.html
  package.json
  vite.config.js
  .env.example
  server/
    index.js
  src/
    main.js
    theme.css
    studio.js
    studio.css
  slides/
    content.md
    templates/
      business.md
      product-demo.md
  public/
    media/
      sample-image.jpg
      sample-video.mp4
  .github/
    workflows/
      deploy-pages.yml
```

## Next upgrades (recommended)

- Add multiple visual themes and runtime theme switcher
- Add PDF export script via Playwright
- Add synchronized remote presenter mode
- Add one-command deck scaffolding script
