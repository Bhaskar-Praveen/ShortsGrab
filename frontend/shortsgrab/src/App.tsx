import { useState } from "react";
import DownloadSection from "./components/DownloadSection";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  const [url, setUrl] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'
    }`}>
      {/* Header */}
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Main Content - Vertically Centered */}
      <main className="flex items-center justify-center min-h-[calc(100vh-180px)] px-4 py-12">
        <div className="w-full max-w-3xl">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-2xl transform hover:scale-110 transition-transform">
              <span className="text-4xl">📱</span>
            </div>
            <h1 className={`text-5xl md:text-7xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              ShortsGrab
            </h1>
            <p className={`text-lg md:text-xl mb-2 ${
              isDarkMode ? 'text-purple-200' : 'text-purple-700'
            }`}>
              Download YouTube Shorts & Instagram Reels instantly
            </p>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              High quality • Multiple formats • 100% free
            </p>
          </div>

          {/* Main Card */}
          <div className={`rounded-3xl shadow-2xl border backdrop-blur-xl p-8 md:p-12 ${
            isDarkMode 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white border-gray-200'
          }`}>
            <DownloadSection url={url} setUrl={setUrl} isDarkMode={isDarkMode} />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <FeatureCard 
              icon={
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                </svg>
              }
              title="YouTube"
              description="Shorts & Videos"
              isDarkMode={isDarkMode}
            />
            <FeatureCard 
              icon={
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                </svg>
              }
              title="Instagram"
              description="Reels & Posts"
              isDarkMode={isDarkMode}
            />
            <FeatureCard 
              icon="⚡"
              title="Fast"
              description="Instant downloads"
              isDarkMode={isDarkMode}
            />
            <FeatureCard 
              icon="🎯"
              title="4K Quality"
              description="Up to 2160p"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

function FeatureCard({ icon, title, description, isDarkMode }: { 
  icon: React.ReactNode | string; 
  title: string; 
  description: string;
  isDarkMode: boolean;
}) {
  return (
    <div className={`rounded-2xl p-6 transition-all hover:scale-105 cursor-default ${
      isDarkMode 
        ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
        : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-md'
    }`}>
      <div className={`mb-3 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
        {typeof icon === 'string' ? (
          <div className="text-3xl">{icon}</div>
        ) : (
          icon
        )}
      </div>
      <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>
    </div>
  );
}