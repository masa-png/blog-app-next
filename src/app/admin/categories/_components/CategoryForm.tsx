"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categoryFormSchema,
  CategoryFormSchema,
} from "../../../_lib/validation";
import React from "react";

interface CategoryFormProps {
  defaultValues?: CategoryFormSchema;
  onSubmit: (data: CategoryFormSchema, e: React.BaseSyntheticEvent) => void;
  onDelete?: (e: React.FormEvent) => void;
  submitLabel: string;
  submittingLabel: string;
}

export default function CategoryForm({
  defaultValues,
  onSubmit,
  onDelete,
  submitLabel,
  submittingLabel,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: defaultValues || { name: "" },
  });

  return (
    <form onSubmit={handleSubmit((data, e) => onSubmit(data, e!))}>
      <div className="mb-6">
        <label htmlFor="name" className="block mb-2 font-medium">
          カテゴリー名
        </label>
        <input
          type="text"
          id="name"
          {...register("name")}
          className="border border-gray-300 rounded-lg p-4 w-full"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
