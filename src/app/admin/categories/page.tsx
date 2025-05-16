"use client";

import Link from "next/link";
import useSWR from "swr";
import { Category } from "@/app/_types/post";
import api from "@/app/_utils/api";

const fetchCategories = (url: string) => api.get(url);

export default function Page() {
  const endpoint = "/api/admin/categories";

  // SWRフックを使用してデータを取得
  const { data, error, isLoading } = useSWR(endpoint, fetchCategories);

  // データが利用可能になったらcategoriesを抽出
  const categories: Category[] = data?.categories || [];

  return (
    <div className="px-8 py-8">
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
        {error ? (
          <div className="py-4 text-red-500">
            エラーが発生しました: {error.message}
          </div>
        ) : isLoading ? (
          <div className="py-4">読み込み中...</div>
        ) : categories.length === 0 ? (
          <div className="py-4 text-gray-500">
            カテゴリーがありません。新規作成ボタンからカテゴリーを追加してください。
          </div>
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
  );
}
