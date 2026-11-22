/*
  EXEMPLE de connexion côté index.html.
  Remplace API_URL par l'adresse Render de ton serveur.
  N'ajoute JAMAIS la clé Replicate dans ce fichier ou dans index.html.
*/
const API_URL = "https://TON-SERVICE.onrender.com";

async function verifierServeur() {
  const r = await fetch(`${API_URL}/api/health`);
  const data = await r.json();
  console.log(data);
  return data;
}

async function genererImage(prompt) {
  const r = await fetch(`${API_URL}/api/generate-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, aspect_ratio: "9:16" })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Erreur");
  return data; // Replicate prediction; si status n'est pas succeeded, poller /api/predictions/{id}
}

async function verifierGeneration(id) {
  const r = await fetch(`${API_URL}/api/predictions/${encodeURIComponent(id)}`);
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Erreur");
  return data;
}
