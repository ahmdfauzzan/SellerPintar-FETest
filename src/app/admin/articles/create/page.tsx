"use client";

import { useState, useEffect } from "react";
import { createArticle } from "@/lib/articlesApi";
import { useRouter } from "next/navigation";
import { fetchCategories } from "@/lib/categoriesApi";

type Category = {
  id: string;
  name: string;
};

export default function CreateArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const res = await fetchCategories(1, 10, "");
      setCategories(res.data);
    };

    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      alert("Please select a category");
      return;
    }
    await createArticle({ title, content, categoryId });
    router.push("/admin/articles");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow space-y-6"
    >
      <h2 className="text-2xl font-bold mb-4">Create Article</h2>

      <div>
        <label className="block mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded"
          rows={6}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select a category</option>
          {categories.length > 0 ? (
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          ) : (
            <option disabled>Loading categories...</option>
          )}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500"
      >
        Save
      </button>
    </form>
  );
}
