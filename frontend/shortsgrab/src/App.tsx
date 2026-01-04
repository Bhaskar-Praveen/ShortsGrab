import { useState } from "react";
import UrlInput from "./components/UrlInput";
import VideoPreview from "./components/VideoPreview";
import DownloadButton from "./components/DownloadButton";
import PlatformBadge from "./components/PlatformBadge";
import { detectPlatform } from "./utils/detectPlatform";

export default function App() {
  const [url, setUrl] = useState("");
  const platform = detectPlatform(url);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <header className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl md:text-3xl">📱</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                ShortsGrab
              </h1>
            </div>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
              Download videos from YouTube and Instagram in high quality
            </p>
          </header>

          {/* Main Card */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-6 md:p-8 space-y-6">
            
            {/* URL Input Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                Video URL
              </label>
              <UrlInput url={url} setUrl={setUrl} />
              
              {/* Platform Badge */}
              {platform !== "unknown" && (
                <div className="flex justify-start">
                  <PlatformBadge platform={platform} />
                </div>
              )}
            </div>

            {/* Video Preview */}
            {url && (
              <div className="space-y-4">
                <VideoPreview url={url} platform={platform} />
              </div>
            )}

            {/* Download Section */}
            {url && (
              <div className="pt-4 border-t border-gray-700/50">
                <DownloadButton url={url} />
              </div>
            )}

            {/* Info Section */}
            {!url && (
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 mx-auto bg-gray-700/50 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    Get Started
                  </h3>
                  <p className="text-sm text-gray-500">
                    Paste a YouTube or Instagram URL above to begin
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <FeatureCard 
              icon="🎬"
              title="Multiple Platforms"
              description="YouTube & Instagram support"
            />
            <FeatureCard 
              icon="⚡"
              title="Fast Downloads"
              description="Instant streaming downloads"
            />
            <FeatureCard 
              icon="🎯"
              title="Quality Options"
              description="From 360p to 4K"
            />
          </div>

          {/* Footer */}
          <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>Made with ❤️ for content creators</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-700/30 hover:border-gray-600/50 transition-all hover:transform hover:scale-105">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-white font-semibold mb-1 text-sm md:text-base">{title}</h3>
      <p className="text-gray-400 text-xs md:text-sm">{description}</p>
    </div>
  );
}