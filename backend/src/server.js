const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const rateLimit = require("express-rate-limit");

const app = express();

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.RATE_LIMIT_MAX || 10, // limit each IP to 10 requests per minute
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
    // Allow requests with no origin (mobile apps, curl, etc.)
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

// Apply rate limiter to download endpoint
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
 * Quality format mapping for yt-dlp
 */
const getFormatString = (quality) => {
  const formats = {
    'best': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    '4k': 'bestvideo[height<=2160][ext=mp4]+bestaudio[ext=m4a]/best[height<=2160][ext=mp4]/best',
    '1080p': 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best',
    '720p': 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best',
    '480p': 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/best',
    '360p': 'bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]/best'
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
 * STREAMING DOWNLOAD with Quality Options
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

  // Validate quality parameter
  const validQualities = ['best', '4k', '1080p', '720p', '480p', '360p'];
  if (!validQualities.includes(quality)) {
    return res.status(400).json({ error: "Invalid quality parameter" });
  }

  console.log(`[${new Date().toISOString()}] Download: ${url} | Quality: ${quality} | IP: ${req.ip}`);

  // Set headers
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", `attachment; filename="shortsgrab_${quality}.mp4"`);
  res.setHeader("X-Content-Type-Options", "nosniff");

  const formatString = getFormatString(quality);

  // Spawn yt-dlp
  const ytdlp = spawn("yt-dlp", [
    "-f", formatString,
    "-o", "-",
    "--no-playlist",
    "--no-part",
    "--quiet",
    "--no-warnings",
    "--merge-output-format", "mp4",
    "--max-filesize", "500M", // Limit file size to 500MB
    url
  ]);

  // Pipe to response
  ytdlp.stdout.pipe(res);

  // Error handling
  ytdlp.stderr.on("data", (data) => {
    console.error(`[yt-dlp error]: ${data.toString()}`);
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