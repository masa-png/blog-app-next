"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.id;

  const [formData, setFormData] = useState<FormData>({
    name: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useSupabaseSession();

  // カテゴリーの取得
  useEffect(() => {
    if (!categoryId) return;

    if (!token) return;

    const fetchCategory = async () => {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await res.json();
      const category = data.category;
      setFormData({
        name: category.name,
      });
    };
    fetchCategory();
  }, [categoryId, token]);

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

    if (!token) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
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

    if (!token) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
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
    <div className="p-7">
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
  );
}
