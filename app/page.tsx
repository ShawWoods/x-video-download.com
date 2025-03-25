'use client';
import { useState } from 'react';
import Head from 'next/head';
import Header from './components/header';
import DownloadForm from './components/DownloadForm';
import ResultCard from './components/resultCard';
import Footer from './components/footer';
import RecommendedAccounts from './components/RecommendedAccounts';
import DownloadRankings from './components/DownloadRankings';
import AdBanner from './components/AdBanner';

interface VideoData {
  url: string;
  title?: string;
  thumbnail?: string;
  formats?: { quality: string; url: string }[];
}

export default function Home() {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/downloader?url=${encodeURIComponent(url)}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API返回错误:', errorData || '无详细错误信息');
        throw new Error(`请求失败，状态码: ${response.status}${errorData ? `, 详情: ${errorData}` : ''}`);
      }

      const data: VideoData = await response.json();
      setVideoData(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>X视频下载器 - 免费下载推特和X平台视频 - 翻墙后第一站</title>
        <meta name="description" content="快速、免费下载X和Twitter视频，支持多种分辨率。只需粘贴链接，即可保存您喜爱的视频内容到本地。" />
        <meta name="keywords" content="X视频下载, Twitter视频下载, 下载X视频, 免费视频下载器, X平台视频保存，翻墙后第一站，翻墙后可以做什么" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="X视频下载器 - 免费下载Twitter和X视频" />
        <meta property="og:description" content="轻松下载X和Twitter平台的视频，支持高清画质，快来试试吧！" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta property="og:image" content="/og-image.jpg" />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 主内容区域 */}
          <div className="md:col-span-3">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
              X/推特视频下载器
            </h1>
            <DownloadForm onSubmit={handleDownload} loading={loading} />
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            {videoData && <ResultCard videoData={videoData} />}
            {/* 中间广告 */}
            <div className="mt-6">
              <AdBanner position="middle" />
            </div>
            {/* 下载量排行 - 移到中间广告下方 */}
            <div className="mt-6">
              <DownloadRankings />
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="md:col-span-1 space-y-6">
            {/* 推荐账号栏目 */}
            <RecommendedAccounts />
            {/* 侧边栏广告 */}
            <AdBanner position="sidebar" />
          </div>
        </div>

        {/* 使用说明部分 */}
        <section className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">如何下载X和Twitter视频？</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>找到您想下载的X或Twitter视频。</li>
            <li>复制视频链接（例如：https://x.com/username/status/12345）。</li>
            <li>将链接粘贴到上面的输入框，点击“下载”按钮。</li>
            <li>选择画质，保存视频到您的设备。</li>
          </ol>
          <h2 className="text-2xl font-bold mt-6 mb-4">为什么选择我们的X视频下载器？</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>完全免费，无隐藏费用。</li>
            <li>支持X和Twitter视频的多种分辨率下载。</li>
            <li>无需注册或登录，简单易用。</li>
            <li>兼容手机和电脑，随时随地使用。</li>
          </ul>
        </section>
      </main>
      {/* 底部广告 */}
      <div className="py-4 bg-gray-100">
        <div className="container mx-auto px-4">
          <AdBanner position="footer" />
        </div>
      </div>
      <Footer />
    </div>
  );
}