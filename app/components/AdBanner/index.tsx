interface AdBannerProps {
    position: 'middle' | 'sidebar' | 'footer';
  }
  
  export default function AdBanner({ position }: AdBannerProps) {
    const styles = {
      middle: 'w-full h-32 bg-gray-200 flex items-center justify-center rounded',
      sidebar: 'w-full h-64 bg-gray-200 flex items-center justify-center rounded',
      footer: 'w-full h-24 bg-gray-200 flex items-center justify-center',
    };
  
    return (
      <div className={styles[position]}>
        <p className="text-gray-500">广告位 - {position}</p>
      </div>
    );
  }