import { useState } from 'react';

interface DownloadButtonProps {
  url: string;
}

type Quality = 'best' | '4k' | '1080p' | '720p' | '480p' | '360p';

export default function DownloadButton({ url }: DownloadButtonProps) {
  const [quality, setQuality] = useState<Quality>('best');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (!url || !url.trim()) {
      alert("Please paste a valid video URL first");
      return;
    }

    setIsDownloading(true);

    // Build download URL with quality parameter
    const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&quality=${quality}`;
    
    // Open in new tab to trigger download
    window.open(downloadUrl, '_blank');
    
    // Reset downloading state after a delay
    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  const isValidUrl = url && /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|instagram\.com)/i.test(url);

  return (
    <div className="space-y-4">
      {/* Quality Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Quality
        </label>
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value as Quality)}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="best">🎬 Best Quality (Auto)</option>
          <option value="4k">🎥 4K - 2160p (if available)</option>
          <option value="1080p">📺 Full HD - 1080p</option>
          <option value="720p">📹 HD - 720p</option>
          <option value="480p">📱 SD - 480p</option>
          <option value="360p">⚡ Low - 360p (Fast)</option>
        </select>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={!isValidUrl || isDownloading}
        className={`w-full px-6 py-4 rounded-lg font-semibold text-base transition-all transform ${
          !isValidUrl
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : isDownloading
            ? 'bg-gray-600 text-gray-300 cursor-wait scale-95'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
        }`}
      >
        {isDownloading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Opening Download...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Video
          </span>
        )}
      </button>

      {/* Helper Text */}
      {!isValidUrl && url && (
        <p className="text-sm text-red-400 text-center animate-pulse">
          ⚠️ Please enter a valid YouTube or Instagram URL
        </p>
      )}
      
      {isValidUrl && (
        <p className="text-xs text-gray-500 text-center">
          Quality: <span className="text-blue-400 font-semibold">{quality}</span> • Format: <span className="text-purple-400 font-semibold">MP4</span>
        </p>
      )}
    </div>
  );
}