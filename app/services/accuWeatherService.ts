import { AccuWeatherLocation, AccuWeatherCurrent, AccuWeatherInfo } from '../types/accuWeather';

// AccuWeather API 配置
const ACCUWEATHER_API_KEY = process.env.NEXT_PUBLIC_ACCUWEATHER_API_KEY;
const ACCUWEATHER_BASE_URL = 'https://dataservice.accuweather.com';

// 检查 API 密钥
if (!ACCUWEATHER_API_KEY || ACCUWEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
  console.error('AccuWeather API key is not configured. Please set NEXT_PUBLIC_ACCUWEATHER_API_KEY environment variable.');
}

// 预定义的城市列表（使用 AccuWeather 的城市 Key）
const cities: Array<{ name: string; key: string; country: string }> = [
  { name: "北京", key: "101924", country: "中国" },
  { name: "上海", key: "101924", country: "中国" },
  { name: "广州", key: "101924", country: "中国" },
  { name: "深圳", key: "101924", country: "中国" },
  { name: "纽约", key: "349727", country: "美国" },
  { name: "伦敦", key: "328328", country: "英国" },
  { name: "巴黎", key: "623", country: "法国" },
  { name: "东京", key: "226396", country: "日本" },
  { name: "悉尼", key: "22889", country: "澳大利亚" },
  { name: "多伦多", key: "55488", country: "加拿大" },
  { name: "柏林", key: "178087", country: "德国" },
  { name: "罗马", key: "213490", country: "意大利" },
  { name: "马德里", key: "308526", country: "西班牙" },
  { name: "阿姆斯特丹", key: "249758", country: "荷兰" },
];

// 天气图标映射
export const weatherIcons: Record<number, string> = {
  1: "☀️",   // 晴天
  2: "☀️",   // 大部分晴天
  3: "🌤️",   // 部分晴天
  4: "🌤️",   // 多云
  5: "⛅",    // 阴天
  6: "☁️",   // 阴天
  7: "☁️",   // 多云
  8: "☁️",   // 多云
  11: "🌫️",  // 雾
  12: "🌧️",  // 小雨
  13: "🌧️",  // 小雨
  14: "🌧️",  // 小雨
  15: "⛈️",   // 雷雨
  16: "⛈️",   // 雷雨
  17: "⛈️",   // 雷雨
  18: "🌧️",  // 雨
  19: "🌨️",  // 雪
  20: "🌨️",  // 雪
  21: "🌨️",  // 雪
  22: "🌨️",  // 雪
  23: "🌨️",  // 雪
  24: "🌨️",  // 雪
  25: "🌨️",  // 雪
  26: "🌨️",  // 雪
  29: "🌨️",  // 雪
  30: "🌫️",  // 雾
  31: "🌫️",  // 雾
  32: "💨",   // 风
  33: "🌙",   // 晴朗夜晚
  34: "🌙",   // 大部分晴朗夜晚
  35: "🌙",   // 部分晴朗夜晚
  36: "☁️",   // 多云夜晚
  37: "☁️",   // 多云夜晚
  38: "☁️",   // 多云夜晚
  39: "🌧️",  // 小雨夜晚
  40: "🌧️",  // 小雨夜晚
  41: "⛈️",   // 雷雨夜晚
  42: "⛈️",   // 雷雨夜晚
  43: "🌨️",  // 雪夜晚
  44: "🌨️",  // 雪夜晚
};

// 缓存系统
const cache = new Map<string, { data: AccuWeatherInfo; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10分钟缓存

export const getRandomCity = () => {
  const randomIndex = Math.floor(Math.random() * cities.length);
  return cities[randomIndex];
};

export const searchCity = async (query: string): Promise<AccuWeatherLocation[]> => {
  if (!ACCUWEATHER_API_KEY) {
    throw new Error('AccuWeather API key is not configured');
  }

  try {
    const response = await fetch(
      `${ACCUWEATHER_BASE_URL}/locations/v1/cities/search?apikey=${ACCUWEATHER_API_KEY}&q=${encodeURIComponent(query)}&language=zh-cn`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.slice(0, 5); // 只返回前5个结果
  } catch (error) {
    console.error('Error searching city:', error);
    throw error;
  }
};

export const getCurrentConditions = async (locationKey: string): Promise<AccuWeatherCurrent> => {
  if (!ACCUWEATHER_API_KEY) {
    throw new Error('AccuWeather API key is not configured');
  }

  try {
    const response = await fetch(
      `${ACCUWEATHER_BASE_URL}/currentconditions/v1/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&language=zh-cn&details=true`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data[0]; // AccuWeather 返回数组，我们取第一个
  } catch (error) {
    console.error('Error fetching current conditions:', error);
    throw error;
  }
};

export const getLocationByKey = async (locationKey: string): Promise<AccuWeatherLocation> => {
  if (!ACCUWEATHER_API_KEY) {
    throw new Error('AccuWeather API key is not configured');
  }

  try {
    const response = await fetch(
      `${ACCUWEATHER_BASE_URL}/locations/v1/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&language=zh-cn`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching location:', error);
    throw error;
  }
};

export const fetchAccuWeatherData = async (locationKey: string): Promise<AccuWeatherInfo> => {
  const now = Date.now();

  // 检查缓存
  const cached = cache.get(locationKey);
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const [location, current] = await Promise.all([
      getLocationByKey(locationKey),
      getCurrentConditions(locationKey)
    ]);

    const data: AccuWeatherInfo = {
      location,
      current
    };

    // 缓存数据
    cache.set(locationKey, { data, timestamp: now });

    return data;
  } catch (error) {
    console.error('Error fetching AccuWeather data:', error);

    // 如果网络请求失败，尝试返回缓存的数据（即使过期）
    const cached = cache.get(locationKey);
    if (cached) {
      console.log('Using cached data due to network error');
      return cached.data;
    }

    throw error;
  }
};

export const getRandomAccuWeather = async (): Promise<AccuWeatherInfo> => {
  const city = getRandomCity();
  return await fetchAccuWeatherData(city.key);
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
