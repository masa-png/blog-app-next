"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const isSelected = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <>
      <aside className="fixed bg-gray-100 w-[280px] left-0 bottom-0 top-[72px]">
        <Link
          href="/admin/posts"
          className={`p-4 block hover:bg-blue-100 ${
            isSelected("/admin/posts") && "bg-blue-100"
          }`}
        >
          記事一覧
        </Link>
        <Link
          href="/admin/categories"
          className={`p-4 block hover:bg-blue-100 ${
            isSelected("/admin/categories") && "bg-blue-100"
          }`}
        >
          カテゴリー一覧
        </Link>
      </aside>
    </>
  );
}
