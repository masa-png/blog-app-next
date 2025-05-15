"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import api from "@/app/_utils/api";
import { supabase } from "@/utils/supabase";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // 固有IDを生成するライブラリ

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
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loadingCategories, setLoadingCategories] = useState(true);
  const { token } = useSupabaseSession();
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailUrl, setThumbnailUrl] = useState<null | string>(null);
  const endpoint = "/api/admin/categories";

  // カテゴリー一覧取得
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      const data = await api.get(endpoint);
      setCategories(data.categories);
      setLoadingCategories(false);
    };
    fetchCategories();
  }, [token]);

  // 画像のアップロード
  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return;
    }

    const file = event.target.files[0]; // 選択された画像を取得

    const filePath = `private/${uuidv4()}`; // ファイルパスを指定

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from("post-thumbnail") // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message);
      return;
    }

    // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    setThumbnailImageKey(data.path);

    // フォームデータにthumbnailImageKeyを設定
    const syntheticEvent = {
      target: {
        name: "thumbnailImageKey",
        value: data.path,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
  useEffect(() => {
    if (!thumbnailImageKey) return;

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post-thumbnail")
        .getPublicUrl(thumbnailImageKey);

      setThumbnailUrl(publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey]);

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
          サムネイルURL
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
          <Image
            src={thumbnailUrl}
            alt="thumbnail"
            width={400}
            height={400}
            className="mt-2"
          />
        )}
      </div>
      <div className="mb-6">
        <label htmlFor="category" className="block mb-2 font-medium">
          カテゴリー
        </label>
        <select
          id="category"
          name="categories"
          className="border border-gray-300 rounded-lg p-4 w-full"
          value={formData.categories.map(String)}
          onChange={onCategoryChange}
          disabled={isSubmitting || loadingCategories}
          required
          multiple
          size={categories.length || 1}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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
