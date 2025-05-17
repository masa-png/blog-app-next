export type Post = {
  id: number;
  title: string;
  content: string;
  thumbnailImageKey?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  postCategories: PostCategory[];
};

export type PostCategory = {
  id: number;
  postId: number;
  categoryId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  category: Category;
};

export type Category = {
  id: number;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};
