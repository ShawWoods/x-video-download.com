'use client';
import { useState } from 'react';

interface DownloadFormProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

export default function DownloadForm({ onSubmit, loading }: DownloadFormProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="mb-4">
        <label htmlFor="url" className="block text-gray-700 font-medium mb-2">
          输入X视频链接
        </label>
        <input
          type="text"
          id="url"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://x.com/username/status/123456789"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading || !url.trim()}
        className={`w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ${
          loading || !url.trim() ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            处理中...
          </div>
        ) : (
          '下载视频'
        )}
      </button>
      <p className="text-sm text-gray-500 mt-3 text-center">
        支持X和Twitter视频链接。将自动下载最高质量版本。
      </p>
    </form>
  );
}
