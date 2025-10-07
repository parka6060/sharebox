```text
        █████                                   █████                         
        ▒▒███                                   ▒▒███                          
  █████  ▒███████    ██████   ████████   ██████  ▒███████   ██████  █████ █████
 ███▒▒   ▒███▒▒███  ▒▒▒▒▒███ ▒▒███▒▒███ ███▒▒███ ▒███▒▒███ ███▒▒███▒▒███ ▒▒███ 
▒▒█████  ▒███ ▒███   ███████  ▒███ ▒▒▒ ▒███████  ▒███ ▒███▒███ ▒███ ▒▒▒█████▒  
 ▒▒▒▒███ ▒███ ▒███  ███▒▒███  ▒███     ▒███▒▒▒   ▒███ ▒███▒███ ▒███  ███▒▒▒███ 
 ██████  ████ █████▒▒████████ █████    ▒▒██████  ████████ ▒▒██████  █████ █████
▒▒▒▒▒▒  ▒▒▒▒ ▒▒▒▒▒  ▒▒▒▒▒▒▒▒ ▒▒▒▒▒      ▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒  ▒▒▒▒▒ ▒▒▒▒▒
```

A stupidly simple, basic, image/video upload server for ShareX with automatic compression. No database, just raw files accessed in a simple way.
This project was made for myself because I was tired of using services like https://sxcu.net/ and wanted a simple self-hosted alternative.

# How it works
The server accepts file uploads via ShareX or any HTTP client, it requires a valid `UPLOAD_TOKEN` for authentication. All accepted static images are compressed to WebP using `sharp`, videos are compressed to MP4 using  `ffmpeg-static`. There is no complicated databases, files are stored directly in the `data/` directory. File names are generated on the fly and are formated as YYYYMMDD-(file size in KB)K-(16 bytes as random hex value). That's about all you need to know! It's designed to be used as a personal image server and should run fine as long as there's disks space and a decent network speed. Heavy video compression is single threaded per upload and could potentially couse bottlenecking on low-powered systems. Lastly, no database is a feature :)


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
