"use client";

import { MicroCmsPost } from "@/app/_types/MicroCmsPost";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [post, setPost] = useState<MicroCmsPost | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // APIでpost(記事詳細)を取得する処理をuseEffectで実行
  useEffect(() => {
    const fetcher = async () => {
      setLoading(true);
      const res = await fetch(
        `https://m10s91bwq0.microcms.io/api/v1/posts/${id}`,
        {
          headers: {
            "X-MICROCMS-API-KEY": process.env
              .NEXT_PUBLIC_MICROCMS_API_KEY as string,
          },
        }
      );
      const data = await res.json();
      setPost(data);
      setLoading(false);
    };

    fetcher();
  }, [id]);

  if (loading) return <p>読み込み中...</p>;

  console.log(post);

  if (!loading && !post) return <p>投稿がみつかりませんでした</p>;

  // TypeScriptにpostがnullでないことを伝える型アサーション
  const safePost = post as MicroCmsPost;

  return (
    <div>
      <div className="max-w-3xl mt-16 mx-auto">
        <div>
          <div>
            <Image
              src={safePost.thumbnail.url}
              alt="thumbnail"
              width={safePost.thumbnail.width}
              height={safePost.thumbnail.height}
            />
          </div>
          <div className="mt-3 p-4">
            <div className="flex justify-between">
              <div className="text-gray-400 text-xs">
                {new Date(safePost.createdAt).toLocaleDateString()}
              </div>
              <div className="flex flex-wrap">
                {safePost.categories.map((category) => {
                  return (
                    <div
                      key={category.id}
                      className="px-1.5 py-1 mr-2 text-xs text-blue-600 border border-blue-600 rounded"
                    >
                      {category.name}
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
