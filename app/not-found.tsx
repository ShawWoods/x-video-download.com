// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404 - 页面未找到</h1>
      <p className="mt-4">请检查 URL 或返回主页。</p>
      <a href="/" className="mt-4 text-blue-600 underline">返回主页</a>
    </div>
  );
}
