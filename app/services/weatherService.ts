import { WeatherData, City, WeatherInfo } from '../types/weather';

// 预定义的城市列表
const cities: City[] = [
  { name: "北京", latitude: 39.9042, longitude: 116.4074, country: "中国" },
  { name: "上海", latitude: 31.2304, longitude: 121.4737, country: "中国" },
  { name: "广州", latitude: 23.1291, longitude: 113.2644, country: "中国" },
  { name: "深圳", latitude: 22.3193, longitude: 114.1694, country: "中国" },
  { name: "杭州", latitude: 30.2741, longitude: 120.1551, country: "中国" },
  { name: "成都", latitude: 30.5728, longitude: 104.0668, country: "中国" },
  { name: "西安", latitude: 34.3416, longitude: 108.9398, country: "中国" },
  { name: "南京", latitude: 32.0603, longitude: 118.7969, country: "中国" },
  { name: "武汉", latitude: 30.5928, longitude: 114.3055, country: "中国" },
  { name: "重庆", latitude: 29.4316, longitude: 106.9123, country: "中国" },
  { name: "纽约", latitude: 40.7128, longitude: -74.0060, country: "美国" },
  { name: "伦敦", latitude: 51.5074, longitude: -0.1278, country: "英国" },
  { name: "巴黎", latitude: 48.8566, longitude: 2.3522, country: "法国" },
  { name: "东京", latitude: 35.6762, longitude: 139.6503, country: "日本" },
  { name: "悉尼", latitude: -33.8688, longitude: 151.2093, country: "澳大利亚" },
  { name: "多伦多", latitude: 43.6532, longitude: -79.3832, country: "加拿大" },
  { name: "柏林", latitude: 52.5200, longitude: 13.4050, country: "德国" },
  { name: "罗马", latitude: 41.9028, longitude: 12.4964, country: "意大利" },
  { name: "马德里", latitude: 40.4168, longitude: -3.7038, country: "西班牙" },
  { name: "阿姆斯特丹", latitude: 52.3676, longitude: 4.9041, country: "荷兰" },
];

// 天气代码对应的描述和图标
export const weatherCodes: Record<number, { description: string; icon: string }> = {
  0: { description: "晴天", icon: "☀️" },
  1: { description: "大部分晴天", icon: "🌤️" },
  2: { description: "部分多云", icon: "⛅" },
  3: { description: "阴天", icon: "☁️" },
  45: { description: "雾天", icon: "🌫️" },
  48: { description: "结霜雾", icon: "🌫️" },
  51: { description: "小雨", icon: "🌦️" },
  53: { description: "小雨", icon: "🌦️" },
  55: { description: "中雨", icon: "🌧️" },
  56: { description: "小雨夹雪", icon: "🌨️" },
  57: { description: "中雨夹雪", icon: "🌨️" },
  61: { description: "小雨", icon: "🌧️" },
  63: { description: "中雨", icon: "🌧️" },
  65: { description: "大雨", icon: "⛈️" },
  66: { description: "小雨夹雪", icon: "🌨️" },
  67: { description: "中雨夹雪", icon: "🌨️" },
  71: { description: "小雪", icon: "🌨️" },
  73: { description: "中雪", icon: "❄️" },
  75: { description: "大雪", icon: "❄️" },
  77: { description: "雪粒", icon: "🌨️" },
  80: { description: "小雨", icon: "🌦️" },
  81: { description: "中雨", icon: "🌧️" },
  82: { description: "大雨", icon: "⛈️" },
  85: { description: "小雪", icon: "🌨️" },
  86: { description: "中雪", icon: "❄️" },
  95: { description: "雷雨", icon: "⛈️" },
  96: { description: "雷雨夹雪", icon: "⛈️" },
  99: { description: "强雷雨夹雪", icon: "⛈️" },
};

// 缓存系统
const cache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

export const getRandomCity = (): City => {
  const randomIndex = Math.floor(Math.random() * cities.length);
  return cities[randomIndex];
};

export const fetchWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  const cacheKey = `${latitude},${longitude}`;
  const now = Date.now();

  // 检查缓存
  const cached = cache.get(cacheKey);
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }

  // 使用更快的API调用，只获取必要的数据
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto&timeformat=unixtime`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'WeatherApp/1.0'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 缓存数据
    cache.set(cacheKey, { data, timestamp: now });

    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);

    // 如果网络请求失败，尝试返回缓存的数据（即使过期）
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('Using cached data due to network error');
      return cached.data;
    }

    throw error;
  }
};

export const getRandomWeather = async (): Promise<WeatherInfo> => {
  const city = getRandomCity();
  const weather = await fetchWeatherData(city.latitude, city.longitude);

  return {
    city,
    weather
  };
};

// 预加载函数
export const preloadWeather = async (): Promise<void> => {
  try {
    const randomCity = getRandomCity();
    await fetchWeatherData(randomCity.latitude, randomCity.longitude);
  } catch {
    // 静默失败
  }
};

// 清理过期缓存
export const clearExpiredCache = (): void => {
  const now = Date.now();
  const keysToDelete: string[] = [];

  cache.forEach((value, key) => {
    if (now - value.timestamp > CACHE_DURATION) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach(key => cache.delete(key));
};

// 定期清理缓存
setInterval(clearExpiredCache, 60000); // 每分钟清理一次
