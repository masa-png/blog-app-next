"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../_components/Sidebar";
import { useParams, useRouter } from "next/navigation";
import { PostCategory } from "@/app/_types/post";
import PostForm from "../_components/PostForm";
import { validatePostForm } from "../../_components/validation";

interface FormData {
  title: string;
  content: string;
  thumbnailUrl: string;
  categories: number[];
}

interface FormErrors {
  title?: string;
  content?: string;
  thumbnailUrl?: string;
  categories?: string;
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const postId = params?.id;

  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    thumbnailUrl: "",
    categories: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loadingCategories, setLoadingCategories] = useState(true);

  // 記事詳細取得
  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      const res = await fetch(`/api/admin/posts/${postId}`);
      const data = await res.json();
      const post = data.post;
      setFormData({
        title: post.title,
        content: post.content,
        thumbnailUrl: post.thumbnailUrl,
        categories: post.postCategories.map(
          (category: PostCategory) => category.id
        ),
      });
    };
    fetchPost();
  }, [postId]);

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
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          thumbnailUrl: formData.thumbnailUrl,
          categories: formData.categories.map((id) => ({ id })),
        }),
      });
      if (res.ok) {
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
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });
      if (res.ok) {
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

  return (
    <div className="flex min-h-screen bg-[#fafbfc]">
      <Sidebar />

      <div className="flex-1 p-7">
        <h1 className="text-2xl font-bold mb-8">記事編集</h1>
        <PostForm
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          categories={categories}
          loadingCategories={loadingCategories}
          onChange={handleChange}
          onCategoryChange={handleCategoryChange}
          onSubmit={handleUpdate}
          onDelete={handleDelete}
          submitLabel="更新"
          submittingLabel="更新中..."
        />
      </div>
    </div>
  );
}
