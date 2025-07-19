'use client';

import { useState, useEffect, useCallback } from 'react';
import { AccuWeatherInfo } from '../types/accuWeather';
import { getRandomAccuWeather, searchCity, fetchAccuWeatherData, weatherIcons } from '../services/accuWeatherService';

const AccuWeatherCard = () => {
  const [weatherInfo, setWeatherInfo] = useState<AccuWeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const handleRefresh = useCallback(async () => {
    const startTime = performance.now();
    setLoading(true);
    setError(null);
    setLoadingProgress(0);

    // 模拟加载进度
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 20;
      });
    }, 100);

    try {
      const data = await getRandomAccuWeather();
      setWeatherInfo(data);
      setLoadingProgress(100);

      // 记录加载时间
      const loadTime = performance.now() - startTime;
      if (window.addLoadTime) {
        window.addLoadTime(loadTime);
      }
    } catch (err) {
      setError('获取天气信息失败，请重试');
      console.error('AccuWeather fetch error:', err);
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
      setLoadingProgress(0);
    }
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchCity(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    }
  }, []);

  const handleCitySelect = useCallback(async (locationKey: string) => {
    setLoading(true);
    setError(null);
    setShowSearch(false);
    setSearchQuery('');

    try {
      const data = await fetchAccuWeatherData(locationKey);
      setWeatherInfo(data);
    } catch (err) {
      setError('获取城市天气信息失败，请重试');
      console.error('City weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return '时间未知';
    }

    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Shanghai'
    });
  };

  const getWeatherIcon = (iconCode: number) => {
    return weatherIcons[iconCode] || '❓';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">🌤️</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              正在获取 AccuWeather 天气信息...
            </h2>

            {/* 进度条 */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {loadingProgress < 30 && '正在选择城市...'}
              {loadingProgress >= 30 && loadingProgress < 70 && '正在获取天气数据...'}
              {loadingProgress >= 70 && loadingProgress < 100 && '正在处理数据...'}
              {loadingProgress >= 100 && '完成！'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">出错了</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!weatherInfo) {
    return null;
  }

  const { location, current } = weatherInfo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full animate-fade-in">
        {/* 城市信息 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
            {location.LocalizedName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {location.Country.LocalizedName}, {location.AdministrativeArea.LocalizedName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {formatTime(current.LocalObservationDateTime)}
          </p>
        </div>

        {/* 主要天气信息 */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 weather-icon-float">{getWeatherIcon(current.WeatherIcon)}</div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {current.WeatherText}
          </h2>
          <div className="text-4xl font-bold text-gray-800 dark:text-gray-200">
            {Math.round(current.Temperature.Metric.Value)}°C
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            体感温度: {Math.round(current.RealFeelTemperature.Metric.Value)}°C
          </p>
        </div>

        {/* 详细信息 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors card-hover animate-slide-in">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">湿度</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {current.RelativeHumidity}%
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">风速</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {Math.round(current.Wind.Speed.Metric.Value)} km/h
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">气压</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {Math.round(current.Pressure.Metric.Value)} hPa
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">能见度</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {Math.round(current.Visibility.Metric.Value)} km
            </div>
          </div>
        </div>

        {/* 额外信息 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">UV指数</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {current.UVIndex} ({current.UVIndexText})
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">云量</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {current.CloudCover}%
            </div>
          </div>
        </div>

        {/* 降水信息 */}
        {current.HasPrecipitation && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">降水信息</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">降水类型:</span>
                <span className="text-gray-800 dark:text-gray-200">{current.PrecipitationType || '未知'}</span>
              </div>
              {current.Precip1hr.Metric.Value > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">1小时降水:</span>
                  <span className="text-gray-800 dark:text-gray-200">{current.Precip1hr.Metric.Value} mm</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 搜索城市 */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索城市..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
                setShowSearch(true);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 max-h-48 overflow-y-auto z-10">
                {searchResults.map((city) => (
                  <button
                    key={city.Key}
                    onClick={() => handleCitySelect(city.Key)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                  >
                    {city.LocalizedName}, {city.Country.LocalizedName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 按钮组 */}
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed btn-hover-effect"
            disabled={loading}
          >
            {loading ? '🔄 加载中...' : '🔄 随机城市'}
          </button>
        </div>

        {/* 数据来源 */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            数据来源: AccuWeather
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccuWeatherCard;
