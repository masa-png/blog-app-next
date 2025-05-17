"use client";

import { useState } from "react";
import CategoryForm from "../_components/CategoryForm";
import api from "@/app/_utils/api";
import { useRouter } from "next/navigation";

export default function Page() {
  const defaultValues = { name: "" };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const endpoint = "/api/admin/categories";

  // react-hook-formのonSubmit用
  const handleSubmit = async (
    formData: { name: string },
    e: React.BaseSyntheticEvent
  ) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post(endpoint, { name: formData.name });
      if (res.ok) {
        alert("カテゴリーを新規作成しました");
        router.push("/admin/categories");
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
        defaultValues={defaultValues}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        submitLabel="作成"
        submittingLabel="作成中..."
      />
    </div>
  );
}
