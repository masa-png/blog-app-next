"use client";

import api from "@/app/_utils/api";
import { supabase } from "@/utils/supabase";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // 固有IDを生成するライブラリ
import useSWR from "swr";
import { Category } from "@/app/_types/post";

interface PostFormProps {
  formData: {
    title: string;
    content: string;
    thumbnailImageKey?: string;
    categories: number[];
  };

  errors: {
    title?: string;
    content?: string;
    thumbnailImageKey?: string;
    categories?: string;
  };

  isSubmitting: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: (e: React.FormEvent) => void;
  submitLabel: string;
  submittingLabel: string;
}

const fetchCategories = (url: string) => api.get(url);

export default function PostForm({
  formData,
  errors,
  isSubmitting,
  onChange,
  onCategoryChange,
  onSubmit,
  onDelete,
  submitLabel,
  submittingLabel,
}: PostFormProps) {
  const endpoint = "/api/admin/categories";

  // SWRを使用してカテゴリー一覧を取得
  const { data: categoriesData, isLoading: loadingCategories } = useSWR(
    endpoint,
    fetchCategories
  );

  // カテゴリー一覧
  const categories: Category[] = categoriesData?.categories || [];

  // サムネイルURLのstate
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  // formDataの変更を監視して画像URLを取得
  useEffect(() => {
    if (!formData.thumbnailImageKey) {
      setThumbnailUrl(null);
      return;
    }

    const fetchImageUrl = async () => {
      const { data } = await supabase.storage
        .from("post-thumbnail")
        .getPublicUrl(formData.thumbnailImageKey || "");

      setThumbnailUrl(data.publicUrl);
    };

    fetchImageUrl();
  }, [formData.thumbnailImageKey]);

  // 画像のアップロード
  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
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

      // アップロードが成功したら親コンポーネントに通知
      const syntheticEvent = {
        target: {
          name: "thumbnailImageKey",
          value: data.path,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    } catch (error) {
      alert("画像のアップロード中にエラーが発生しました。");
      console.error(error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-6">
        <label htmlFor="title" className="block mb-2 font-medium">
          タイトル
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="border border-gray-300 rounded-lg p-4 w-full"
          value={formData.title}
          onChange={onChange}
          disabled={isSubmitting}
          required
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>
      <div className="mb-6">
        <label htmlFor="content" className="block mb-2 font-medium">
          内容
        </label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className="border border-gray-300 rounded-lg p-4 w-full h-60"
          value={formData.content}
          onChange={onChange}
          disabled={isSubmitting}
          required
        ></textarea>
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content}</p>
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
            name="categories"
            className="border border-gray-300 rounded-lg p-4 w-full"
            value={formData.categories.map(String)}
            onChange={onCategoryChange}
            disabled={isSubmitting}
            required
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
          <p className="text-red-500 text-sm mt-1">{errors.categories}</p>
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
