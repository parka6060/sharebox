         █████                                   █████                         
        ▒▒███                                   ▒▒███                          
  █████  ▒███████    ██████   ████████   ██████  ▒███████   ██████  █████ █████
 ███▒▒   ▒███▒▒███  ▒▒▒▒▒███ ▒▒███▒▒███ ███▒▒███ ▒███▒▒███ ███▒▒███▒▒███ ▒▒███ 
▒▒█████  ▒███ ▒███   ███████  ▒███ ▒▒▒ ▒███████  ▒███ ▒███▒███ ▒███ ▒▒▒█████▒  
 ▒▒▒▒███ ▒███ ▒███  ███▒▒███  ▒███     ▒███▒▒▒   ▒███ ▒███▒███ ▒███  ███▒▒▒███ 
 ██████  ████ █████▒▒████████ █████    ▒▒██████  ████████ ▒▒██████  █████ █████
▒▒▒▒▒▒  ▒▒▒▒ ▒▒▒▒▒  ▒▒▒▒▒▒▒▒ ▒▒▒▒▒      ▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒  ▒▒▒▒▒ ▒▒▒▒▒

A stupidly simple, basic, image/video upload server for ShareX with automatic compression. Made with the intention to be self-hosted, tested on a very small scale. No database, just raw files accessed in a simple way.


# Features
1. ShareX uploads via /upload & UPLOAD_TOKEN
2. Images, gifs, and video compression.
3. Simple public stats endpoint

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/parka6060/sharebox.git
cd sharebox
npm install
```

### 2. Configure
Edit `src/config.js` or set environment variables:
- `PORT` (default: 3333)
- `BASE_URL` (your public URL:port)
- `UPLOAD_TOKEN` (just type jibberish here)

### 3. Run
```bash
npm start
```

I'll write a docker tutorial if I find time.

MIT
