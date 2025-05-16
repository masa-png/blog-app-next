"use client";

import { Post } from "@/app/_types/post";
import { supabase } from "@/utils/supabase";
import Image from "next/image";
import useSWR from "swr";

const fetchPost = (url: string) => fetch(url).then((res) => res.json());

// 画像URL取得用のフェッチャー
const imageUrlFetcher = async (key: string) => {
  if (!key) return null;
  const { data } = await supabase.storage
    .from("post-thumbnail")
    .getPublicUrl(key);
  return data.publicUrl;
};

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  // 記事データを取得
  const {
    data: postData,
    error: postError,
    isLoading: postLoading,
  } = useSWR(`/api/posts/${id}`, fetchPost);

  // 記事が利用可能になったら取得
  const post: Post | null = postData?.post || null;

  // サムネイル画像のURLを取得（記事データが利用可能になった後）
  const { data: thumbnailUrl } = useSWR(
    () => post?.thumbnailImageKey || null,
    imageUrlFetcher
  );

  // ローディング状態の表示
  if (postLoading)
    return <p className="max-w-3xl mx-auto mt-36 px-4">読み込み中...</p>;

  // エラー状態の表示
  if (postError)
    return (
      <p className="max-w-3xl mx-auto mt-36 px-4">
        エラーが発生しました: {postError.message}
      </p>
    );

  // 投稿が見つからない場合の表示
  if (!post)
    return (
      <p className="max-w-3xl mx-auto mt-36 px-4">投稿がみつかりませんでした</p>
    );

  return (
    <div>
      <div className="max-w-3xl mt-36 mx-auto">
        <div>
          <div>
            <Image
              src={thumbnailUrl || ""}
              alt="thumbnail"
              height={400}
              width={800}
            />
          </div>
          <div className="mt-3 p-4">
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
            <p className="text-[#000] text-2xl mb-4 mt-2">{post.title}</p>
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="text-[#000] text-base leading-normal"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
