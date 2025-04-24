'use client';
import { useState } from 'react';
import Head from 'next/head';
import Header from './components/header';
import Footer from './components/footer';

interface VideoData {
  url: string;
  title?: string;
  thumbnail?: string;
  highestQualityUrl?: string;
}

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/downloader?url=${encodeURIComponent(videoUrl)}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API返回错误:', errorData || '无详细错误信息');
        throw new Error(`请求失败，状态码: ${response.status}${errorData ? `, 详情: ${errorData}` : ''}`);
      }

      const data: VideoData = await response.json();
      if (data.highestQualityUrl) {
        // Trigger automatic download
        const link = document.createElement('a');
        link.href = data.highestQualityUrl;
        link.download = data.title || 'video.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('未找到可下载的视频');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>X视频下载器 - 免费下载Twitter和X平台视频</title>
        <meta name="description" content="快速、免费下载X和Twitter视频，自动选择最高画质。只需粘贴链接，即可保存您喜爱的视频内容到本地。" />
        <meta name="keywords" content="X视频下载, Twitter视频下载, 下载X视频, 免费视频下载器, X平台视频保存" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/logo.jpg" />
        <meta property="og:title" content="X视频下载器 - 免费下载Twitter和X视频" />
        <meta property="og:description" content="轻松下载X和Twitter平台的视频，自动高清画质，快来试试吧！" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta property="og:image" content="/og-image.jpg" />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
            X和Twitter视频下载器
          </h1>
          <form onSubmit={handleDownload} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="粘贴X或Twitter视频链接"
                className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !videoUrl}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? '下载中...' : '立即下载'}
              </button>
            </div>
          </form>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6" role="alert">
              <p>{error}</p>
            </div>
          )}
          <section className="hidden">
            <h2>如何下载X和Twitter视频？</h2>
            <ol>
              <li>找到您想下载的X或Twitter视频。</li>
              <li>复制视频链接（例如：https://x.com/username/status/12345）。</li>
              <li>将链接粘贴到上面的输入框，点击“立即下载”。</li>
              <li>视频将自动以最高画质下载到您的设备。</li>
            </ol>
            <h2>为什么选择我们的X视频下载器？</h2>
            <ul>
              <li>完全免费，无隐藏费用。</li>
              <li>自动选择最高画质，省时省力。</li>
              <li>无需注册或登录，简单易用。</li>
              <li>兼容手机和电脑，随时随地使用。</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
