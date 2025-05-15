"use client";

import { Post } from "@/app/_types/post";
import { supabase } from "@/utils/supabase";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<null | string>(null);

  // APIでpost(記事詳細)を取得する処理をuseEffectで実行
  useEffect(() => {
    const fetcher = async () => {
      setLoading(true);
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      setPost(data.post);

      if (data.post?.thumbnailImageKey) {
        const {
          data: { publicUrl },
        } = await supabase.storage
          .from("post-thumbnail")
          .getPublicUrl(data.post.thumbnailImageKey);

        setThumbnailUrl(publicUrl);
      }
      setLoading(false);
    };

    fetcher();
  }, [id]);

  if (loading) return <p>読み込み中...</p>;

  if (!loading && !post) return <p>投稿がみつかりませんでした</p>;

  // TypeScriptにpostがnullでないことを伝える型アサーション
  const safePost = post as Post;

  return (
    <div>
      <div className="max-w-3xl mt-36 mx-auto">
        <div>
          <div>
            <Image
              src={thumbnailUrl ? thumbnailUrl : ""}
              alt="thumbnail"
              height={400}
              width={800}
            />
          </div>
          <div className="mt-3 p-4">
            <div className="flex justify-between">
              <div className="text-gray-400 text-xs">
                {new Date(safePost.createdAt).toLocaleDateString()}
              </div>
              <div className="flex flex-wrap">
                {safePost.postCategories.map((category) => {
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
            <p className="text-[#000] text-2xl mb-4 mt-2">{safePost.title}</p>
            <div
              dangerouslySetInnerHTML={{ __html: safePost.content }}
              className="text-[#000] text-base leading-normal"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
