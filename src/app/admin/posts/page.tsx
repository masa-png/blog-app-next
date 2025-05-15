"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Post } from "@/app/_types/post";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useSupabaseSession();

  // 記事一覧取得
  useEffect(() => {
    if (!token) return;

    const fetchPosts = async () => {
      setLoading(true);
      const res = await fetch("/api/admin/posts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Header に token を付与
        },
      });
      const data = await res.json();
      setPosts(data.posts);
      setLoading(false);
    };
    fetchPosts();
  }, [token]);

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
        {loading ? (
          <div>読み込み中...</div>
        ) : (
          posts.map((post) => (
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
