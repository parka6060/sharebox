const path = require('path');
const fs = require('fs').promises;
const config = require('./config');

// Serve uploaded files
async function serveFile(req, res) {
  try {
    const filename = req.params.filename;
    const filepath = path.join(config.UPLOADS_DIR, filename);

    // obligatory security check despite single source of files
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    
    await fs.access(filepath);
    res.sendFile(path.resolve(filepath));
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
}

// Health check endpoint
function healthCheck(req, res) {
  res.json({ 
    status: 'healthy', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}

// Public stats endpoint
async function getPublicStats(req, res) {
  try {
    await fs.mkdir(config.UPLOADS_DIR, { recursive: true });
    
    const files = await fs.readdir(config.UPLOADS_DIR);
    
    const stats = {
      totalFiles: files.length,
      timestamp: new Date().toISOString()
    };
    
    let totalSize = 0;
    
    // Calculate actual disk usage for home display
    for (const file of files) {
      try {
        const filePath = path.join(config.UPLOADS_DIR, file);
        const stat = await fs.stat(filePath);
        totalSize += stat.size;
      } catch (error) {
        console.error(`Error reading file ${file}:`, error);
      }
    }
    
    stats.totalSizeMB = Math.round(totalSize / 1024 / 1024 * 100) / 100;
    
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
}

module.exports = {
  serveFile,
  healthCheck,
  getPublicStats
};