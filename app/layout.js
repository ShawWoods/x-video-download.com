import { GeistSans, GeistMono } from 'next/font/google';
import './globals.css';

// Define fonts
const geistSans = GeistSans({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = GeistMono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Metadata export
export const metadata = {
  title: 'X-Video-Downloader',
  description: 'X视频下载器 - 免费下载Twitter和X平台视频',
};

// RootLayout component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
