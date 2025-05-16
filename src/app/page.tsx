"use client";

import Link from "next/link";
import useSWR from "swr";
import { Post } from "./_types/post";

const fetchPosts = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  // SWRフックを使用してデータを取得
  const { data, error, isLoading } = useSWR("/api/posts", fetchPosts);

  // データが利用可能になったらpostsを抽出
  const posts: Post[] = data?.posts || [];

  // ローディング状態の表示
  if (isLoading)
    return <p className="max-w-3xl mx-auto mt-36 px-4">読み込み中...</p>;

  // エラー状態の表示
  if (error)
    return (
      <p className="max-w-3xl mx-auto mt-36 px-4">
        エラーが発生しました: {error.message}
      </p>
    );

  // 投稿が見つからない場合の表示
  if (posts.length === 0)
    return (
      <p className="max-w-3xl mx-auto mt-36 px-4">投稿がみつかりませんでした</p>
    );

  return (
    <div>
      <div className="max-w-3xl mx-auto mt-36 px-4">
        <ul>
          {/* ブログの記事をループして表示 */}
          {posts.map((post: Post) => {
            return (
              <li key={post.id} className="flex flex-col list-none m-0 p-0">
                <Link href={`posts/${post.id}`} className="block bg-white">
                  <div className="border border-gray-300 mb-8 py-4 pl-4 pr-8">
                    <div>
                      <div className="flex justify-between">
                        <div className="text-gray-400 text-xs">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex flex-wrap">
                          {post.postCategories.map((category) => {
                            return (
                              <div
                                key={category.id}
                                className="px-1.5 py-1 mr-2 text-xs text-blue-600 border border-blue-600 rounded"
                              >
                                {category.category.name}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <p className="text-[#333] text-2xl mb-4 mt-2">
                        {post.title}
                      </p>
                      <div
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        className="text-[#333] text-base leading-normal line-clamp-2"
                      ></div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
