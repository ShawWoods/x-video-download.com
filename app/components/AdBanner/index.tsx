'use client';
import { useEffect, useRef } from 'react';

interface AdBannerProps {
  id: string;
  size: 'horizontal' | 'vertical' | 'rectangle';
}

const AdBanner: React.FC<AdBannerProps> = ({ id, size }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined' && adContainerRef.current) {
      try {
        // This is where you would initialize Google AdSense ads
        // This is a placeholder as actual implementation depends on your Google AdSense account
        if ((window as any).adsbygoogle) {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({});
        }
      } catch (error) {
        console.error('Error loading ads:', error);
      }
    }
  }, [id]);

  // Define dimensions based on size prop
  const getDimensions = () => {
    switch (size) {
      case 'horizontal':
        return {
          className: 'w-full h-[90px] md:h-[90px]',
          style: { minHeight: '90px' }
        };
      case 'vertical':
        return {
          className: 'w-full h-[600px]',
          style: { minHeight: '250px' }
        };
      case 'rectangle':
        return {
          className: 'w-full h-[250px]',
          style: { minHeight: '250px' }
        };
      default:
        return {
          className: 'w-full h-[90px]',
          style: { minHeight: '90px' }
        };
    }
  };

  const { className, style } = getDimensions();

  return (
    <div 
      ref={adContainerRef}
      id={`ad-container-${id}`}
      className={`bg-gray-100 flex items-center justify-center rounded border border-gray-200 overflow-hidden ${className}`}
      style={style}
    >
      {/* AdSense code will be inserted here */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="YOUR-ADSENSE-CLIENT-ID" // Replace with your actual AdSense client ID
        data-ad-slot={id}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      
      {/* Placeholder text - remove in production */}
      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
        广告位 {id}
      </div>
    </div>
  );
};

export default AdBanner;
