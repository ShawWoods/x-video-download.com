'use client';
import { useState } from 'react';
import Head from 'next/head';
import Header from './components/header'; 
import DownloadForm from './components/DownloadForm';
import ResultCard from './components/resultCard';
import Footer from './components/footer';

export default function Home() {
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (url) => {
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

      const data = await response.json();
      setVideoData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        {/* SEO 优化元标签 */}
        <title>X视频下载器 - 免费下载Twitter和X平台视频</title>
        <meta name="description" content="快速、免费下载X和Twitter视频，支持多种分辨率。只需粘贴链接，即可保存您喜爱的视频内容到本地。" />
        <meta name="keywords" content="X视频下载, Twitter视频下载, 下载X视频, 免费视频下载器, X平台视频保存" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charset="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="X视频下载器 - 免费下载Twitter和X视频" />
        <meta property="og:description" content="轻松下载X和Twitter平台的视频，支持高清画质，快来试试吧！" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com" /> {/* 替换为你的域名 */}
        <meta property="og:image" content="/og-image.jpg" />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* 只保留大标题 */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
            X和Twitter视频下载器
          </h1>
          <DownloadForm onSubmit={handleDownload} loading={loading} />
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6" role="alert">
              <p>{error}</p>
            </div>
          )}
          {videoData && <ResultCard videoData={videoData} />}
          
          {/* 保留SEO内容，但视觉上隐藏 */}
          <section className="hidden">
            <h2>如何下载X和Twitter视频？</h2>
            <ol>
              <li>找到您想下载的X或Twitter视频。</li>
              <li>复制视频链接（例如：https://x.com/username/status/12345）。</li>
              <li>将链接粘贴到上面的输入框，点击“下载”按钮。</li>
              <li>选择画质，保存视频到您的设备。</li>
            </ol>
            <h2>为什么选择我们的X视频下载器？</h2>
            <ul>
              <li>完全免费，无隐藏费用。</li>
              <li>支持X和Twitter视频的多种分辨率下载。</li>
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
