'use client';

import { useState, useEffect, useCallback } from 'react';
import { WeatherInfo } from '../types/weather';
import { getRandomWeather, weatherCodes } from '../services/weatherService';

const WeatherCard = () => {
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

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
      const data = await getRandomWeather();
      setWeatherInfo(data);
      setLoadingProgress(100);

      // 记录加载时间
      const loadTime = performance.now() - startTime;
      if (window.addLoadTime) {
        window.addLoadTime(loadTime);
      }
    } catch (err) {
      setError('获取天气信息失败，请重试');
      console.error('Weather fetch error:', err);
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
      setLoadingProgress(0);
    }
  }, []);

  // 预加载下一个城市的天气数据
  const preloadNextWeather = useCallback(async () => {
    try {
      await getRandomWeather();
    } catch {
      // 静默失败，不影响用户体验
    }
  }, []);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  // 当天气数据加载完成后，预加载下一个
  useEffect(() => {
    if (weatherInfo && !loading) {
      // 延迟预加载，避免影响当前显示
      const timer = setTimeout(preloadNextWeather, 2000);
      return () => clearTimeout(timer);
    }
  }, [weatherInfo, loading, preloadNextWeather]);

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

  const getWeatherInfo = (code: number) => {
    return weatherCodes[code] || { description: '未知天气', icon: '❓' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">🌤️</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              正在获取天气信息...
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

  const { city, weather } = weatherInfo;
  const weatherInfoData = getWeatherInfo(weather.current.weather_code);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full animate-fade-in">
        {/* 城市信息 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
            {city.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {city.country}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {formatTime(weather.current.time)}
          </p>
        </div>

        {/* 主要天气信息 */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 weather-icon-float">{weatherInfoData.icon}</div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {weatherInfoData.description}
          </h2>
          <div className="text-4xl font-bold text-gray-800 dark:text-gray-200">
            {Math.round(weather.current.temperature_2m)}°C
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            体感温度: {Math.round(weather.current.apparent_temperature)}°C
          </p>
        </div>

        {/* 详细信息 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors card-hover animate-slide-in">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">湿度</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {weather.current.relative_humidity_2m}%
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">云量</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {weather.current.cloud_cover}%
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">风速</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {weather.current.wind_speed_10m} km/h
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">气压</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {Math.round(weather.current.pressure_msl)} hPa
            </div>
          </div>
        </div>

        {/* 降水信息 */}
        {(weather.current.precipitation > 0 || weather.current.rain > 0 || weather.current.showers > 0 || weather.current.snowfall > 0) && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">降水信息</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {weather.current.precipitation > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">总降水量:</span>
                  <span className="text-gray-800 dark:text-gray-200">{weather.current.precipitation} mm</span>
                </div>
              )}
              {weather.current.rain > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">降雨量:</span>
                  <span className="text-gray-800 dark:text-gray-200">{weather.current.rain} mm</span>
                </div>
              )}
              {weather.current.snowfall > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">降雪量:</span>
                  <span className="text-gray-800 dark:text-gray-200">{weather.current.snowfall} mm</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 刷新按钮 */}
        <button
          onClick={handleRefresh}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed btn-hover-effect"
          disabled={loading}
        >
          {loading ? '🔄 加载中...' : '🔄 随机查看其他城市天气'}
        </button>
      </div>
    </div>
  );
};

export default WeatherCard;
