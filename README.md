# 多源天气展示网站

这是一个使用 Next.js 构建的天气展示网站，支持多个天气数据源，包括 Open-Meteo API 和 AccuWeather API，可以随机展示全球不同城市的实时天气信息。

## 功能特点

- 🌍 **随机城市天气**: 从预定义的全球城市中随机选择一个展示天气
- 🌤️ **多源天气数据**: 支持 Open-Meteo API 和 AccuWeather API 两种数据源
- 🔍 **城市搜索**: AccuWeather 页面支持搜索任意城市天气
- ⚡ **高性能**: 内置缓存机制、预加载和性能监控
- 📱 **响应式设计**: 支持桌面和移动设备，适配不同屏幕尺寸
- 🌙 **深色模式**: 支持深色/浅色主题切换
- 📊 **详细信息**: 显示温度、湿度、风速、气压等详细天气数据
- 🎨 **美观界面**: 使用 TailwindCSS 构建现代化 UI 界面
- 🎭 **流畅动画**: 丰富的交互动画和加载效果

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **API**: Open-Meteo Weather API + AccuWeather API
- **部署**: Vercel (推荐)

## 开始使用

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 项目结构

```
app/
├── components/
│   ├── WeatherCard.tsx         # Open-Meteo 天气展示组件
│   └── AccuWeatherCard.tsx     # AccuWeather 天气展示组件
├── services/
│   ├── weatherService.ts       # Open-Meteo 天气数据服务
│   └── accuWeatherService.ts   # AccuWeather 天气数据服务
├── types/
│   ├── weather.ts              # Open-Meteo 类型定义
│   └── accuWeather.ts          # AccuWeather 类型定义
├── accuweather/
│   └── page.tsx                # AccuWeather 页面
├── globals.css                 # 全局样式
├── layout.tsx                  # 应用布局
└── page.tsx                    # 主页面 (Open-Meteo)
```

## 功能说明

### 天气信息展示
- 城市名称和国家
- 当前时间和时区
- 天气状况图标和描述
- 当前温度和体感温度
- 湿度、云量、风速、气压等详细信息
- 降水信息（如有）

### 页面功能

#### Open-Meteo 页面 (/)
- 随机城市天气展示
- 包含以下20个城市的天气数据：
  - **中国**: 北京、上海、广州、深圳、杭州、成都、西安、南京、武汉、重庆
  - **国际**: 纽约、伦敦、巴黎、东京、悉尼、多伦多、柏林、罗马、马德里、阿姆斯特丹

#### AccuWeather 页面 (/accuweather)
- 随机城市天气展示
- 城市搜索功能，支持搜索任意城市
- 更详细的天气信息，包括 UV 指数、能见度等

### 交互功能
- 点击"随机查看其他城市天气"按钮可以获取新的随机城市天气
- 智能加载进度条和状态提示
- 错误处理和重试机制
- 性能监控显示加载时间统计

### 性能优化
- **缓存机制**: 5分钟缓存，减少重复API调用
- **预加载**: 后台预加载下一个城市数据
- **超时控制**: 10秒请求超时，避免长时间等待
- **错误恢复**: 网络错误时使用缓存数据
- **性能监控**: 实时显示加载时间和缓存命中率

## API 使用

### Open-Meteo API
本项目使用 [Open-Meteo API](https://open-meteo.com/) 获取天气数据，该 API 是免费的，无需 API 密钥。

### AccuWeather API
本项目还使用 [AccuWeather API](https://developer.accuweather.com/) 获取更详细的天气数据。

#### 设置 AccuWeather API 密钥

1. 在 [AccuWeather Developer Portal](https://developer.accuweather.com/) 注册并获取 API 密钥
2. 创建 `.env.local` 文件并添加你的 API 密钥：

```bash
NEXT_PUBLIC_ACCUWEATHER_API_KEY=your_api_key_here
```

3. 重启开发服务器

## 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 自动部署完成

### 其他部署方式

```bash
npm run build
npm start
```

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 许可证

MIT License
