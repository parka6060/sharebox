// Configuration. Mainly for compression settings, by default we use webp for images and h.264 for videos.
require('dotenv').config();

const config = {
  // Server settings
  PORT: process.env.PORT || 3000,
  BASE_URL: process.env.BASE_URL,
  
  // Authentication
  UPLOAD_TOKEN: process.env.UPLOAD_TOKEN,
  
  // Storage paths
  UPLOADS_DIR: './data',
  
  // Image compression - webp settings
  IMAGE_QUALITY: 85, 
  MAX_IMAGE_WIDTH: 1920, 
  WEBP_EFFORT: 6, 
  
  // GIF compression
  GIF_COLOURS: 128, 
  GIF_EFFORT: 9, 
  GIF_DITHER: 0.8,
  
  // Video compression - h.264 settings
  VIDEO_CRF: 24,
  VIDEO_PRESET: 'slower',
  AUDIO_BITRATE: '96k', 
  VIDEO_MAX_WIDTH: 1280, 
  
  // File limits
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  
  // Security headers
  HELMET_CONFIG: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
      },
    },
  }
};

module.exports = config;