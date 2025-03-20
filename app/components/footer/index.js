export default function Footer() {
    return (
      <footer className="bg-gray-100 border-t">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} X平台视频下载器 - 仅供学习交流使用
          </p>
          <p className="text-center text-gray-500 text-xs mt-2">
            免责声明：本网站不存储任何视频内容，仅提供下载功能。请遵守相关法律法规，不得用于非法用途。
          </p>
        </div>
      </footer>
    );
  }