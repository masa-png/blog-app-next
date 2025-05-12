"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[320px] bg-[#f3f4f6] border-r border-[#e5e7eb]">
      <div>
        <Link
          href="/admin/posts/"
          className={`block px-4 py-4 mb-2 text-base text-left rounded-none transition-all ${
            pathname === "/admin/posts"
              ? "bg-[#e4edfc] text-black font-bold"
              : "text-black"
          }`}
        >
          記事一覧
        </Link>
        <Link
          href="/admin/categories/"
          className={`block px-4 py-4 text-base text-left rounded-none transition-all ${
            pathname === "/admin/categories"
              ? "bg-[#e4edfc] text-black font-bold"
              : "text-black"
          }`}
        >
          カテゴリー一覧
        </Link>
      </div>
    </div>
  );
}
