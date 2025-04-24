// app/api/downloader/route.ts
import axios from 'axios';

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get('url');
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

    // Assuming response.data contains formats array
    const formats = response.data.formats || [];
    let highestQualityUrl = '';
    let maxQuality = 0;

    // Find the highest quality video URL
    for (const format of formats) {
      const quality = parseInt(format.quality) || 0; // Assuming quality is a string like "720p"
      if (quality > maxQuality) {
        maxQuality = quality;
        highestQualityUrl = format.url;
      }
    }

    if (!highestQualityUrl) {
      throw new Error('未找到可用的视频格式');
    }

    return new Response(
      JSON.stringify({
        url,
        title: response.data.title || 'X Video',
        thumbnail: response.data.thumbnail || '',
        highestQualityUrl,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
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
