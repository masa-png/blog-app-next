"use client";

import api from "@/app/_utils/api";
import { supabase } from "@/utils/supabase";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";
import { Category } from "@/app/_types/post";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postFormSchema, PostFormSchema } from "../../../_lib/validation";

interface PostFormProps {
  defaultValues?: PostFormSchema;
  onSubmit: (data: PostFormSchema, e: React.BaseSyntheticEvent) => void;
  onDelete?: (e: React.FormEvent) => void;
  submitLabel: string;
  submittingLabel: string;
}

const fetchCategories = (url: string) => api.get(url);

export default function PostForm({
  defaultValues,
  onSubmit,
  onDelete,
  submitLabel,
  submittingLabel,
}: PostFormProps) {
  const endpoint = "/api/admin/categories";
  const { data: categoriesData, isLoading: loadingCategories } = useSWR(
    endpoint,
    fetchCategories
  );
  const categories: Category[] = categoriesData?.categories || [];

  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostFormSchema>({
    resolver: zodResolver(postFormSchema),
    defaultValues: defaultValues || {
      title: "",
      content: "",
      thumbnailImageKey: "",
      categories: [],
    },
  });

  // サムネイル画像のURL取得
  const thumbnailImageKey = watch("thumbnailImageKey");
  useEffect(() => {
    if (!thumbnailImageKey) {
      setThumbnailUrl(null);
      return;
    }
    const fetchImageUrl = async () => {
      const { data } = await supabase.storage
        .from("post-thumbnail")
        .getPublicUrl(thumbnailImageKey || "");
      setThumbnailUrl(data.publicUrl);
    };
    fetchImageUrl();
  }, [thumbnailImageKey]);

  // 画像アップロード
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    const filePath = `private/${uuidv4()}`;
    try {
      const { data, error } = await supabase.storage
        .from("post-thumbnail")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (error) {
        alert(`画像のアップロードに失敗しました: ${error.message}`);
        return;
      }
      setValue("thumbnailImageKey", data.path, { shouldValidate: true });
    } catch (error) {
      alert("画像のアップロード中にエラーが発生しました。");
      console.error(error);
    }
  };

  // カテゴリー選択
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );
    setValue("categories", selected, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit((data, e) => onSubmit(data, e!))}>
      <div className="mb-6">
        <label htmlFor="title" className="block mb-2 font-medium">
          タイトル
        </label>
        <input
          type="text"
          id="title"
          {...register("title")}
          className="border border-gray-300 rounded-lg p-4 w-full"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>
      <div className="mb-6">
        <label htmlFor="content" className="block mb-2 font-medium">
          内容
        </label>
        <textarea
          id="content"
          rows={8}
          {...register("content")}
          className="border border-gray-300 rounded-lg p-4 w-full h-60"
          disabled={isSubmitting}
        ></textarea>
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>
      <div className="mb-6">
        <label htmlFor="thumbnailImageKey" className="block mb-2 font-medium">
          サムネイル画像
        </label>
        <input
          type="file"
          id="thumbnailImageKey"
          onChange={handleImageChange}
          accept="image/*"
          disabled={isSubmitting}
        />
        {/* 画像の表示 */}
        {thumbnailUrl && (
          <div className="mt-2">
            <Image
              src={thumbnailUrl}
              alt="thumbnail"
              width={400}
              height={400}
              className="rounded border border-gray-200"
            />
          </div>
        )}
      </div>
      <div className="mb-6">
        <label htmlFor="category" className="block mb-2 font-medium">
          カテゴリー
        </label>
        {loadingCategories ? (
          <p>カテゴリーを読み込み中...</p>
        ) : (
          <select
            id="category"
            className="border border-gray-300 rounded-lg p-4 w-full"
            value={watch("categories").map(String)}
            onChange={handleCategoryChange}
            disabled={isSubmitting}
            multiple
            size={Math.min(categories.length || 1, 5)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
        {errors.categories && (
          <p className="text-red-500 text-sm mt-1">
            {errors.categories.message}
          </p>
        )}
      </div>
      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
        {onDelete && (
          <button
            type="button"
            className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
            onClick={onDelete}
            disabled={isSubmitting}
          >
            削除
          </button>
        )}
      </div>
    </form>
  );
}
