"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import CategoryForm from "../_components/CategoryForm";
import api from "@/app/_utils/api";

const fetcherCategory = (url: string) => api.get(url);

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.id;
  const endpoint = "/api/admin/categories/";
  const categoryUrl = categoryId ? `${endpoint}${categoryId}` : null;

  // SWRを使用してカテゴリーデータを取得
  const { data, error, isLoading } = useSWR(categoryUrl, fetcherCategory);

  // フォーム初期値
  const defaultValues = data?.category
    ? { name: data.category.name }
    : { name: "" };

  // 更新処理（react-hook-formのonSubmit用）
  const handleUpdate = async (
    formData: { name: string },
    e: React.BaseSyntheticEvent
  ) => {
    e.preventDefault();
    try {
      const res = await api.put(`${endpoint}${categoryId}`, {
        name: formData.name,
      });
      if (res.ok) {
        mutate(endpoint);
        mutate(categoryUrl);
        alert("カテゴリーを更新しました");
        router.push("/admin/categories");
      } else {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.message || `エラー: ${res.status}`;
        alert(`更新に失敗しました。${errorMessage}`);
      }
    } catch (error) {
      alert("更新に失敗しました。もう一度お試しください。");
    }
  };

  // 削除処理
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      const res = await api.delete(`${endpoint}${categoryId}`);
      if (res.ok) {
        mutate(endpoint);
        alert("カテゴリーを削除しました");
        router.push("/admin/categories");
      } else {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.message || `エラー: ${res.status}`;
        alert(`削除に失敗しました。${errorMessage}`);
      }
    } catch (error) {
      alert("削除に失敗しました。もう一度お試しください。");
    }
  };

  // エラーとローディング状態の処理
  if (error)
    return <div className="p-7">エラーが発生しました: {error.message}</div>;

  return (
    <div className="p-7">
      <h1 className="text-2xl font-bold mb-8">カテゴリー編集</h1>
      {isLoading ? (
        <div>読み込み中...</div>
      ) : (
        <CategoryForm
          defaultValues={defaultValues}
          onSubmit={handleUpdate}
          onDelete={handleDelete}
          submitLabel="更新"
          submittingLabel="更新中..."
        />
      )}
    </div>
  );
}
