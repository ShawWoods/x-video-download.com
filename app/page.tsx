'use client';
import { useState } from 'react';
import Head from 'next/head';
import Header from './components/header';
import DownloadForm from './components/DownloadForm';
import Footer from './components/footer';

interface VideoData {
  url: string;
  title?: string;
  thumbnail?: string;
  formats?: { quality: string; url: string }[];
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async (url: string) => {
    setLoading(true);
    setError(null);
    setDownloadSuccess(false);
    
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
      
      // 直接下载最高质量的视频
      if (data.url) {
        // 创建一个隐藏的a标签来触发下载
        const downloadLink = document.createElement('a');
        downloadLink.href = data.url;
        downloadLink.download = data.title || 'x-video.mp4';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        setDownloadSuccess(true);
      } else {
        throw new Error('未找到可下载的视频链接');
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
        <meta name="description" content="快速、免费下载X和Twitter视频，支持高清画质。只需粘贴链接，即可保存您喜爱的视频内容到本地。" />
        <meta name="keywords" content="X视频下载, Twitter视频下载, 下载X视频, 免费视频下载器, X平台视频保存" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/logo.jpg" />
        <meta property="og:title" content="X视频下载器 - 免费下载Twitter和X视频" />
        <meta property="og:description" content="轻松下载X和Twitter平台的视频，支持高清画质，快来试试吧！" />
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
          <DownloadForm onSubmit={handleDownload} loading={loading} />
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          {downloadSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-6" role="alert">
              <p>下载已开始！如果下载没有自动开始，请检查您的浏览器设置。</p>
            </div>
          )}
          
          <section className="mt-12 bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">如何下载X和Twitter视频？</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>找到您想下载的X或Twitter视频。</li>
              <li>复制视频链接（例如：https://x.com/username/status/12345）。</li>
              <li>将链接粘贴到上面的输入框，点击"下载"按钮。</li>
              <li>视频将自动以最高画质下载到您的设备。</li>
            </ol>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">为什么选择我们的X视频下载器？</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>完全免费，无隐藏费用。</li>
              <li>自动选择最高画质，无需手动选择。</li>
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
