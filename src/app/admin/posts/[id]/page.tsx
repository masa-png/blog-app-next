"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { Post, PostCategory } from "@/app/_types/post";
import PostForm from "../_components/PostForm";
import { validatePostForm } from "../../_components/validation";
import api from "@/app/_utils/api";

interface FormData {
  title: string;
  content: string;
  thumbnailImageKey?: string;
  categories: number[];
}

interface FormErrors {
  title?: string;
  content?: string;
  thumbnailImageKey?: string;
  categories?: string;
}

const fetchPost = (url: string) => api.get(url);

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const postId = params?.id;
  const endpoint = "/api/admin/posts/";
  const postUrl = `${endpoint}${postId}`;

  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    thumbnailImageKey: "",
    categories: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);

  // SWRを使用して記事データを取得
  const { data, error, isLoading } = useSWR(postId ? postUrl : null, fetchPost);

  // データが利用可能になったらフォームデータを設定
  useEffect(() => {
    if (data?.post && !isLoading && !formInitialized) {
      const post: Post = data.post;
      setFormData({
        title: post.title,
        content: post.content,
        thumbnailImageKey: post.thumbnailImageKey,
        categories: post.postCategories.map(
          (category: PostCategory) => category.id
        ),
      });
      setFormInitialized(true); // フォームが初期化されたことをマーク
    }
  }, [data, isLoading, formInitialized]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );
    setFormData({ ...formData, categories: selected });
  };

  const validateForm = (): boolean => {
    const newErrors = validatePostForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

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
        // 記事一覧のキャッシュを更新
        mutate(endpoint);
        // 現在の記事のキャッシュを更新
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

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!window.confirm("本当に削除しますか？")) return;

    setIsSubmitting(true);
    try {
      const res = await api.delete(postUrl);
      if (res.ok) {
        // 記事一覧のキャッシュを更新
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
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onCategoryChange={handleCategoryChange}
          onSubmit={handleUpdate}
          onDelete={handleDelete}
          submitLabel="更新"
          submittingLabel="更新中..."
        />
      )}
    </div>
  );
}
