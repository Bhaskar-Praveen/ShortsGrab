import { useState } from 'react';
import BreathingExercise from './BreathingExercise';

interface DownloadButtonProps {
  url: string;
  isDarkMode?: boolean;  // ← ADD THIS
}

type Quality = 'best' | '4k' | '1080p' | '720p' | '480p' | '360p';

export default function DownloadButton({ url, isDarkMode = true }: DownloadButtonProps) {  // ← ADD isDarkMode
  const [quality, setQuality] = useState<Quality>('best');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (!url || !url.trim()) {
      alert("Please paste a valid video URL first");
      return;
    }

    setIsDownloading(true);
    const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&quality=${quality}`;
    window.location.href = downloadUrl;  // ← FIXED: Changed from window.open
    
    setTimeout(() => {
      setIsDownloading(false);
    }, 8000);
  };

  const isValidUrl = url && /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|instagram\.com)/i.test(url);

  if (isDownloading) {
    return (
      <div className="space-y-4">
        <div className={`backdrop-blur-sm rounded-2xl p-6 border ${
          isDarkMode ? 'bg-gray-900/30 border-white/10' : 'bg-gray-50 border-gray-200'
        }`}>
          <BreathingExercise isDarkMode={isDarkMode} />  {/* ← FIXED */}
        </div>
        <button
          onClick={() => setIsDownloading(false)}
          className={`w-full px-4 py-2 rounded-xl text-sm transition-all border ${
            isDarkMode 
              ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-900 border-gray-300'
          }`}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className={`block text-center text-sm font-medium mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Select Quality
        </label>
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value as Quality)}
          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all text-center font-medium ${
            isDarkMode 
              ? 'bg-white/90 text-gray-900 border-transparent focus:border-white' 
              : 'bg-white text-gray-900 border-gray-300 focus:border-purple-500'
          }`}
        >
          <option value="best">🎬 Best Quality</option>
          <option value="4k">🎥 4K - 2160p</option>
          <option value="1080p">📺 Full HD - 1080p</option>
          <option value="720p">📹 HD - 720p</option>
          <option value="480p">📱 SD - 480p</option>
          <option value="360p">⚡ Low - 360p</option>
        </select>
      </div>

      <button
        onClick={handleDownload}
        disabled={!isValidUrl}
        className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all transform ${
          !isValidUrl
            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
            : 'bg-white text-purple-600 hover:bg-gray-100 hover:scale-105 shadow-2xl'
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Video
        </span>
      </button>

      {!isValidUrl && url && (
        <p className={`text-sm text-center ${
          isDarkMode ? 'text-red-300' : 'text-red-600'
        }`}>
          ⚠️ Please enter a valid URL
        </p>
      )}
    </div>
  );
}
