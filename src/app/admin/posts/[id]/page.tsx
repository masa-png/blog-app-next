"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../_components/Sidebar";
import { useParams, useRouter } from "next/navigation";
import { PostCategory } from "@/app/_types/post";

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
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "タイトルは必須です。";
    } else if (formData.title.length > 50) {
      newErrors.title = "タイトルは50文字以内で入力してください。";
    }
    if (!formData.content.trim()) {
      newErrors.content = "内容は必須です。";
    } else if (formData.content.length > 1000) {
      newErrors.content = "内容は1000文字以内で入力してください。";
    }
    if (!formData.thumbnailUrl.trim()) {
      newErrors.thumbnailUrl = "サムネイルURLは必須です。";
    } else {
      const urlRegex = /^(https?:\/\/)[^\s]+$/;
      if (!urlRegex.test(formData.thumbnailUrl)) {
        newErrors.thumbnailUrl = "有効なURLを入力してください。";
      }
    }
    if (!formData.categories.length) {
      newErrors.categories = "カテゴリーを1つ以上選択してください。";
    }
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
        <form onSubmit={handleUpdate}>
          <div className="mb-6">
            <label htmlFor="title" className="block mb-2 font-medium">
              タイトル
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="border border-gray-300 rounded-lg p-4 w-full"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="content" className="block mb-2 font-medium">
              内容
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              className="border border-gray-300 rounded-lg p-4 w-full h-60"
              value={formData.content}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            ></textarea>
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="thumbnailUrl" className="block mb-2 font-medium">
              サムネイルURL
            </label>
            <input
              type="text"
              id="thumbnailUrl"
              name="thumbnailUrl"
              className="border border-gray-300 rounded-lg p-4 w-full"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              placeholder="https://example.com/image.png"
            />
            {errors.thumbnailUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.thumbnailUrl}</p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="category" className="block mb-2 font-medium">
              カテゴリー
            </label>
            <select
              id="category"
              name="categories"
              className="border border-gray-300 rounded-lg p-4 w-full"
              value={formData.categories.map(String)}
              onChange={handleCategoryChange}
              disabled={isSubmitting || loadingCategories}
              required
              multiple
              size={categories.length || 1}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categories && (
              <p className="text-red-500 text-sm mt-1">{errors.categories}</p>
            )}
          </div>
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "更新中..." : "更新"}
            </button>
            <button
              type="button"
              className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              削除
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
