'use client';
import { useState } from 'react';
import VideoPlayer from '../VideoPlayer';

export default function ResultCard({ videoData }) {
  const [activeQuality, setActiveQuality] = useState(0);

  // 日志用于调试
  console.log('ResultCard 接收到的 videoData:', videoData);

  // 检查是否有可用的视频数据
  if (!videoData || !videoData.media?.video?.variants) {
    return (
      <div className="mt-8 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
        没有找到可下载的媒体。
      </div>
    );
  }

  // 从 variants 中提取质量选项
  const variants = videoData.media.video.variants || [];
  const qualities = variants
    .filter(variant => variant.type === 'video/mp4') // 只使用 mp4 格式
    .map((variant, index) => ({
      label: variant.bitrate ? `${variant.bitrate / 1000}kbps` : `Quality ${index + 1}`,
      src: variant.src,
      index
    }));

  // 当前选中的视频 URL
  const currentUrl = qualities[activeQuality]?.src || variants[0].src;

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      <VideoPlayer 
        src={currentUrl}
        poster={videoData.media.video.poster || ''} // 使用 poster 作为视频缩略图
      />
      
      <div className="p-4">
        <h3 className="text-xl font-medium mb-2">
          {videoData.description || 'X平台媒体'} {/* 使用 description 作为标题 */}
        </h3>
        
        {qualities.length > 1 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">选择质量:</h4>
            <div className="flex flex-wrap gap-2">
              {qualities.map((quality) => (
                <button
                  key={quality.index}
                  onClick={() => setActiveQuality(quality.index)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    activeQuality === quality.index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {quality.label}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end items-center">
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            下载媒体
          </a>
        </div>
      </div>
    </div>
  );
}