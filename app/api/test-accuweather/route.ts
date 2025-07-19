import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_ACCUWEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      error: 'API key not configured',
      message: 'Please set NEXT_PUBLIC_ACCUWEATHER_API_KEY environment variable'
    }, { status: 500 });
  }

  try {
    // 测试 API 调用
    const response = await fetch(
      `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=London&language=en-us`
    );

    if (!response.ok) {
      return NextResponse.json({
        error: 'API call failed',
        status: response.status,
        message: 'AccuWeather API returned an error'
      }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'API key is working correctly',
      data: data.slice(0, 1) // 只返回第一个结果
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Network error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
