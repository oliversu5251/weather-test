'use client';

import { useState, useEffect } from 'react';

// 扩展Window接口
declare global {
  interface Window {
    addLoadTime?: (time: number) => void;
  }
}

const PerformanceMonitor = () => {
  const [loadTimes, setLoadTimes] = useState<number[]>([]);
  const [averageTime, setAverageTime] = useState<number>(0);

  useEffect(() => {
    const updateAverage = () => {
      if (loadTimes.length > 0) {
        const avg = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
        setAverageTime(avg);
      }
    };

    updateAverage();
  }, [loadTimes]);

  const addLoadTime = (time: number) => {
    setLoadTimes(prev => {
      const newTimes = [...prev, time];
      // 只保留最近10次的记录
      if (newTimes.length > 10) {
        return newTimes.slice(-10);
      }
      return newTimes;
    });
  };

  // 暴露给父组件使用
  useEffect(() => {
    window.addLoadTime = addLoadTime;
    return () => {
      delete window.addLoadTime;
    };
  }, []);

  if (loadTimes.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs">
      <div>平均加载时间: {averageTime.toFixed(1)}ms</div>
      <div>最近加载: {loadTimes[loadTimes.length - 1]?.toFixed(1)}ms</div>
      <div>缓存命中: {loadTimes.filter(t => t < 500).length}/{loadTimes.length}</div>
    </div>
  );
};

export default PerformanceMonitor;
