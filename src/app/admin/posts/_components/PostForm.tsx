import React from "react";

interface PostFormProps {
  formData: {
    title: string;
    content: string;
    thumbnailUrl: string;
    categories: number[];
  };

  errors: {
    title?: string;
    content?: string;
    thumbnailUrl?: string;
    categories?: string;
  };

  isSubmitting: boolean;
  categories: { id: number; name: string }[];
  loadingCategories: boolean;
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
  categories,
  loadingCategories,
  onChange,
  onCategoryChange,
  onSubmit,
  onDelete,
  submitLabel,
  submittingLabel,
}: PostFormProps) {
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
        <label htmlFor="thumbnailUrl" className="block mb-2 font-medium">
          サムネイルURL
        </label>
        <input
          type="text"
          id="thumbnailUrl"
          name="thumbnailUrl"
          className="border border-gray-300 rounded-lg p-4 w-full"
          value={formData.thumbnailUrl}
          onChange={onChange}
          disabled={isSubmitting}
          required
          placeholder="https://example.com/image.png"
        />
        {errors.thumbnailUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.thumbnailUrl}</p>
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
