// components/VideoPlayer.js
export default function VideoPlayer({ videoUrl }) {
  return (
    <div className="video-container">
      <video controls width="600">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <style jsx>{`
        .video-container {
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
}