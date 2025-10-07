// Utility functions for file processing and ID generation
const crypto = require('crypto');
const sharp = require('sharp');
const ffmpegStatic = require('ffmpeg-static');
const { spawn } = require('child_process');
const config = require('./config');

const generateSecureId = (fileSizeKB) => {
  const now = new Date();
  const dateStr = now.getFullYear().toString() + (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0');
  return `${dateStr}-${Math.round(fileSizeKB)}K-${crypto.randomBytes(16).toString('hex')}`;
};

// Fastest possible image compression while keeping quality
const compressImage = async (buffer, mimetype) => {
  try {
    let img = sharp(buffer, { animated: mimetype === 'image/gif' }).rotate();
    const meta = await img.metadata();
    // Only resize if needed .. saves cpu on small memory
    if ((meta.width || 0) > config.MAX_IMAGE_WIDTH) {
      img = img.resize(config.MAX_IMAGE_WIDTH, null, { withoutEnlargement: true, fit: 'inside' });
    }
    if (mimetype === 'image/gif') {
      // Fast GIF compression with your settings
      return img.gif({ colours: config.GIF_COLOURS, effort: config.GIF_EFFORT, dither: config.GIF_DITHER }).toBuffer();
    }
    // Fast WebP compression (no smartSubsample for speed)
    return img.webp({ quality: config.IMAGE_QUALITY, effort: config.WEBP_EFFORT }).toBuffer();
  } catch (error) {
    // On error, return original buffer (fail open, not fail closed)
    return buffer;
  }
};

// Fastest possible video compression (no unnecessary flags)
async function compressVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegStatic, [
      '-i', inputPath,
      '-vf', `scale='min(${config.VIDEO_MAX_WIDTH},iw)':-2`,
      '-c:v', 'libx264',
      '-crf', config.VIDEO_CRF.toString(),
      '-preset', config.VIDEO_PRESET,
      '-c:a', 'aac',
      '-b:a', config.AUDIO_BITRATE,
      '-movflags', '+faststart',
      '-pix_fmt', 'yuv420p',
      '-y',
      outputPath
    ]);
    ffmpeg.on('close', (code) => code === 0 ? resolve() : reject(new Error(`FFmpeg failed with code ${code}`)));
    ffmpeg.on('error', reject);
  });
}

module.exports = {
  generateSecureId,
  compressImage,
  compressVideo
};