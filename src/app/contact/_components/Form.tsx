"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { FormData, FormErrors } from "@/app/_types";

export default function Form() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 名前：入力必須 & 30文字以内
    if (!formData.name.trim()) {
      newErrors.name = "お名前は必須です。";
    } else if (formData.name.length > 30) {
      newErrors.name = "お名前は30文字以内で入力してください。";
    }

    // メールアドレス：入力必須 & メールアドレスの形式になっていること
    if (!formData.email.trim()) {
      newErrors.email = "メールアドレスは必須です。";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "有効なメールアドレスを入力してください。";
      }
    }

    // 本文：入力必須 & 500字以内
    if (!formData.message.trim()) {
      newErrors.message = "本文は必須です。";
    } else if (formData.message.length > 500) {
      newErrors.message = "本文は500文字以内で入力してください。";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid: boolean = validateForm();

    if (!isValid) return;

    // バリデーションに成功した場合 - APIでフォームを送信
    try {
      setIsSubmitting(true);

      const response = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("送信しました");
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      } else {
        // エラーレスポンスの処理
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `エラー: ${response.status}`;
        alert(`送信に失敗しました。${errorMessage}`);
      }
    } catch (error) {
      console.error("送信エラー:", error);
      alert("送信に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-6">
        <label htmlFor="name" className="w-60">
          お名前
        </label>
        <div className="w-full">
          <input
            type="text"
            id="name"
            name="name"
            className="border border-gray-300 rounded-lg p-4 w-full"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
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
            name="email"
            className="border border-gray-300 rounded-lg p-4 w-full"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
            name="message"
            rows={8}
            className="border border-gray-300 rounded-lg p-4 w-full h-60"
            value={formData.message}
            onChange={handleChange}
            disabled={isSubmitting}
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
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
          type="reset"
          className="bg-gray-200 font-bold py-2 px-4 rounded-lg cursor-pointer"
          onClick={() => {
            setFormData({ name: "", email: "", message: "" });
            setErrors({});
          }}
          disabled={isSubmitting}
        >
          クリア
        </button>
      </div>
    </form>
  );
}
