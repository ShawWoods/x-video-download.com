// app/api/downloader/route.js
import axios from 'axios';

export async function GET(request) {
  const url = request.nextUrl.searchParams.get('url');
  console.log('接收到的URL:', url);

  if (!url || !url.startsWith('https://x.com/') || !url.includes('/status/')) {
    return new Response(JSON.stringify({ message: '请提供有效的X平台视频URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await axios({
      method: 'GET',
      url: 'https://twitter-downloader-download-twitter-videos-gifs-and-images.p.rapidapi.com/tweetgrab',
      params: { url },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'twitter-downloader-download-twitter-videos-gifs-and-images.p.rapidapi.com',
      },
    });
    
    console.log('RapidAPI 响应:', JSON.stringify(response.data, null, 2));
    
    // 处理API返回的数据，查找最高质量的视频
    const responseData = response.data;
    
    // 如果有formats数组，找出最高质量的视频
    if (responseData.formats && responseData.formats.length > 0) {
      // 以下是一个简化的方法来找出最高质量的视频
      // 通常最后一个格式是最高质量的，但如果API有特定的质量标识，可以进一步完善此逻辑
      const highestQualityVideo = responseData.formats[responseData.formats.length - 1];
      
      // 返回包含最高质量视频URL的响应
      return new Response(JSON.stringify({
        url: highestQualityVideo.url,
        title: responseData.title || null,
        thumbnail: responseData.thumbnail || null
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (responseData.url) {
      // 如果没有formats数组但有直接的url，就使用该url
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // 如果没有任何可用的视频URL
      return new Response(JSON.stringify({ message: '未找到可下载的视频链接' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('API错误:', error.message);
    return new Response(
      JSON.stringify({
        message: '视频下载失败',
        error: error.response?.data || error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
