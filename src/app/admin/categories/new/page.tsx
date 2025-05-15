"use client";

import { useState } from "react";
import CategoryForm from "../_components/CategoryForm";
import { validateCategoryForm } from "../../_components/validation";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

interface FormData {
  name: string;
}

interface FormErrors {
  name?: string;
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useSupabaseSession();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = (): boolean => {
    const newErrors = validateCategoryForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!token) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          name: formData.name,
        }),
      });
      if (res.ok) {
        alert("カテゴリーを新規作成しました");
        setFormData({
          name: "",
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
      <h1 className="text-2xl font-bold mb-8">カテゴリー作成</h1>
      <CategoryForm
        formData={formData}
        errors={errors}
        isSubmitting={isSubmitting}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="作成"
        submittingLabel="作成中..."
      />
    </div>
  );
}
