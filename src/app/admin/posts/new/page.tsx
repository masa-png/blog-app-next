"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../_components/Sidebar";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          thumbnailUrl: formData.thumbnailUrl,
          categories: formData.categories.map((id) => ({ id })),
        }),
      });
      if (res.ok) {
        alert("記事を作成しました");
        setFormData({
          title: "",
          content: "",
          thumbnailUrl: "",
          categories: [],
        });
        setErrors({});
      } else {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.message || `エラー: ${res.status}`;
        alert(`作成に失敗しました。${errorMessage}`);
      }
    } catch (error) {
      alert("作成に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fafbfc]">
      <Sidebar />

      <div className="flex-1 p-7">
        <h1 className="text-2xl font-bold mb-8">記事作成</h1>
        <PostForm
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          categories={categories}
          loadingCategories={loadingCategories}
          onChange={handleChange}
          onCategoryChange={handleCategoryChange}
          onSubmit={handleSubmit}
          submitLabel="作成"
          submittingLabel="作成中..."
        />
      </div>
    </div>
  );
}
