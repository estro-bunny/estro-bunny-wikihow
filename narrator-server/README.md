# EstroBunny Narrator Server

Local neural TTS adapter for EstroBunny WikiHow.

The frontend talks to this server through a tiny stable contract:

- `GET /health` — backend/voice status
- `GET /profiles` — available delivery profiles
- `POST /synthesize` — returns WAV audio

## Why this exists

The WikiHow frontend should not care which TTS engine is underneath it.

Today:

`Narrator Engine → Piper`

Later:

`Narrator Engine → whatever voice backend we decide to abuse next`

The current Piper project is maintained by Open Home Foundation as `OHF-Voice/piper1-gpl`. Its Python API supports local synthesis, synthesis configuration, and optional CUDA acceleration. See the project documentation before deploying models or voices.

## Local setup

From this directory:

```sh
python -m venv .venv
# Windows:
.venv\\Scripts\\activate
# macOS/Linux:
source .venv/bin/activate

python -m pip install -r requirements.txt
python -m piper.download_voices en_US-lessac-medium
python server.py
```

The server defaults to:

`http://127.0.0.1:8787`

For another voice:

```sh
set ESTRO_VOICE=en_US-lessac-medium
```

or on macOS/Linux:

```sh
export ESTRO_VOICE=en_US-lessac-medium
```

You can point directly at a model with `ESTRO_VOICE_PATH`.

## Frontend

Create a local `.env.local`:

```env
VITE_NARRATOR_URL=http://127.0.0.1:8787
```

If that variable is absent or the server is unavailable, the browser SpeechSynthesis fallback remains available.

## Voice licensing

Piper itself and individual voice models are separate licensing concerns. Check the model card/license for every voice you deploy before redistribution or commercial use.
