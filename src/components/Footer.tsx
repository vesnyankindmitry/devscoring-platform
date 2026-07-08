export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-lg font-bold text-white">DevScoring</span>
            <p className="text-sm mt-1">Платформа для аналитики девелоперских компаний</p>
          </div>
          <p className="text-sm">© 2025 DevScoring. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
