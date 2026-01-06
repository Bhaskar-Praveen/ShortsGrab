import { useState } from 'react';
import { detectPlatform } from '../utils/detectPlatform';
import BreathingExercise from './BreathingExercise';

interface DownloadSectionProps {
  url: string;
  setUrl: (url: string) => void;
  isDarkMode: boolean;
}

type Quality = 'best' | '4k' | '1080p' | '720p' | '480p' | '360p';

export default function DownloadSection({ url, setUrl, isDarkMode }: DownloadSectionProps) {
  const [quality, setQuality] = useState<Quality>('best');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  
  const platform = detectPlatform(url);
  const isValidUrl = url && /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|instagram\.com)/i.test(url);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError('');
    } catch (err) {
      setError('Failed to paste. Please paste manually.');
    }
  };

  const handleDownload = () => {
    if (!url || !url.trim()) {
      setError('Please paste a valid video URL');
      return;
    }

    if (!isValidUrl) {
      setError('Invalid URL. Please use YouTube or Instagram links.');
      return;
    }

    setError('');
    setIsDownloading(true);
    const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&quality=${quality}`;
    window.location.href = downloadUrl;
    
    setTimeout(() => {
      setIsDownloading(false);
    }, 8000);
  };

  if (isDownloading) {
  return (
    <div className="space-y-4">
      <div className={`rounded-2xl p-6 border ${
        isDarkMode ? 'bg-gray-900/30 border-white/10' : 'bg-gray-50 border-gray-200'
      }`}>
        <BreathingExercise isDarkMode={isDarkMode} />  {/* ← FIXED THIS LINE */}
      </div>
      <button
        onClick={() => setIsDownloading(false)}
        className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
          isDarkMode 
            ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300'
        }`}
      >
        Cancel
      </button>
    </div>
  );
}

  return (
    <div className="space-y-6">
      {/* URL Input with Paste Button */}
      <div className="space-y-3">
        <label className={`block text-center text-sm font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Paste Video URL
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              placeholder="https://youtube.com/shorts/..."
              className={`w-full px-5 py-4 rounded-xl text-base transition-all focus:outline-none focus:ring-4 ${
                isDarkMode 
                  ? 'bg-white/10 text-white placeholder-gray-400 border-2 border-white/20 focus:border-purple-400 focus:ring-purple-500/30' 
                  : 'bg-white text-gray-900 placeholder-gray-500 border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500/30'
              }`}
            />
            {url && (
              <button
                onClick={() => setUrl('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
                  isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={handlePaste}
            className={`px-6 py-4 rounded-xl font-semibold transition-all whitespace-nowrap ${
              isDarkMode 
                ? 'bg-white/10 hover:bg-white/20 text-white border-2 border-white/20' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900 border-2 border-gray-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
        </div>

        {/* Platform Badge */}
        {platform !== "unknown" && url && (
          <div className="flex justify-center">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isDarkMode 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                : 'bg-purple-100 text-purple-700 border border-purple-300'
            }`}>
              {platform === "youtube" && "🎥 YouTube"}
              {platform === "instagram" && "📸 Instagram"}
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={`text-center text-sm font-medium ${
            isDarkMode ? 'text-red-400' : 'text-red-600'
          }`}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Quality Selector */}
      <div className="space-y-3">
        <label className={`block text-center text-sm font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Select Quality
        </label>
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value as Quality)}
          className={`w-full px-5 py-4 rounded-xl text-base font-medium transition-all focus:outline-none focus:ring-4 cursor-pointer ${
            isDarkMode 
              ? 'bg-white/10 text-white border-2 border-white/20 focus:border-purple-400 focus:ring-purple-500/30' 
              : 'bg-white text-gray-900 border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500/30'
          }`}
        >
          <option value="best">🎬 Best Quality (Auto)</option>
          <option value="4k">🎥 4K - 2160p (Ultra HD)</option>
          <option value="1080p">📺 Full HD - 1080p</option>
          <option value="720p">📹 HD - 720p</option>
          <option value="480p">📱 SD - 480p</option>
          <option value="360p">⚡ Low - 360p (Fast)</option>
        </select>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={!isValidUrl}
        className={`w-full px-6 py-5 rounded-xl text-lg font-bold transition-all transform ${
          !isValidUrl
            ? isDarkMode
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl hover:scale-105 active:scale-95'
        }`}
      >
        <span className="flex items-center justify-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Video
        </span>
      </button>

      {/* Info Text */}
      {isValidUrl && (
        <p className={`text-center text-xs ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Quality: <span className="font-semibold text-purple-500">{quality}</span> • 
          Format: <span className="font-semibold text-purple-500">MP4</span> • 
          Size: <span className="font-semibold text-purple-500">Varies</span>
        </p>
      )}
    </div>
  );
}
