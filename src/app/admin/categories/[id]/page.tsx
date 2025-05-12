"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../_components/Sidebar";
import { useParams, useRouter } from "next/navigation";

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
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "カテゴリーを入力してください。";
    } else if (formData.name.length > 50) {
      newErrors.name = "カテゴリーは50文字以内で入力してください。";
    }

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
        <form onSubmit={handleUpdate}>
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 font-medium">
              カテゴリー名
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="border border-gray-300 rounded-lg p-4 w-full"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="flex gap-4">
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
