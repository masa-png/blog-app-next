import { z } from "zod";

export const postFormSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です。")
    .max(50, "タイトルは50文字以内で入力してください。"),
  content: z
    .string()
    .min(1, "内容は必須です。")
    .max(1000, "内容は1000文字以内で入力してください。"),
  thumbnailImageKey: z.string().optional(),
  categories: z
    .array(z.number())
    .min(1, "カテゴリーを1つ以上選択してください。"),
});

export type PostFormSchema = z.infer<typeof postFormSchema>;

// カテゴリーフォーム用
export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "カテゴリーを入力してください。")
    .max(50, "カテゴリーは50文字以内で入力してください。"),
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;

// 問い合わせフォーム用
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "お名前は必須です。")
    .max(30, "お名前は30文字以内で入力してください。"),
  email: z
    .string()
    .min(1, "メールアドレスは必須です。")
    .email("有効なメールアドレスを入力してください。"),
  message: z
    .string()
    .min(1, "本文は必須です。")
    .max(500, "本文は500文字以内で入力してください。"),
});

export type ContactSchema = z.infer<typeof contactSchema>;

// サインアップフォーム用
export const signupSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレは必須です")
    .email("メールアドレスの形式で入力してください"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
});

export type SignupSchema = z.infer<typeof signupSchema>;
