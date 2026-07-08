import Reveal from "reveal.js";
import Markdown from "reveal.js/plugin/markdown/markdown.esm.js";
import Highlight from "reveal.js/plugin/highlight/highlight.esm.js";
import Notes from "reveal.js/plugin/notes/notes.esm.js";
import Search from "reveal.js/plugin/search/search.esm.js";
import Zoom from "reveal.js/plugin/zoom/zoom.esm.js";

import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/white.css";
import "reveal.js/plugin/highlight/monokai.css";
import "./theme.css";

const deck = new Reveal({
  hash: true,
  history: true,
  controls: true,
  progress: true,
  center: true,
  slideNumber: "c/t",
  navigationMode: "default",
  transition: "slide",
  width: 1600,
  height: 900,
  margin: 0.05,
  plugins: [Markdown, Highlight, Notes, Search, Zoom]
});

const createTeleprompter = () => {
  const panel = document.createElement("aside");
  panel.className = "teleprompter";
  panel.setAttribute("aria-hidden", "true");
  document.body.appendChild(panel);

  let visible = false;
  let speed = 20;
  let frameId = null;

  const renderCurrentNotes = () => {
    const current = deck.getCurrentSlide();
    if (!current) {
      panel.textContent = "No slide selected.";
      return;
    }

    const notesNode = current.querySelector("aside.notes");
    const notesText = notesNode ? notesNode.textContent.trim() : "No speaker notes on this slide.";
    panel.textContent = notesText;
    panel.scrollTop = 0;
  };

  const tick = () => {
    if (!visible) {
      return;
    }
    panel.scrollTop += speed / 300;
    frameId = requestAnimationFrame(tick);
  };

  const startScroll = () => {
    if (frameId) {
      cancelAnimationFrame(frameId);
    }
    frameId = requestAnimationFrame(tick);
  };

  const stopScroll = () => {
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  };

  const toggle = () => {
    visible = !visible;
    panel.classList.toggle("teleprompter--open", visible);
    panel.setAttribute("aria-hidden", String(!visible));
    if (visible) {
      renderCurrentNotes();
      startScroll();
    } else {
      stopScroll();
    }
  };

  const increaseSpeed = () => {
    speed = Math.min(speed + 5, 60);
  };

  const decreaseSpeed = () => {
    speed = Math.max(speed - 5, 5);
  };

  document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "t") {
      event.preventDefault();
      toggle();
      return;
    }

    if (!visible) {
      return;
    }

    if (event.key === "]") {
      increaseSpeed();
    }
    if (event.key === "[") {
      decreaseSpeed();
    }
    if (event.key === " ") {
      event.preventDefault();
      if (frameId) {
        stopScroll();
      } else {
        startScroll();
      }
    }
  });

  deck.on("slidechanged", () => {
    if (visible) {
      renderCurrentNotes();
    }
  });
};

deck.initialize().then(() => {
  createTeleprompter();
});
