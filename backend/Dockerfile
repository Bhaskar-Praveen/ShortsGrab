FROM node:20-alpine

WORKDIR /app

# Install system deps (NO pip)
RUN apk add --no-cache \
    python3 \
    ffmpeg \
    yt-dlp \
    curl

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:4000/health || exit 1

USER app

CMD ["node", "src/server.js"]
