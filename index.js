const express = require('express');
const multer = require('multer');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs').promises;

const config = require('./src/config');
const { generateSecureId, compressImage, compressVideo } = require('./src/utils');
const { serveFile, healthCheck, getPublicStats } = require('./src/routes');

const app = express();

// Express setup
app.use(helmet(config.HELMET_CONFIG));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Multer configuration for file uploads, holds file in memory for processing before saving to memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const allowedMimes = /^(image|video)\//;
    if (allowedMimes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// Routes
app.get('/favicon.ico', (req, res) => {
  res.setHeader('Content-Type', 'image/x-icon');
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});
app.get('/:filename', serveFile);
app.get('/health', healthCheck);
app.get('/api/public-stats', getPublicStats);

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  const startTime = Date.now();
  const token = req.headers.upload_token || req.headers.UPLOAD_TOKEN || req.headers['upload-token'] || req.headers.authorization?.replace('Bearer ', '');
  

  
  if (!token || token !== config.UPLOAD_TOKEN) {
    return res.status(401).json({ 
      error: 'Invalid or missing token',
      message: 'Provide token in upload_token, UPLOAD_TOKEN, upload-token header or Authorization: Bearer header'
    });
  }
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { buffer, mimetype, originalname } = req.file;
    let finalBuffer = buffer;
    const fileSizeKB = finalBuffer.length / 1024;
    const fileId = generateSecureId(fileSizeKB);
    let fileExtension = path.extname(originalname).toLowerCase();
    
    // Process based on file type
    if (mimetype.startsWith('image/')) {
      try {
        finalBuffer = await compressImage(buffer, mimetype);
        if (mimetype !== 'image/gif') {
          fileExtension = '.webp';
        }
      } catch (error) {
        console.error('Image processing failed:', error);
      }
    } else if (mimetype.startsWith('video/')) {
      try {
        const tempInput = path.join(config.UPLOADS_DIR, `temp_${fileId}${fileExtension}`);
        const compressedPath = path.join(config.UPLOADS_DIR, `${fileId}.mp4`);
        
        await fs.writeFile(tempInput, buffer);
        await compressVideo(tempInput, compressedPath);
        
        finalBuffer = await fs.readFile(compressedPath);
        await fs.unlink(tempInput);
        fileExtension = '.mp4';
        
        const fileUrl = `${config.BASE_URL}/${fileId}${fileExtension}`;
        
        return res.json({
          success: true,
          url: fileUrl,
          filename: `${fileId}.mp4`,
          id: fileId
        });
      } catch (error) {
        console.error('Video processing failed:', error);
      }
    }
    
    // Save file
    const filename = `${fileId}${fileExtension}`;
    const filepath = path.join(config.UPLOADS_DIR, filename);
    await fs.writeFile(filepath, finalBuffer);
    

    
    const fileUrl = `${config.BASE_URL}/${fileId}${fileExtension}`;
    
    res.json({
      success: true,
      url: fileUrl,
      filename: filename,
      id: fileId
    });
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`Upload failed (${processingTime}ms):`, error.message);
    
    let errorMessage = 'Upload failed';
    if (error.message.includes('File too large')) {
      errorMessage = `File too large. Maximum size is ${config.MAX_FILE_SIZE / 1024 / 1024}MB`;
    } else if (error.message.includes('Only image and video')) {
      errorMessage = 'Only image and video files are allowed';
    }
    
    res.status(500).json({ 
      error: errorMessage, 
      message: error.message,
      processingTime: `${processingTime}ms`
    });
  }
});

// Server startup
app.listen(config.PORT, async () => {
  await fs.mkdir(config.UPLOADS_DIR, { recursive: true });
  console.log(`ShareBox listening on port ${config.PORT}`);
});