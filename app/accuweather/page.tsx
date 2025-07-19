import AccuWeatherCard from '../components/AccuWeatherCard';
import Link from 'next/link';

export default function AccuWeatherPage() {
  return (
    <>
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              天气应用
            </h1>
            <div className="flex space-x-4">
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Open-Meteo
              </Link>
              <Link
                href="/accuweather"
                className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                AccuWeather
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="pt-16">
        <AccuWeatherCard />
      </div>
    </>
  );
}
