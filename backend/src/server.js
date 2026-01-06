const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const rateLimit = require("express-rate-limit");

const app = express();

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.RATE_LIMIT_MAX || 10,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:8080'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/download', limiter);

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    service: "shortsgrab-backend",
    version: "1.0.0"
  });
});

/**
 * FIXED: Quality format mapping - prioritizes pre-merged formats
 */
const getFormatString = (quality) => {
  const formats = {
    // Try to get pre-merged MP4 first, then merge best video+audio
    'best': 'bestvideo[ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best[ext=mp4]/bestvideo+bestaudio/best',
    '4k': 'bestvideo[height<=2160][ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best[height<=2160][ext=mp4]/bestvideo[height<=2160]+bestaudio/best',
    '1080p': 'bestvideo[height<=1080][ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/bestvideo[height<=1080]+bestaudio/best',
    '720p': 'bestvideo[height<=720][ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/bestvideo[height<=720]+bestaudio/best',
    '480p': 'bestvideo[height<=480][ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/bestvideo[height<=480]+bestaudio/best',
    '360p': 'bestvideo[height<=360][ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]/bestvideo[height<=360]+bestaudio/best'
  };
  
  return formats[quality] || formats['best'];
};

/**
 * Validate URL
 */
const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|instagram\.com|instagr\.am)/i.test(url);
  } catch {
    return false;
  }
};

/**
 * Get video metadata for filename
 */
const getVideoMetadata = (url) => {
  return new Promise((resolve, reject) => {
    const ytdlp = spawn("yt-dlp", [
      "--print", "%(title)s|||%(uploader)s",
      "--no-playlist",
      url
    ]);

    let output = '';
    
    ytdlp.stdout.on('data', (data) => {
      output += data.toString();
    });

    ytdlp.on('close', (code) => {
      if (code === 0 && output) {
        const [title, uploader] = output.trim().split('|||');
        const sanitizedTitle = (title || 'video').replace(/[<>:"/\\|?*]/g, '_').substring(0, 100);
        resolve({ title: sanitizedTitle, uploader: uploader || 'unknown' });
      } else {
        resolve({ title: `video_${Date.now()}`, uploader: 'unknown' });
      }
    });
  });
};

/**
 * FIXED: STREAMING DOWNLOAD with proper MP4 output
 */
app.get("/api/download", async (req, res) => {
  const { url, quality = 'best' } = req.query;
  
  // Validation
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Invalid URL parameter" });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: "Unsupported platform or invalid URL" });
  }

  const validQualities = ['best', '4k', '1080p', '720p', '480p', '360p'];
  if (!validQualities.includes(quality)) {
    return res.status(400).json({ error: "Invalid quality parameter" });
  }

  console.log(`[${new Date().toISOString()}] Download: ${url} | Quality: ${quality} | IP: ${req.ip}`);

  try {
    // Get video metadata
    const metadata = await getVideoMetadata(url);
    const filename = `${metadata.title}.mp4`;

    // Set headers
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("X-Content-Type-Options", "nosniff");

    const formatString = getFormatString(quality);

    // FIXED: Spawn yt-dlp with better merging options
    const ytdlp = spawn("yt-dlp", [
      "-f", formatString,
      "-o", "-",
      "--no-playlist",
      "--no-part",
      "--quiet",
      "--no-warnings",
      // CRITICAL: Force remux to MP4 container with video+audio
      "--remux-video", "mp4",
      "--merge-output-format", "mp4",
      // Prefer h264/avc codec (better compatibility)
      "--format-sort", "vcodec:h264,acodec:m4a",
      "--max-filesize", "500M",
      url
    ]);

    // Pipe to response
    ytdlp.stdout.pipe(res);

    // Error handling
    ytdlp.stderr.on("data", (data) => {
      console.error(`[yt-dlp]: ${data.toString()}`);
    });

    ytdlp.on("close", (code) => {
      if (code !== 0) {
        console.error(`[yt-dlp] Process exited with code ${code}`);
        if (!res.headersSent) {
          res.status(500).json({ error: "Download failed. The video may be unavailable or restricted." });
        }
      }
      res.end();
    });

    // Handle client disconnect
    req.on("close", () => {
      if (!ytdlp.killed) {
        ytdlp.kill("SIGKILL");
      }
    });

  } catch (error) {
    console.error('Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to process request" });
    }
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⚡ Rate limit: ${process.env.RATE_LIMIT_MAX || 10} requests/minute`);
});