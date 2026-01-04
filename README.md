# 📱 ShortsGrab

Download videos from YouTube and Instagram in multiple quality options (360p to 4K).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)

## ✨ Features

- 🎬 **Multiple Platforms**: YouTube & Instagram support
- ⚡ **Fast Streaming**: Zero-disk downloads
- 🎯 **Quality Options**: 360p, 480p, 720p, 1080p, 4K
- 📱 **Responsive Design**: Works on mobile and desktop
- 🔒 **Rate Limited**: Protected against abuse
- 🐳 **Docker Ready**: Easy deployment

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/Bhaskar-Praveen/ShortsGrab.git
cd ShortsGrab

# Copy environment file
cp .env.example .env

# Build and start
docker-compose up --build
```

Visit `http://localhost:8080` 🎉

## 🛠️ Configuration

Edit `.env` file:
```env
PORT=4000
NODE_ENV=production
RATE_LIMIT_MAX=10
ALLOWED_ORIGINS=http://localhost:8080
```

## 📦 Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- TailwindCSS

**Backend:**
- Node.js + Express
- yt-dlp
- ffmpeg

## ⚠️ Disclaimer

This tool is for downloading publicly accessible content only. Users are responsible for complying with copyright laws and platform terms of service.

## 📄 License

MIT License - feel free to use this project however you like!

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Video download engine
- Built with ❤️ for content creators

---

**⚠️ Important**: Always respect content creators' rights and platform policies.
