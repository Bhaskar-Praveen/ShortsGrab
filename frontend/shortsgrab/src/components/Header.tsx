interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Header({ isDarkMode, toggleTheme }: HeaderProps) {
  return (
    <header className={`sticky top-0 z-50 backdrop-blur-lg border-b ${
      isDarkMode ? 'bg-gray-900/80 border-white/10' : 'bg-white/80 border-gray-200'
    }`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <span className="text-xl">📱</span>
          </div>
          <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ShortsGrab
          </span>
        </div>
        <button onClick={toggleTheme} className={`p-2 rounded-xl transition-all ${
          isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
        }`}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
