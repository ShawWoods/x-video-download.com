'use client';
import { useEffect, useState } from 'react';

interface RankingItem {
  url: string;
  title: string;
  download_count: number;
}

export default function DownloadRankings() {
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch('/api/rankings');
        if (!response.ok) throw new Error('Failed to fetch rankings');
        const data = await response.json();
        setRankings(data);
      } catch (error) {
        console.error('Error fetching rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">本站下载量排行</h2>
      {loading ? (
        <p>加载中...</p>
      ) : rankings.length > 0 ? (
        <ol className="list-decimal list-inside space-y-2">
          {rankings.map((item, index) => (
            <li key={item.url}>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {item.title || '未知标题'}
              </a>{' '}
              - <span className="text-gray-600">{item.download_count} 次下载</span>
            </li>
          ))}
        </ol>
      ) : (
        <p>暂无排行数据</p>
      )}
    </div>
  );
}