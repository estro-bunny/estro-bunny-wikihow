"""EstroBunny Narrator Server — local neural TTS adapter.

This intentionally stays model-agnostic at the HTTP boundary. Piper is the
first backend; a future backend can implement the same /synthesize contract.
"""

import io
import json
import os
import wave
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from piper import PiperVoice, SynthesisConfig

ROOT = Path(__file__).resolve().parent
VOICE = os.environ.get("ESTRO_VOICE", "en_US-lessac-medium")
VOICE_PATH = Path(os.environ.get("ESTRO_VOICE_PATH", ROOT / "voices" / f"{VOICE}.onnx"))
HOST = os.environ.get("ESTRO_NARRATOR_HOST", "127.0.0.1")
PORT = int(os.environ.get("ESTRO_NARRATOR_PORT", "8787"))

VOICE_CACHE = {}


def load_voice():
    key = str(VOICE_PATH)
    if key not in VOICE_CACHE:
        VOICE_CACHE[key] = PiperVoice.load(key, use_cuda=os.environ.get("ESTRO_USE_CUDA") == "1")
    return VOICE_CACHE[key]


def profile_config(profile):
    profiles = {
        "calm": {"length_scale": 1.0, "noise_scale": 0.667, "noise_w_scale": 0.8, "volume": 1.0},
        "chaotic": {"length_scale": 0.9, "noise_scale": 0.82, "noise_w_scale": 0.95, "volume": 1.0},
        "estro-bunny": {"length_scale": 0.86, "noise_scale": 0.9, "noise_w_scale": 1.05, "volume": 1.0},
        "documentation-failed": {"length_scale": 0.96, "noise_scale": 1.0, "noise_w_scale": 1.15, "volume": 0.96},
    }
    return profiles.get(profile, profiles["calm"])


class Handler(BaseHTTPRequestHandler):
    def send_json(self, status, payload):
        data = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            self.send_json(200, {"ok": True, "engine": "piper", "voice": VOICE, "voice_path": str(VOICE_PATH)})
            return
        if self.path == "/profiles":
            self.send_json(200, {"profiles": ["calm", "chaotic", "estro-bunny", "documentation-failed"]})
            return
        self.send_json(404, {"error": "Not found"})

    def do_POST(self):
        if self.path != "/synthesize":
            self.send_json(404, {"error": "Not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            body = json.loads(self.rfile.read(length) or b"{}")
            text = str(body.get("text", "")).strip()
            if not text:
                self.send_json(400, {"error": "text is required"})
                return
            profile = str(body.get("profile", "calm"))
            config = profile_config(profile)
            voice = load_voice()
            buffer = io.BytesIO()
            voice.synthesize_wav(text, buffer, syn_config=SynthesisConfig(**config))
            audio = buffer.getvalue()
            self.send_response(200)
            self.send_header("Content-Type", "audio/wav")
            self.send_header("Content-Length", str(len(audio)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(audio)
        except Exception as exc:
            self.send_json(500, {"error": "synthesis failed", "detail": str(exc)})

    def log_message(self, format, *args):
        print("[narrator-server]", format % args)


if __name__ == "__main__":
    print(f"EstroBunny Narrator listening on http://{HOST}:{PORT}")
    print(f"Voice: {VOICE_PATH}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
