"use client";

import Link from "next/link";
import useSWR from "swr";
import { Post } from "@/app/_types/post";
import api from "@/app/_utils/api";

const fetchPosts = (url: string) => api.get(url);

export default function Page() {
  const endpoint = "/api/admin/posts";

  // SWRフックを使用してデータを取得
  const { data, error, isLoading } = useSWR(endpoint, fetchPosts);

  // データが利用可能になったらpostsを抽出
  const posts: Post[] = data?.posts || [];

  return (
    <div className="px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-2xl">記事一覧</h1>
        <Link
          href="/admin/posts/new"
          className="bg-blue-500 text-white rounded px-4 py-2 font-bold hover:bg-blue-600 transition"
        >
          新規作成
        </Link>
      </div>
      <div>
        {error ? (
          <div>エラーが発生しました: {error.message}</div>
        ) : isLoading ? (
          <div>読み込み中...</div>
        ) : (
          posts.map((post: Post) => (
            <div key={post.id} className="border-b border-gray-200 py-6">
              <div className="font-bold text-xl mb-1">{post.title}</div>
              <div className="text-gray-400 text-base">
                {new Date(post.createdAt).toLocaleDateString("ja-JP")}
              </div>
              <Link
                href={`/admin/posts/${post.id}`}
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
