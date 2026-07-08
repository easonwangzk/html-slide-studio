<!-- .slide: class="title-slide" -->
# HTML Slide Studio

<span class="pill">PPT-like web deck</span>

Fast editing, live demo, speaker notes, and teleprompter.

Note:
Open speaker view with **S**. Toggle teleprompter with **T**.
Use **[** and **]** to adjust teleprompter speed.

---
<!-- .slide: class="boxed" -->
## Why this repo

- Edit slides in one Markdown file
- Keep polished visuals without PPT lock-in
- Demo live in browser with URL sharing
- Add images and videos with simple syntax

Note:
If audience asks for source, open slides/content.md directly.

---
<!-- .slide: class="boxed" -->
## Media slide

<div class="media-grid">
  <div>
    <p><strong>Image:</strong> put files under <code>public/media</code> or use URL</p>
    <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80" alt="Sample" />
  </div>
  <div>
    <p><strong>Video:</strong> local mp4 or embed iframe</p>
    <video class="fit-video" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" controls muted></video>
  </div>
</div>

Note:
Video is muted by default for safer autoplay policies.

---
<!-- .slide: class="boxed" -->
## Demo controls

- Next/prev: arrow keys
- Overview mode: ESC
- Search slides: CTRL+SHIFT+F
- Zoom: ALT + click
- Presenter notes window: S
- In-window teleprompter: T

Note:
This is close to PPT presenter workflow, but fully web-native.

--
### Vertical child slide

Use `--` separator for vertical slides.

You can go down to this slide from parent.

---
<!-- .slide: class="boxed" -->
## Start building

1. Edit `slides/content.md`
2. Put media in `public/media`
3. Open `/studio.html` for AI generation and upload demo
4. Publish with GitHub Pages workflow

Note:
Mention that templates are in slides/templates.
