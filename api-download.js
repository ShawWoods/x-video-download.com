async function downloadTwitterVideo(url) {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '你的API_KEY',
      'X-RapidAPI-Host': 'twitter-video-downloader.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(
      `https://twitter-video-downloader.p.rapidapi.com/GetVideoAPI?url=${encodeURIComponent(url)}`, 
      options
    );
    
    const result = await response.json();
    return result.videos[0].url;
  } catch (error) {
    console.error('下载失败:', error);
    throw error;
  }
}