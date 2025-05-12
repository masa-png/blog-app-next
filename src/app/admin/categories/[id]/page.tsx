"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../_components/Sidebar";
import { useParams, useRouter } from "next/navigation";
import CategoryForm from "../_components/CategoryForm";
import { validateCategoryForm } from "../../_components/validation";

interface FormData {
  name: string;
}

interface FormErrors {
  name?: string;
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.id;

  const [formData, setFormData] = useState<FormData>({
    name: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // カテゴリーの取得
  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      const res = await fetch(`/api/admin/categories/${categoryId}`);
      const data = await res.json();
      const category = data.category;
      setFormData({
        name: category.name,
      });
    };
    fetchCategory();
  }, [categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = (): boolean => {
    const newErrors = validateCategoryForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
        }),
      });
      if (res.ok) {
        alert("カテゴリーを更新しました");
        router.push("/admin/categories");
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
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("カテゴリーを削除しました");
        router.push("/admin/categories");
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
        <h1 className="text-2xl font-bold mb-8">カテゴリー編集</h1>
        <CategoryForm
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onSubmit={handleUpdate}
          onDelete={handleDelete}
          submitLabel="更新"
          submittingLabel="更新中..."
        />
      </div>
    </div>
  );
}
