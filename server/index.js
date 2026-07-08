import express from "express";

const app = express();
const port = Number(process.env.PORT || 8787);

app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, status: "API running", note: "GPT generation module removed" });
});

app.listen(port, () => {
  console.log(`HTML Slide Studio API listening on http://localhost:${port}`);
});
