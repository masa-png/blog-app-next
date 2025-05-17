"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactSchema } from "@/app/_lib/validation";

export default function Form() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactSchema) => {
    try {
      const response = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        alert("送信しました");
        reset();
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `エラー: ${response.status}`;
        alert(`送信に失敗しました。${errorMessage}`);
      }
    } catch (error) {
      console.error("送信エラー:", error);
      alert("送信に失敗しました。もう一度お試しください。");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-center mb-6">
        <label htmlFor="name" className="w-60">
          お名前
        </label>
        <div className="w-full">
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
      </div>

      <div className="flex justify-between items-center mb-6">
        <label htmlFor="email" className="w-60">
          メールアドレス
        </label>
        <div className="w-full">
          <input
            type="email"
            id="email"
            {...register("email")}
            className="border border-gray-300 rounded-lg p-4 w-full"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <label htmlFor="message" className="w-60">
          本文
        </label>
        <div className="w-full">
          <textarea
            id="message"
            rows={8}
            {...register("message")}
            className="border border-gray-300 rounded-lg p-4 w-full h-60"
            disabled={isSubmitting}
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button
          type="submit"
          className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg mr-4 cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "送信中..." : "送信"}
        </button>
        <button
          type="button"
          className="bg-gray-200 font-bold py-2 px-4 rounded-lg cursor-pointer"
          onClick={() => {
            reset();
          }}
          disabled={isSubmitting}
        >
          クリア
        </button>
      </div>
    </form>
  );
}
