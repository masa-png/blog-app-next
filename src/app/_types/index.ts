export type Post = {
  id: number;
  title: string;
  thumbnailUrl: string;
  createdAt: Date | string;
  categories: string[];
  content: string;
};

export type FormData = {
  name: string;
  email: string;
  message: string;
};

export type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};
