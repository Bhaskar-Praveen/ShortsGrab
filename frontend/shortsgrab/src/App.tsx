import { useState } from "react";
import { detectPlatform } from "./utils/detectPlatform";

export default function App() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("best");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const platform = detectPlatform(url);
  const isValidUrl = url && /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|instagram\.com)/i.test(url);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.error("Paste failed");
    }
  };

  const handleDownload = () => {
    if (!isValidUrl) {
      alert("Please enter a valid URL");
      return;
    }
    setIsDownloading(true);
    const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&quality=${quality}`;
    window.open(downloadUrl, '_blank');
    setTimeout(() => setIsDownloading(false), 3000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>📱</span>
          <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>ShortsGrab</span>
        </div>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 15px',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Main Card */}
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        marginTop: '80px'
      }}>
        
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '32px', 
          marginBottom: '10px',
          color: '#333'
        }}>
          Download Videos
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          marginBottom: '30px' 
        }}>
          YouTube Shorts & Instagram Reels
        </p>

        {/* URL Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '14px',
            fontWeight: '600',
            color: '#333'
          }}>
            Video URL
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/shorts/..."
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            <button
              onClick={handlePaste}
              style={{
                padding: '12px 20px',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333'
              }}
            >
              Paste
            </button>
          </div>
          {platform !== "unknown" && url && (
            <div style={{ 
              marginTop: '8px',
              fontSize: '12px',
              color: '#667eea',
              fontWeight: '600'
            }}>
              {platform === "youtube" && "✓ YouTube"}
              {platform === "instagram" && "✓ Instagram"}
            </div>
          )}
        </div>

        {/* Quality Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '14px',
            fontWeight: '600',
            color: '#333'
          }}>
            Quality
          </label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
              background: 'white'
            }}
          >
            <option value="best">Best Quality</option>
            <option value="4k">4K (2160p)</option>
            <option value="1080p">Full HD (1080p)</option>
            <option value="720p">HD (720p)</option>
            <option value="480p">SD (480p)</option>
            <option value="360p">Low (360p)</option>
          </select>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={!isValidUrl || isDownloading}
          style={{
            width: '100%',
            padding: '16px',
            background: isValidUrl && !isDownloading 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isValidUrl && !isDownloading ? 'pointer' : 'not-allowed',
            transition: 'transform 0.2s',
            boxShadow: isValidUrl ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (isValidUrl && !isDownloading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {isDownloading ? 'Opening Download...' : 'Download Video'}
        </button>

        {isValidUrl && (
          <p style={{ 
            textAlign: 'center', 
            marginTop: '15px', 
            fontSize: '12px', 
            color: '#999' 
          }}>
            Format: MP4 • Quality: {quality.toUpperCase()}
          </p>
        )}
      </div>

      {/* Features */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        maxWidth: '500px',
        width: '100%',
        marginTop: '30px'
      }}>
        <Feature icon="🎬" text="Multiple Platforms" />
        <Feature icon="⚡" text="Fast Downloads" />
        <Feature icon="🎯" text="Up to 4K" />
      </div>

      {/* Footer */}
      <p style={{ 
        color: 'white', 
        fontSize: '14px', 
        marginTop: '40px',
        opacity: 0.8
      }}>
        © 2026 ShortsGrab • Made with ❤️
      </p>
    </div>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.2)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      padding: '15px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '5px' }}>{icon}</div>
      <p style={{ color: 'white', fontSize: '12px', fontWeight: '600', margin: 0 }}>{text}</p>
    </div>
  );
}
