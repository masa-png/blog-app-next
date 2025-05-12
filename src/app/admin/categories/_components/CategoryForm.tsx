import React from "react";

interface CategoryFormProps {
  formData: { name: string };
  errors: { name?: string };
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: (e: React.FormEvent) => void;
  submitLabel: string;
  submittingLabel: string;
}

export default function CategoryForm({
  formData,
  errors,
  isSubmitting,
  onChange,
  onSubmit,
  onDelete,
  submitLabel,
  submittingLabel,
}: CategoryFormProps) {
  return (
    <form onSubmit={onSubmit}>
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
          onChange={onChange}
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
