'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';

export default function VideoPlayer({ src, poster }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      console.log('VideoPlayer loading src:', src);
    }
  }, [src]);

  if (!src) {
    console.log('VideoPlayer: src is empty');
    return null;
  }

  const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm');

  if (isVideo) {
    return (
      <div className="w-full rounded-lg overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="w-full h-auto"
          controls
          poster={poster || ''}
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
          您的浏览器不支持HTML5视频。
        </video>
      </div>
    );
  } else {
    return (
      <div className="w-full h-[300px] relative"> {/* Set height as needed */}
        <Image
          src={src}
          alt="Media content"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
          onLoad={() => console.log('Image loaded:', src)}
          onError={(e) => console.error('Image load error:', src, e)}
        />
</div>
    );
  }
}
