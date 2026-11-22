const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 10000;
const TOKEN = process.env.REPLICATE_API_TOKEN;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";
const IMAGE_MODEL = process.env.REPLICATE_IMAGE_MODEL || "black-forest-labs/flux-schnell";
const VIDEO_MODEL = process.env.REPLICATE_VIDEO_MODEL || "";

app.use(cors({
  origin: FRONTEND_ORIGIN === "*" ? true : FRONTEND_ORIGIN.split(",").map(x => x.trim()),
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

function requireToken(req, res, next) {
  if (!TOKEN) return res.status(503).json({
    error: "Clé API serveur manquante. Ajoutez REPLICATE_API_TOKEN dans Render > Environment."
  });
  next();
}

function validPrompt(prompt) {
  return typeof prompt === "string" && prompt.trim().length >= 3 && prompt.length <= 5000;
}

async function replicate(path, options = {}) {
  const response = await fetch("https://api.replicate.com/v1" + path, {
    ...options,
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.detail || data.error || `Erreur API Replicate (${response.status})`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }
  return data;
}

app.get("/", (req, res) => res.json({
  name: "Ciné-Genesis AI API",
  status: "online",
  endpoints: ["/api/health", "/api/generate-image", "/api/generate-video", "/api/predictions/:id"]
}));

app.get("/api/health", (req, res) => res.json({
  ok: true,
  service: "Ciné-Genesis AI",
  imageModel: IMAGE_MODEL,
  videoConfigured: Boolean(VIDEO_MODEL),
  apiKeyConfigured: Boolean(TOKEN)
}));

app.post("/api/generate-image", requireToken, async (req, res) => {
  try {
    const { prompt, aspect_ratio = "9:16" } = req.body || {};
    if (!validPrompt(prompt)) return res.status(400).json({ error: "Prompt manquant ou trop long." });
    const prediction = await replicate(`/models/${IMAGE_MODEL}/predictions`, {
      method: "POST",
      headers: { "Prefer": "wait=5" },
      body: JSON.stringify({ input: { prompt: prompt.trim(), aspect_ratio } })
    });
    res.json(prediction);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || "Échec de génération d'image." });
  }
});

app.post("/api/generate-video", requireToken, async (req, res) => {
  try {
    if (!VIDEO_MODEL) return res.status(503).json({
      error: "Le modèle vidéo n'est pas configuré. Ajoutez REPLICATE_VIDEO_MODEL dans Render avec un modèle vidéo Replicate compatible."
    });
    const { prompt, aspect_ratio = "9:16", duration = 5 } = req.body || {};
    if (!validPrompt(prompt)) return res.status(400).json({ error: "Prompt manquant ou trop long." });
    // Le schéma d'entrée dépend du modèle vidéo choisi. Ce modèle attend prompt, aspect_ratio et duration.
    const prediction = await replicate(`/models/${VIDEO_MODEL}/predictions`, {
      method: "POST",
      headers: { "Prefer": "wait=5" },
      body: JSON.stringify({ input: { prompt: prompt.trim(), aspect_ratio, duration: Number(duration) } })
    });
    res.json(prediction);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || "Échec de génération vidéo." });
  }
});

app.get("/api/predictions/:id", requireToken, async (req, res) => {
  try {
    const prediction = await replicate(`/predictions/${encodeURIComponent(req.params.id)}`);
    res.json(prediction);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || "Impossible de vérifier la génération." });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Ciné-Genesis API démarrée sur le port ${PORT}`);
});
