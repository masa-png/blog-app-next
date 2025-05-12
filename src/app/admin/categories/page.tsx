"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Category } from "@/app/_types/post";
import Sidebar from "../_components/Sidebar";

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoadingCategories] = useState<boolean>(false);

  // カテゴリー一覧取得
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories);
      setLoadingCategories(false);
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#fafbfc]">
      <Sidebar />

      <div className="flex-1 px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-2xl">カテゴリー一覧</h1>
          <Link
            href="/admin/categories/new"
            className="bg-blue-500 text-white rounded px-4 py-2 font-bold hover:bg-blue-600 transition"
          >
            新規作成
          </Link>
        </div>
        <div>
          {loading ? (
            <div>読み込み中...</div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="border-b border-gray-200 py-6">
                <div className="font-bold text-xl mb-1">{category.name}</div>
                <Link
                  href={`/admin/categories/${category.id}`}
                  className="inline-block mt-2 text-blue-600 underline text-sm hover:text-blue-800"
                >
                  編集ページへ
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
