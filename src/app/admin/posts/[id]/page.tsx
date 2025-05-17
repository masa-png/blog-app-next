"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { PostCategory } from "@/app/_types/post";
import PostForm from "../_components/PostForm";
import api from "@/app/_utils/api";

interface FormData {
  title: string;
  content: string;
  thumbnailImageKey?: string;
  categories: number[];
}

const fetchPost = (url: string) => api.get(url);

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const postId = params?.id;
  const endpoint = "/api/admin/posts/";
  const postUrl = `${endpoint}${postId}`;

  const { data, error, isLoading } = useSWR(postId ? postUrl : null, fetchPost);

  // フォーム初期値
  const defaultValues = data?.post
    ? {
        title: data.post.title,
        content: data.post.content,
        thumbnailImageKey: data.post.thumbnailImageKey,
        categories: data.post.postCategories.map(
          (category: PostCategory) => category.id
        ),
      }
    : {
        title: "",
        content: "",
        thumbnailImageKey: "",
        categories: [],
      };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 更新処理（react-hook-formのonSubmit用）
  const handleUpdate = async (
    formData: FormData,
    e: React.BaseSyntheticEvent
  ) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updateData = {
        title: formData.title,
        content: formData.content,
        thumbnailImageKey: formData.thumbnailImageKey,
        categories: formData.categories.map((id) => ({ id })),
      };
      const res = await api.put(postUrl, updateData);
      if (res.ok) {
        mutate(endpoint);
        mutate(postUrl);
        alert("記事を更新しました");
        router.push("/admin/posts");
      } else {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.message || `エラー: ${res.status}`;
        alert(`更新に失敗しました。${errorMessage}`);
      }
    } catch (error) {
      alert("更新に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 削除処理
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm("本当に削除しますか？")) return;
    setIsSubmitting(true);
    try {
      const res = await api.delete(postUrl);
      if (res.ok) {
        mutate(endpoint);
        alert("記事を削除しました");
        router.push("/admin/posts");
      } else {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.message || `エラー: ${res.status}`;
        alert(`削除に失敗しました。${errorMessage}`);
      }
    } catch (error) {
      alert("削除に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error)
    return <div className="p-7">エラーが発生しました: {error.message}</div>;

  return (
    <div className="p-7">
      <h1 className="text-2xl font-bold mb-8">記事編集</h1>
      {isLoading ? (
        <div>読み込み中...</div>
      ) : (
        <PostForm
          defaultValues={defaultValues}
          isSubmitting={isSubmitting}
          onSubmit={handleUpdate}
          onDelete={handleDelete}
          submitLabel="更新"
          submittingLabel="更新中..."
        />
      )}
    </div>
  );
}
