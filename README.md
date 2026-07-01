# NCM Lab

A client-side developer toolkit for Motadata NCM debugging.
Hosted on Vercel — accessible from any browser, no install required.

## Features

- **Decrypt Backup** — server-side decryption of `running.file.content` / `startup.file.content` fields from NCM config backup records (AES-ECB + Base64). The encryption key never leaves the server.
- **Epoch Converter** — convert epoch values (ms or seconds, auto-detected) to human-readable timestamps across timezones, and reverse.
- **JSON / XML Tools** — prettify, minify, and line-level diff for JSON and XML payloads.

## Architecture

Decryption runs as a Vercel serverless function (`/api/decrypt`). The browser sends the encrypted text; the server decrypts using the key stored in an environment variable and returns the plaintext. All other features run entirely client-side.

```
Browser                          Vercel Serverless
───────────────────────────────  ─────────────────────────────
POST /api/decrypt            →   reads CIPHER_KEY from env
{ ciphertext: "<base64>" }       decrypts server-side
                             ←   { plaintext: "..." }
```

## Environment Variables

| Variable     | Description                              |
|--------------|------------------------------------------|
| `CIPHER_KEY` | 16-character AES-128 key for decryption  |

Set this in **Vercel → Project Settings → Environment Variables**.
Never commit the actual key — `.env` files are gitignored.

A `.env.example` is provided as a template.

## Local Development

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Copy env template and fill in the key
cp .env.example .env.local

# 3. Run locally with serverless function support
vercel dev
```

## Deployment

1. Push this repo to GitHub.
2. Import the repo in [vercel.com](https://vercel.com) → **New Project**.
3. Add `CIPHER_KEY` under **Project Settings → Environment Variables**.
4. Deploy — Vercel auto-detects `api/decrypt.js` as a serverless function.

All subsequent pushes to `main` redeploy automatically.
