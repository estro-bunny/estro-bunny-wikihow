const BACKEND_URL = (import.meta.env.VITE_NARRATOR_URL || "").replace(/\/$/, "");

export function narratorBackendAvailable() {
  return Boolean(BACKEND_URL);
}

export async function synthesizeNarratorAudio({ text, profile = "calm", signal } = {}) {
  if (!BACKEND_URL) throw new Error("NARRATOR_BACKEND_NOT_CONFIGURED");
  const response = await fetch(BACKEND_URL + "/synthesize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, profile }),
    signal
  });
  if (!response.ok) {
    let detail = "";
    try { detail = (await response.json()).detail || ""; } catch {}
    throw new Error(detail || "NARRATOR_BACKEND_" + response.status);
  }
  return response.blob();
}
