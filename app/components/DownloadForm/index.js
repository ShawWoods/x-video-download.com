// app/components/DownloadForm/index.js
import { useState } from 'react';

export default function DownloadForm({ onSubmit, loading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('提交的URL:', url); // 添加日志
    if (url.trim()) {
      onSubmit(url.trim());
    } else {
      console.error('URL 为空');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="粘贴X平台视频链接 (https://x.com/...) 或 (https://twitter.com/...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '处理中...' : '下载'}
        </button>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        支持的格式: https://x.com/username/status/12345 或 https://twitter.com/username/status/12345
      </div>
    </form>
  );
}