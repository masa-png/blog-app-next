"use client";

import { useState } from "react";
import PostForm from "../_components/PostForm";
import { validatePostForm } from "../../_components/validation";
import api from "@/app/_utils/api";

interface FormData {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categories: number[];
}

interface FormErrors {
  title?: string;
  content?: string;
  thumbnailImageKey?: string;
  categories?: string;
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    thumbnailImageKey: "",
    categories: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const endpoint = "/api/admin/posts";

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
      const res = await api.post(endpoint, {
        title: formData.title,
        content: formData.content,
        thumbnailImageKey: formData.thumbnailImageKey,
        categories: formData.categories.map((id) => ({ id })),
      });
      if (res.ok) {
        alert("記事を作成しました");
        setFormData({
          title: "",
          content: "",
          thumbnailImageKey: "",
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
    <div className="p-7">
      <h1 className="text-2xl font-bold mb-8">記事作成</h1>
      <PostForm
        formData={formData}
        errors={errors}
        isSubmitting={isSubmitting}
        onChange={handleChange}
        onCategoryChange={handleCategoryChange}
        onSubmit={handleSubmit}
        submitLabel="作成"
        submittingLabel="作成中..."
      />
    </div>
  );
}
