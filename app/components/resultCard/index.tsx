// app/components/resultCard.tsx
import React, { useState } from 'react';
import Image from 'next/image';

interface VideoFormat {
  quality: string;
  url: string;
}

interface VideoData {
  url: string;
  title?: string;
  thumbnail?: string;
  formats?: VideoFormat[];
}

interface ResultCardProps {
  videoData: VideoData;
}

const ResultCard: React.FC<ResultCardProps> = ({ videoData }) => {
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat | null>(
    videoData.formats?.[0] || null
  );

  const handleDownload = () => {
    if (selectedFormat) {
      // 直接打开下载链接
      window.open(selectedFormat.url, '_blank');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      {/* 视频缩略图 */}
      {videoData.thumbnail && (
        <div className="mb-4 w-full h-64 relative">
          <Image 
            src={videoData.thumbnail} 
            alt={videoData.title || 'Video Thumbnail'} 
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}

      {/* 视频标题 */}
      <h2 className="text-xl font-bold mb-4 truncate">
        {videoData.title || '未知标题'}
      </h2>

      {/* 质量选择 */}
      {videoData.formats && videoData.formats.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择下载质量
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {videoData.formats.map((format) => (
              <button
                key={format.quality}
                onClick={() => setSelectedFormat(format)}
                className={`
                  px-3 py-2 rounded-md text-sm 
                  ${selectedFormat?.quality === format.quality 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                `}
              >
                {format.quality}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 下载按钮 */}
      <button
        onClick={handleDownload}
        disabled={!selectedFormat}
        className={`
          w-full py-3 rounded-md text-white font-semibold transition 
          ${selectedFormat 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-gray-400 cursor-not-allowed'}
        `}
      >
        {selectedFormat ? '立即下载' : '暂无可用下载'}
      </button>
    </div>
  );
};

export default ResultCard;