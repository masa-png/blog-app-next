"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#333] text-white font-bold p-6 flex justify-between items-center shadow-lg">
      <Link href="/" className="text-base">
        Blog
      </Link>
      <Link href="/contact" className="text-base">
        お問い合わせ
      </Link>
    </header>
  );
}
