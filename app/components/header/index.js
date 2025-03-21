'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-l font-bold no-underline">
          文化沟通的桥梁
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline">
                首页
              </Link>
            </li>
            <li>
              <Link href="/#about" className="hover:underline">
                关于
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
