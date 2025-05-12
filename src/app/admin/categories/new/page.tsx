"use client";

import { useState } from "react";
import Sidebar from "../../_components/Sidebar";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <div className="flex min-h-screen bg-[#fafbfc]">
      <Sidebar />

      <div className="flex-1 p-7">
        <h1 className="text-2xl font-bold mb-8">カテゴリー作成</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block mb-2 font-medium">
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

          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "作成中..." : "作成"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
