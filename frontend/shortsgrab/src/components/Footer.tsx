interface FooterProps {
  isDarkMode: boolean;
}

export default function Footer({ isDarkMode }: FooterProps) {
  return (
    <footer className={`border-t ${isDarkMode ? 'border-white/10 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8 text-center">
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          © 2026 ShortsGrab. Made with ❤️ for content creators.
        </p>
      </div>
    </footer>
  );
}
