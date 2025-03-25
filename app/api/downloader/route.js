// app/api/downloader/route.js
import axios from 'axios';
import db from '../../../db'; // 引入 SQLite 数据库

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

    // 在成功获取视频数据后，更新下载计数
    const videoData = response.data;
    const title = videoData.tweet?.title || videoData.tweet?.text || 'Unknown Title'; // 根据 API 响应结构调整

    db.run(
      `INSERT INTO downloads (url, download_count, title) 
       VALUES (?, 1, ?) 
       ON CONFLICT(url) DO UPDATE SET download_count = download_count + 1, title = ?`,
      [url, title, title],
      (err) => {
        if (err) {
          console.error('数据库错误:', err);
        } else {
          console.log(`已更新下载计数: ${url}`);
        }
      }
    );

    return new Response(JSON.stringify(videoData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
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