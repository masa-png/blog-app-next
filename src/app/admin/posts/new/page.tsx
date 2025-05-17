"use client";

import PostForm from "../_components/PostForm";
import api from "@/app/_utils/api";
import { useRouter } from "next/navigation";

interface FormData {
  title: string;
  content: string;
  thumbnailImageKey?: string;
  categories: number[];
}

export default function Page() {
  const router = useRouter();
  const endpoint = "/api/admin/posts";

  // react-hook-form用の初期値
  const defaultValues: FormData = {
    title: "",
    content: "",
    thumbnailImageKey: "",
    categories: [],
  };

  // react-hook-formのonSubmit用
  const handleSubmit = async (
    formData: FormData,
    e: React.BaseSyntheticEvent
  ) => {
    e.preventDefault();
    try {
      const res = await api.post(endpoint, {
        title: formData.title,
        content: formData.content,
        thumbnailImageKey: formData.thumbnailImageKey,
        categories: formData.categories.map((id) => ({ id })),
      });
      if (res.ok) {
        alert("記事を作成しました");
        router.push("/admin/posts");
      } else {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.message || `エラー: ${res.status}`;
        alert(`作成に失敗しました。${errorMessage}`);
      }
    } catch (error) {
      alert("作成に失敗しました。もう一度お試しください。");
    }
  };

  return (
    <div className="p-7">
      <h1 className="text-2xl font-bold mb-8">記事作成</h1>
      <PostForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel="作成"
        submittingLabel="作成中..."
      />
    </div>
  );
}
