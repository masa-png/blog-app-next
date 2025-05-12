interface CategoryFormData {
  name: string;
}

interface CategoryFormErrors {
  name?: string;
}

interface PostFormData {
  title: string;
  content: string;
  thumbnailUrl: string;
  categories: number[];
}

interface PostFormErrors {
  title?: string;
  content?: string;
  thumbnailUrl?: string;
  categories?: string;
}

export function validateCategoryForm(
  formData: CategoryFormData
): CategoryFormErrors {
  const errors: CategoryFormErrors = {};

  if (!formData.name.trim()) {
    errors.name = "カテゴリーを入力してください。";
  } else if (formData.name.length > 50) {
    errors.name = "カテゴリーは50文字以内で入力してください。";
  }

  return errors;
}

export function validatePostForm(formData: PostFormData): PostFormErrors {
  const errors: PostFormErrors = {};

  if (!formData.title.trim()) {
    errors.title = "タイトルは必須です。";
  } else if (formData.title.length > 50) {
    errors.title = "タイトルは50文字以内で入力してください。";
  }

  if (!formData.content.trim()) {
    errors.content = "内容は必須です。";
  } else if (formData.content.length > 1000) {
    errors.content = "内容は1000文字以内で入力してください。";
  }

  if (!formData.thumbnailUrl.trim()) {
    errors.thumbnailUrl = "サムネイルURLは必須です。";
  } else {
    const urlRegex = /^(https?:\/\/)[^\s]+$/;
    if (!urlRegex.test(formData.thumbnailUrl)) {
      errors.thumbnailUrl = "有効なURLを入力してください。";
    }
  }

  if (!formData.categories.length) {
    errors.categories = "カテゴリーを1つ以上選択してください。";
  }

  return errors;
}
