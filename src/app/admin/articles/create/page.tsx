"use client";

import { useState, useEffect } from "react";
import { createArticle } from "@/lib/articlesApi";
import { fetchCategories } from "@/lib/categoriesApi";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

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
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      const res = await fetchCategories(1, 10, "");
      setCategories(res.data);
    };
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !categoryId) {
      setError("All fields are required");
      return;
    }

    setError(""); // Clear error sebelum submit
    await createArticle({ title, content, categoryId });
    router.push("/admin/articles");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow space-y-6 relative"
    >
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          <IoArrowBack size={24} />
        </button>
        <h2 className="text-2xl font-bold">Create Articles</h2>
      </div>

      {/* Title input */}
      <div>
        <label className="block mb-1 font-semibold">Title</label>
        <input
          type="text"
          placeholder="Input title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {!title && (
          <p className="text-red-500 text-sm mt-1">Please enter title</p>
        )}
      </div>

      {/* Category input */}
      <div>
        <label className="block mb-1 font-semibold">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select category</option>
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
        {!categoryId && (
          <p className="text-red-500 text-sm mt-1">Please select category</p>
        )}
      </div>

      {/* Content input */}
      <div>
        <label className="block mb-1 font-semibold">Content</label>
        <textarea
          placeholder="Type a content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={8}
        />
        {!content && (
          <p className="text-red-500 text-sm mt-1">
            Content field cannot be empty
          </p>
        )}
      </div>

      {/* Global error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Buttons */}
      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          onClick={() => router.push("/admin/articles")}
          className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
          Upload
        </button>
      </div>
    </form>
  );
}
